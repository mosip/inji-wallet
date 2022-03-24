import React from 'react';
import { View, Image } from 'react-native';

export const Logo: React.FC<LogoProps> = (props) => {
  return (
    <View>
      <Image
        style={{ resizeMode: 'contain', ...props }}
        source={require('../assets/mosip-logo.png')}
      />
    </View>
  );
};

interface LogoProps {
  width?: number | string;
  height?: number | string;
}
