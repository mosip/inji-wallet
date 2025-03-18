import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  TouchableOpacity,
  BackHandler,
  View,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ListItem, Icon} from 'react-native-elements';
import {Text, Button} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {HelpScreen} from '../../components/HelpScreen';
import {BackButton} from '../../components/ui/backButton/BackButton';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';

export const EmailManagementScreen: React.FC<
  EmailManagementScreenProps
> = () => {
  const {t} = useTranslation('SetupEmail');
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<{params: EmailManagementScreenProps}, 'params'>>();
  const {controller, isClosed} = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);

  useEffect(() => {
    const backAction = () => {
      controller.SET_KEY_MANAGEMENT_TOUR_GUIDE_EXPLORED();
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    try {
      const storedEmails = await AsyncStorage.getItem('registeredEmails');
      if (storedEmails) {
        setRegisteredEmails(JSON.parse(storedEmails));
      }
    } catch (error) {
      console.error('Error loading emails:', error);
    }
  };

  const saveEmails = async (emails: string[]) => {
    try {
      await AsyncStorage.setItem('registeredEmails', JSON.stringify(emails));
    } catch (error) {
      console.error('Error saving emails:', error);
    }
  };

  const addEmailToList = async () => {
    if (email.trim()) {
      if (registeredEmails.includes(email)) {
        Alert.alert('Email already registered!');
      } else {
        try {
          const response = await fetch(
            'https://staging.credissuer.com/api/holders/send-email-otp',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({login_type: 'email_otp', email}),
            },
          );

          const data = await response.json();

          if (response.ok) {
            Alert.alert('OTP Sent!', 'Check your email for the OTP.');
            setModalStep('otp');
          } else {
            Alert.alert('Error', data.message || 'Failed to send OTP.');
          }
        } catch (error) {
          console.error('Error sending OTP:', error);
          Alert.alert('Error', 'Failed to send OTP. Please try again.');
        }
      }
    } else {
      Alert.alert('Enter Email', 'Please enter an email address.');
    }
  };

  const verifyOtp = async () => {
    if (otp.trim()) {
      try {
        console.log('📩 Sending OTP Verification:', {email, otp});

        const response = await fetch(
          'https://staging.credissuer.com/api/holders/verify-email-otp',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, otp}),
          },
        );

        const data = await response.json();
        console.log('✅ OTP Verification Response:', data);

        if (response.ok) {
          Alert.alert(
            'OTP Verified',
            'Your OTP has been successfully verified.',
          );

          // ✅ Fetch FCM Token
          const fcmToken = await messaging().getToken();
          console.log('🔥 FCM Token:', fcmToken);

          // ✅ Call API to store FCM token
          await storeFCMToken(email, fcmToken);

          // ✅ Store email locally & reset UI
          setRegisteredEmails(prevEmails => {
            const updatedEmails = [...prevEmails, email];
            saveEmails(updatedEmails);
            return updatedEmails;
          });

          setModalVisible(false);
          setModalStep('email');
          setEmail('');
          setOtp('');
        } else {
          Alert.alert(
            'Invalid OTP',
            data.message || 'Please enter a valid OTP.',
          );
          setModalStep('email');
          setOtp('');
        }
      } catch (error) {
        console.error('❌ Error verifying OTP:', error);
        Alert.alert('Error', 'Failed to verify OTP. Please try again.');
        setModalStep('email');
        setOtp('');
      }
    } else {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
      setModalStep('email');
      setOtp('');
    }
  };

  const storeFCMToken = async (email, fcmToken) => {
    try {
      console.log('📡 Storing FCM Token:', {email, fcm_token: fcmToken});

      const response = await fetch(
        'https://staging.credissuer.com/api/holders/store-fcm',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email, fcm_token: fcmToken}),
        },
      );

      const data = await response.json();
      console.log('✅ FCM Token Storage Response:', data);

      if (response.ok) {
        Alert.alert('Success', 'FCM token stored successfully.');
      } else {
        Alert.alert(
          'Warning',
          'OTP verified, but FCM token could not be stored.',
        );
      }
    } catch (error) {
      console.error('❌ Error storing FCM Token:', error);
      Alert.alert('Error', 'Failed to store FCM token.');
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setRegisteredEmails(prevEmails => {
      const updatedEmails = prevEmails.filter(email => email !== emailToRemove);
      saveEmails(updatedEmails);
      return updatedEmails;
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <View style={Theme.KeyManagementScreenStyle.outerViewStyle}>
        <TouchableOpacity onPress={isClosed}>
          <BackButton
            onPress={() => {
              controller.SET_KEY_MANAGEMENT_TOUR_GUIDE_EXPLORED();
              navigation.goBack();
            }}
          />
        </TouchableOpacity>
        <Text
          testID="emailManagementHeadingSettingsScreen"
          style={[
            Theme.KeyManagementScreenStyle.heading,
            {textAlign: 'center'},
          ]}>
          {t('Registered Emails')}
        </Text>
        <HelpScreen
          source={'mailManagement'}
          triggerComponent={
            <Icon
              testID="mailManagementHelpIcon"
              accessible={true}
              name="question"
              type="font-awesome"
              size={21}
              style={Theme.Styles.IconContainer}
              color={Theme.Colors.Icon}
            />
          }
        />
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 80}}>
        {registeredEmails.map((item, index) => (
          <ListItem key={index} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item}</ListItem.Title>
            </ListItem.Content>
            <TouchableOpacity
              onPress={() => removeEmail(item)}
              style={{padding: 5, backgroundColor: '#2A2DA4', borderRadius: 5}}>
              <Text style={{color: 'white', fontSize: 12}}>Remove</Text>
            </TouchableOpacity>
          </ListItem>
        ))}
      </ScrollView>

      <View style={{position: 'absolute', bottom: 20, left: 20, right: 20}}>
        <Button
          testID="saveEmailOrderingPreference"
          type="gradient"
          title={t('Add New Email')}
          onPress={() => setModalVisible(true)}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: '80%',
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
              position: 'relative',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  flex: 1,
                }}>
                {modalStep === 'email' ? t('Enter your Email') : t('Enter OTP')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" type="material" color="black" size={30} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                padding: 10,
                marginBottom: 15,
              }}
              placeholder={
                modalStep === 'email' ? t('Enter your email') : t('Enter OTP')
              }
              value={modalStep === 'email' ? email : otp}
              onChangeText={modalStep === 'email' ? setEmail : setOtp}
              keyboardType={modalStep === 'email' ? 'email-address' : 'numeric'}
            />
            <Button
              title={modalStep === 'email' ? t('Send OTP') : t('Verify')}
              testID="sendotp"
              type="gradient"
              onPress={modalStep === 'email' ? addEmailToList : verifyOtp}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
