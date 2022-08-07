import React, { useRef, useContext } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { Button, Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useSelector } from '@xstate/react';
import { GlobalContext } from '../../shared/GlobalContext';
import { selectVcLabel } from '../../machines/settings';
import { useTranslation } from 'react-i18next';

export const OnboardingOverlay: React.FC<OnboardingProps> = (props) => {
  const slider = useRef<AppIntroSlider>();

  const { t } = useTranslation('OnboardingOverlay');
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');
  const vcLabel = useSelector(settingsService, selectVcLabel);

  const slides = [
    {
      key: 'one',
      title: t('stepOneTitle'),
      text: t('stepOneText', { vcLabel: vcLabel.plural }),
    },
    {
      key: 'two',
      title: t('stepTwoTitle', { vcLabel: vcLabel.singular }),
      text: t('stepTwoText', { vcLabel: vcLabel.plural }),
    },
    {
      key: 'three',
      title: t('stepThreeTitle'),
      text: t('stepThreeText', { vcLabel: vcLabel.plural }),
      footer: (
        <Button
          margin="24 0 0 0"
          raised
          type="outline"
          title={t('stepThreeButton', { vcLabel: vcLabel.singular })}
          onPress={props.onAddVc}
        />
      ),
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <View style={Theme.Styles.slide}>
        <ScrollView showsVerticalScrollIndicator={true}>
          <Text style={Theme.Styles.sliderTitle}>{item.title}</Text>
          <Text style={Theme.Styles.text}>{item.text}</Text>
          {item.footer}
        </ScrollView>
      </View>
    );
  };

  const renderPagination = (activeIndex: number) => {
    return (
      <View style={Theme.Styles.paginationContainer}>
        <SafeAreaView>
          <View style={Theme.Styles.paginationDots}>
            {slides.length > 1 &&
              slides.map((_, i) => (
                <Icon
                  key={i}
                  color={Theme.Colors.White}
                  size={10}
                  name="circle"
                  style={{ opacity: i === activeIndex ? 1 : 0.6, margin: 2 }}
                />
              ))}
          </View>
        </SafeAreaView>
      </View>
    );
  };

  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={Theme.Styles.overlay}
      transparent
      onBackdropPress={props.onDone}>
      <Column fill align="flex-end">
        <Icon
          name="close"
          color={Theme.Colors.White}
          onPress={props.onDone}
          containerStyle={Theme.Styles.closeIcon}
        />
        <View style={Theme.Styles.slider}>
          <AppIntroSlider
            renderItem={renderItem}
            data={slides}
            style={Theme.Styles.appSlider}
            ref={slider}
            renderPagination={renderPagination}
          />
        </View>
      </Column>
    </Overlay>
  );
};

interface OnboardingProps {
  isVisible: boolean;
  onDone: () => void;
  onAddVc: () => void;
}
