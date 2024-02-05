import {Theme} from './ui/styleUtils';
import {View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-elements';
import {SvgImage} from './ui/svg';
import testIDProps from '../shared/commonUtil';

export const ProfileIcon: React.FC = props => {
  return (
    <React.Fragment>
      <View
        style={Theme.Styles.ProfileIconContainer}
        {...testIDProps(`ProfileIconOuter`)}>
        {props?.isPinned && SvgImage.pinIcon()}
        <View
          {...testIDProps(`ProfileIconInner`)}
          style={[
            Theme.Styles.ProfileIconInnerStyle,
            !props?.isPinned && Theme.Styles.ProfileIconPinnedStyle,
          ]}>
          <Icon
            {...testIDProps(`ProfileIcon`)}
            name="person"
            color={Theme.Colors.Icon}
            size={40}
          />
        </View>
      </View>
    </React.Fragment>
  );
};
