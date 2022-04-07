import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors } from './ui/styleUtils';

export function LanguageSelector() {
  return (
    <View>
      <Icon name="language" color={Colors.Orange} />
    </View>
  );
}
