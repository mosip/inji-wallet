import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Overlay, LinearProgress } from 'react-native-elements';
import { Column, Text } from './ui';
import { Theme } from './ui/styleUtils';

const styles = StyleSheet.create({
  overlay: {
    ...Theme.elevation(5),
    backgroundColor: Theme.Colors.whiteBackgroundColor,
  },
});

export const MessageOverlay: React.FC<MessageOverlayProps> = (props) => {
  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={styles.overlay}
      onBackdropPress={props.onBackdropPress}
      onShow={props.onShow}>
      <Column padding="24" width={Dimensions.get('screen').width * 0.8}>
        {props.title && (
          <Text weight="semibold" margin="0 0 12 0">
            {props.title}
          </Text>
        )}
        {props.message && <Text margin="0 0 12 0">{props.message}</Text>}
        {props.hasProgress && (
          <LinearProgress
            variant="indeterminate"
            color={Theme.Colors.Loading}
          />
        )}
      </Column>
    </Overlay>
  );
};

interface MessageOverlayProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  hasProgress?: boolean;
  onBackdropPress?: () => void;
  onShow?: () => void;
}
