import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { ProfileScreen } from './ProfileScreen';
import { TransactionHistoryScreen } from './TransactionHistoryScreen';
import { NavigationProp } from '@react-navigation/native';
import { MainBottomTabParamList } from '../../routes/main';
import { CreditsScreen } from './CreditsScreen';
import { RevokeScreen } from './RevokeScreen';
import { Icon } from 'react-native-elements';
import { Colors } from '../../components/ui/styleUtils';
import { Row } from '../../components/ui';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useTranslation } from 'react-i18next';

const ProfileStack = createNativeStackNavigator();

export type ProfileStackParamList = {
  RevokeScreen: undefined;
  ProfileScreen: undefined;
  TransactionHistoryScreen: undefined;
  CreditsScreen: undefined;
};

export type ScanLayoutNavigation = NavigationProp<
  ProfileStackParamList & MainBottomTabParamList
>;

export const ProfileLayout: React.FC<
  NativeStackScreenProps<MainBottomTabParamList, 'Profile'>
> = (props) => {
  const { t } = useTranslation('ProfileLayout');
  const options: NativeStackNavigationOptions = {
    headerLeft: () => (
      <Row margin={[0, 16, 0, 0]}>
        <Icon
          name="chevron-left"
          color={Colors.Orange}
          onPress={() => props.navigation.pop()}
        />
      </Row>
    ),
    headerRight: () => (
      <LanguageSelector
        triggerComponent={<Icon name="language" color={Colors.Orange} />}
      />
    ),
    headerTitleAlign: 'center',
    title: t('profile').toUpperCase(),
  };

  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={options}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen
        name="TransactionHistoryScreen"
        component={TransactionHistoryScreen}
        options={{
          title: t('transactionHistoryScreen.title'),
        }}
      />
      <ProfileStack.Screen
        name="RevokeScreen"
        component={RevokeScreen}
        options={{
          title: t('revokeScreen.title'),
        }}
      />
      <ProfileStack.Screen
        name="CreditsScreen"
        component={CreditsScreen}
        options={{
          title: t('creditsScreen.title'),
        }}
      />
    </ProfileStack.Navigator>
  );
};
