import {Theme} from './ui/styleUtils';
import {View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-elements';
import {SvgImage} from './ui/svg';

export const ProfileIcon: React.FC<ProfileIconProps> = props => {
  return (
    <>
      <View style={Theme.Styles.ProfileContainer}>
        <View style={props.profileIconContainerStyles}>
          <Icon name="person" color="#A5A5A5" size={props.profileIconSize} />
        </View>
        {props?.isPinned &&
          SvgImage.pinIcon(Theme.Styles.ProfileIconPinnedStyle)}
      </View>
    </>
  );
};

interface ProfileIconProps {
  isPinned?: boolean;
  profileIconContainerStyles: object;
  profileIconSize: number;
}
