import React from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import {Theme} from './ui/styleUtils';

const PendingIcon: React.FC = () => {
  return (
    <View style={Theme.Styles.verificationStatusIconContainer}>
      <View style={Theme.Styles.verificationStatusIconInner}>
        <Icon
          name="alert-circle"
          type="material-community"
          color={Theme.Colors.PendingIcon}
          size={12}
        />
      </View>
    </View>
  );
};

export default PendingIcon;
