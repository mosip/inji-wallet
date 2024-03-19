import React, {useRef} from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Dimensions, Image, StatusBar, View} from 'react-native';
import {Centered, Column, Row, Text, Button} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {useTranslation} from 'react-i18next';
import {RootRouteProps} from '../../routes';
import {useWelcomeScreen} from '../WelcomeScreenController';
import LinearGradient from 'react-native-linear-gradient';
import {SvgImage} from '../../components/ui/svg';
import testIDProps from '../../shared/commonUtil';

export const IntroSlidersScreen: React.FC<RootRouteProps> = props => {
  const slider = useRef<AppIntroSlider>();

  const {t} = useTranslation('OnboardingOverlay');
  const controller = useWelcomeScreen(props);

  const slides = [
    {
      key: 'one',
      title: t('stepOneTitle'),
      text: t('stepOneText'),
      image: Theme.IntroWelcome,
    },
    {
      key: 'two',
      title: t('stepTwoTitle'),
      text: t('stepTwoText'),
      image: Theme.SecureSharing,
    },
    {
      key: 'three',
      title: t('stepThreeTitle'),
      text: t('stepThreeText'),
      image: Theme.DigitalWallet,
    },
    {
      key: 'four',
      title: t('stepFourTitle'),
      text: t('stepFourText'),
      image: Theme.IntroShare,
    },
    {
      key: 'five',
      title: t('stepFiveTitle'),
      text: t('stepFiveText'),
      image: Theme.IntroBackup,
    },
  ];

  const isPasscodeSet = controller.isPasscodeSet();

  const renderItem = ({item}) => {
    return (
      <LinearGradient colors={Theme.Colors.gradientBtn}>
        <Centered>
          <Row align="space-between" style={Theme.Styles.introSliderHeader}>
            <Column style={{marginLeft: Dimensions.get('screen').width * 0.4}}>
              {SvgImage.InjiSmallLogo()}
            </Column>

            {item.key !== 'five' && (
              <Button
                testID={
                  isPasscodeSet
                    ? `backButton-${item.key}`
                    : `skipButton-${item.key}`
                }
                type="plain"
                title={isPasscodeSet ? t('back') : t('skip')}
                onPress={isPasscodeSet ? controller.BACK : controller.NEXT}
                styles={{height: 40, maxWidth: 115}}
              />
            )}
          </Row>
          <Image
            {...testIDProps(`introImage-${item.key}`)}
            source={item.image}
            resizeMode="contain"
            style={{height: Dimensions.get('screen').height * 0.6}}
          />
          <Column
            testID={`introSlide-${item.key}`}
            style={Theme.OnboardingOverlayStyles.bottomContainer}
            crossAlign="center"
            backgroundColor={Theme.Colors.whiteText}
            width={Dimensions.get('screen').width}>
            <Text
              testID={`introTitle-${item.key}`}
              style={{paddingTop: 3}}
              weight="semibold"
              margin="0 0 18 0">
              {item.title}
            </Text>
            <Text
              testID={`introText-${item.key}`}
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
      <View {...testIDProps('nextButton')}>
        <LinearGradient
          colors={Theme.Colors.gradientBtn}
          style={Theme.Styles.introSliderButton}>
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
    const isPasscodeSet = controller.isPasscodeSet();
    const testId = isPasscodeSet ? 'goBack' : 'getStarted';
    const buttonText = isPasscodeSet ? t('goBack') : t('getStarted');
    return (
      <View {...testIDProps(testId)}>
        <LinearGradient
          colors={Theme.Colors.gradientBtn}
          style={Theme.Styles.introSliderButton}>
          <Text
            style={{paddingTop: 3}}
            weight="semibold"
            align="center"
            color="#FFFFFF"
            margin="15 0 0 0">
            {buttonText}
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
          controller.isPasscodeSet() ? controller.BACK() : controller.NEXT()
        }
      />
    </Column>
  );
};
