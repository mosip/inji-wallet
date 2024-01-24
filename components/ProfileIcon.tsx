import {Theme} from './ui/styleUtils';
import {View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-elements';
import {SvgImage} from './ui/svg';

export const ProfileIcon: React.FC = props => {
  return (
    <>
      <View style={Theme.Styles.ProfileIconContainer}>
        {props?.isPinned && SvgImage.pinIcon()}
        <View
          style={[
            Theme.Styles.ProfileIconInnerStyle,
            !props?.isPinned && Theme.Styles.ProfileIconPinnedStyle,
          ]}>
          <Icon name="person" color={Theme.Colors.Icon} size={40} />
        </View>
      </View>
    </>
  );
};
