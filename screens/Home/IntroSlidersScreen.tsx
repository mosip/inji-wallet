import React, {useRef} from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Dimensions, Image, StatusBar, View} from 'react-native';
import {Centered, Column, Row, Text, Button} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {useTranslation} from 'react-i18next';
import {RootRouteProps} from '../../routes';
import {useWelcomeScreen} from '../WelcomeScreenController';
import LinearGradient from 'react-native-linear-gradient';

export const IntroSlidersScreen: React.FC<RootRouteProps> = props => {
  const slider = useRef<AppIntroSlider>();

  const {t} = useTranslation('OnboardingOverlay');
  const controller = useWelcomeScreen(props);

  const slides = [
    {
      key: 'one',
      title: t('stepOneTitle'),
      text: t('stepOneText'),
      image: Theme.protectPrivacy,
    },
    {
      key: 'two',
      title: t('stepTwoTitle'),
      text: t('stepTwoText'),
      image: Theme.walletIntro,
    },
    {
      key: 'three',
      title: t('stepThreeTitle'),
      text: t('stepThreeText'),
      image: Theme.sharingIntro,
    },
    {
      key: 'four',
      title: t('stepFourTitle'),
      text: t('stepFourText'),
      image: Theme.IntroScanner,
    },
  ];

  const renderItem = ({item}) => {
    return (
      <LinearGradient colors={Theme.Colors.gradientBtn}>
        <Centered>
          <Row crossAlign="center">
            <Column
              style={{
                flex: 3,
                alignItems: 'flex-end',
                marginRight: 75,
              }}>
              <Image
                style={{marginTop: 50, marginBottom: 30}}
                source={Theme.injiSmallLogo}
              />
            </Column>

            <Column
              style={{
                flex: 1,
                alignItems: 'flex-end',
              }}>
              {controller.isPasscodeSet() ? (
                <Button
                  testID="skip"
                  type="plain"
                  title={t('skip')}
                  onPress={controller.NEXT}
                />
              ) : (
                <Button
                  testID="back"
                  type="plain"
                  title={t('back')}
                  onPress={controller.BACK}
                />
              )}
            </Column>
          </Row>
          <Image
            source={item.image}
            resizeMode="contain"
            style={{height: Dimensions.get('screen').height * 0.6}}
          />
          <Column
            testID="introSlide"
            style={Theme.OnboardingOverlayStyles.bottomContainer}
            crossAlign="center"
            backgroundColor={Theme.Colors.whiteText}
            width={Dimensions.get('screen').width}>
            <Text
              testID="introTitle"
              style={{paddingTop: 3}}
              weight="semibold"
              margin="0 0 18 0">
              {item.title}
            </Text>
            <Text
              testID="introText"
              style={{paddingTop: 7}}
              margin="0 0 150 0"
              size="large"
              color={Theme.Colors.GrayText}>
              {item.text}
            </Text>
          </Column>
        </Centered>
      </LinearGradient>
    );
  };

  const renderNextButton = () => {
    return (
      <View>
        <LinearGradient
          colors={Theme.Colors.gradientBtn}
          style={{borderRadius: 10, height: 50, marginTop: -10}}>
          <Text
            testID="next"
            style={{paddingTop: 3}}
            weight="semibold"
            align="center"
            color="#FFFFFF"
            margin="15 0 0 0">
            {t('next')}
          </Text>
        </LinearGradient>
      </View>
    );
  };
  const renderDoneButton = () => {
    return (
      <View>
        <LinearGradient
          colors={Theme.Colors.gradientBtn}
          style={{borderRadius: 10, height: 50, marginTop: -10}}>
          <Text
            testID="getStarted"
            style={{paddingTop: 3}}
            weight="semibold"
            align="center"
            color="#FFFFFF"
            margin="15 0 0 0">
            {controller.isPasscodeSet() ? t('getStarted') : t('goBack')}
          </Text>
        </LinearGradient>
      </View>
    );
  };
  return (
    <Column style={{flex: 1}}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <AppIntroSlider
        data={slides}
        renderDoneButton={renderDoneButton}
        renderNextButton={renderNextButton}
        bottomButton
        ref={slider}
        activeDotStyle={{
          backgroundColor: Theme.Colors.Icon,
          width: 30,
          marginBottom: 47,
        }}
        dotStyle={{backgroundColor: Theme.Colors.dotColor, marginBottom: 47}}
        renderItem={renderItem}
        onDone={() =>
          controller.isPasscodeSet() ? controller.NEXT() : controller.BACK()
        }
      />
    </Column>
  );
};
