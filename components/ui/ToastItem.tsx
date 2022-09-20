import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { Theme } from './styleUtils';

export const ToastItem: React.FC<ToastProps> = (props) => {
  return (
    <View style={Theme.ToastItemStyles.toastContainer}>
      <Text
        align="center"
        margin="8 16"
        color={Theme.Colors.ToastItemText}
        style={Theme.ToastItemStyles.messageContainer}>
        {props.message}
      </Text>
    </View>
  );
};

interface ToastProps {
  message: string;
}
