import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Theme } from './ui/styleUtils';

const VerifiedIcon: React.FC = () => {
  return (
    <View style={Theme.Styles.verifiedIconContainer}>
      <View style={Theme.Styles.verifiedIconInner}>
        <Icon name="check-circle" color={Theme.Colors.VerifiedIcon} size={14} />
      </View>
    </View>
  );
};

export default VerifiedIcon;
