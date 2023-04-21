import React, { useRef, useContext } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Dimensions, Image, StatusBar, View } from 'react-native';
import { Centered, Column, Row, Text, Button } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useSelector } from '@xstate/react';
import { GlobalContext } from '../../shared/GlobalContext';
import { selectVcLabel } from '../../machines/settings';
import { useTranslation } from 'react-i18next';
import { RootRouteProps } from '../../routes';
import { useWelcomeScreen } from '../WelcomeScreenController';
import LinearGradient from 'react-native-linear-gradient';

export const IntroSlidersScreen: React.FC<RootRouteProps> = (props) => {
  const slider = useRef<AppIntroSlider>();

  const { t } = useTranslation('OnboardingOverlay');
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');
  const vcLabel = useSelector(settingsService, selectVcLabel);
  const controller = useWelcomeScreen(props);

  const slides = [
    {
      key: 'one',
      title: t('stepOneTitle'),
      text: t('stepOneText', { vcLabel: vcLabel.plural }),
      image: Theme.sharingIntro,
    },
    {
      key: 'two',
      title: t('stepTwoTitle', { vcLabel: vcLabel.singular }),
      text: t('stepTwoText', { vcLabel: vcLabel.plural }),
      image: Theme.walletIntro,
    },
    {
      key: 'three',
      title: t('stepThreeTitle'),
      text: t('stepThreeText', { vcLabel: vcLabel.plural }),
      image: Theme.IntroScanner,
    },
  ];

  const renderItem = ({ item }) => {
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
                style={{ marginTop: 50, marginBottom: 30 }}
                source={Theme.injiSmallLogo}
              />
            </Column>

            <Column
              style={{
                flex: 1,
                alignItems: 'flex-end',
              }}>
              <Button
                type="plain"
                title={t('skip')}
                onPress={controller.NEXT}
              />
            </Column>
          </Row>
          <Image source={item.image} />
          <Column
            style={Theme.OnboardingOverlayStyles.bottomContainer}
            crossAlign="center"
            backgroundColor={Theme.Colors.whiteText}
            width={Dimensions.get('screen').width}>
            <Text weight="semibold" margin="0 0 18 0">
              {item.title}
            </Text>
            <Text margin="0 0 150 0" color={Theme.Colors.GrayText}>
              {item.text}
            </Text>
            {item.footer}
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
          style={{ borderRadius: 10, height: 50, marginTop: -10 }}>
          <Text
            weight="semibold"
            align="center"
            color="#FFFFFF"
            margin="10 0 0 0">
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
          style={{ borderRadius: 10, height: 50, marginTop: -10 }}>
          <Text
            weight="semibold"
            align="center"
            color="#FFFFFF"
            margin="10 0 0 0">
            {t('stepThreeButton')}
          </Text>
        </LinearGradient>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
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
          marginBottom: 90,
        }}
        dotStyle={{ backgroundColor: Theme.Colors.dotColor, marginBottom: 90 }}
        renderItem={renderItem}
        onDone={() => controller.NEXT()}
      />
    </View>
  );
};
