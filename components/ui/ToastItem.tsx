import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Text } from './Text';
import { Colors } from './styleUtils';

const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: Colors.Orange,
    position: 'absolute',
    alignSelf: 'center',
    top: 80,
    borderRadius: 4,
    left: 16,
    right: 16,
  },
  messageContainer: {
    fontSize: 12,
  },
});

export const ToastItem: React.FC<ToastProps> = (props) => {
  return (
    <View style={styles.toastContainer}>
      <Text
        align="center"
        margin="8 16"
        color={Colors.White}
        style={styles.messageContainer}>
        {props.message}
      </Text>
    </View>
  );
};

interface ToastProps {
  message: string;
}
