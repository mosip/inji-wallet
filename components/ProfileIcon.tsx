import {Theme} from './ui/styleUtils';
import {View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-elements';
import {SvgImage} from './ui/svg';
import testIDProps from '../shared/commonUtil';

export const ProfileIcon: React.FC<ProfileIconProps> = props => {
  return (
    <>
      <View
        {...testIDProps(`ProfileIconOuter`)}
        style={Theme.Styles.ProfileContainer}>
        <View
          {...testIDProps(`ProfileIconInner`)}
          style={props.profileIconContainerStyles}>
          <Icon
            {...testIDProps(`ProfileIcon`)}
            name="person"
            color={Theme.Colors.ProfileIconColor}
            size={props.profileIconSize}
          />
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
