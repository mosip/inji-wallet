import {Theme} from './ui/styleUtils';
import {Icon} from 'react-native-elements';
import {View} from 'react-native';
import React from 'react';

export const ProfileIcon: React.FC = () => {
  return (
    <View
      style={{
        alignSelf: 'center',
        justifyContent: 'center',
        width: 90,
        height: 90,
        borderRadius: 15,
        borderWidth: 0.3,
        borderColor: Theme.Colors.Icon,
        backgroundColor: Theme.Colors.whiteBackgroundColor,
      }}>
      <Icon name="person" color={Theme.Colors.Icon} size={40} />
    </View>
  );
};
