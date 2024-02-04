import {Theme} from './ui/styleUtils';
import {View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-elements';
import {SvgImage} from './ui/svg';

export const ProfileIcon: React.FC = props => {
  return (
    <React.Fragment>
      <View
        style={Theme.Styles.ProfileIconContainer}
        testID={`ProfileIconOuter`}>
        {props?.isPinned && SvgImage.pinIcon()}
        <View
          testID={`ProfileIconInner`}
          style={[
            Theme.Styles.ProfileIconInnerStyle,
            !props?.isPinned && Theme.Styles.ProfileIconPinnedStyle,
          ]}>
          <Icon
            testID={`ProfileIcon`}
            name="person"
            color={Theme.Colors.Icon}
            size={40}
          />
        </View>
      </View>
    </React.Fragment>
  );
};
