import React from 'react';
import { View, Image } from 'react-native';
import { Theme } from './ui/styleUtils';

export const Logo: React.FC<LogoProps> = (props) => {
  return (
    <View>
      <Image
        style={{ resizeMode: 'contain', ...props }}
        source={Theme.MosipLogo}
      />
    </View>
  );
};

interface LogoProps {
  width?: number | string;
  height?: number | string;
}
