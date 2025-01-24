import React from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Theme } from './styleUtils';
import { SvgImage } from './svg';

export const HelpIcon = () => {
  return (  
    <LinearGradient
      style={{borderRadius: 8, marginRight: 4}}
      colors={Theme.Colors.GradientColorsLight}
      start={Theme.LinearGradientDirection.start}
      end={Theme.LinearGradientDirection.end}>
      <View testID="help"></View>
      <View style={Theme.Styles.IconContainer}>{SvgImage.questionIcon()}</View>
    </LinearGradient>
  );
};