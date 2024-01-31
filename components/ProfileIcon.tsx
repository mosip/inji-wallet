import {Theme} from './ui/styleUtils';
import {View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-elements';
import {SvgImage} from './ui/svg';

export const ProfileIcon: React.FC<ProfileIconProps> = props => {
  return (
    <>
      <View style={Theme.Styles.ProfileContainer}>
        <View style={Theme.Styles.ProfileIconContainer}>
          <Icon name="person" color="#A5A5A5" size={30} />
        </View>
        {props?.isPinned &&
          SvgImage.pinIcon(Theme.Styles.ProfileIconPinnedStyle)}
      </View>
    </>
  );
};

interface ProfileIconProps {
  isPinned?: boolean;
}
