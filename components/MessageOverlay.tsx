import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Dimensions, StyleSheet } from 'react-native';
import { Overlay, LinearProgress } from 'react-native-elements';
import { Column, Text } from './ui';
import { Colors, elevation } from './ui/styleUtils';

const styles = StyleSheet.create({
  overlay: {
    ...elevation(5),
    backgroundColor: Colors.White,
  },
  close: { 
    width: 30, 
    height: 30, 
    padding: 5, 
    borderRadius: 30, 
    backgroundColor: Colors.Orange,
    position: 'absolute', 
    top: -10, right: -10, 
  }
});

export const MessageOverlay: React.FC<MessageOverlayProps> = (props) => {
  const [isVisible, setIsVisible] = useState(props.isVisible)

  const onCancelPress = () => {
    setIsVisible(false);
    props.onCancel();
  }

  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={styles.overlay}
      onBackdropPress={props.onBackdropPress}
    > 
      { props.hasProgress && (
        <Icon
          name="close"
          color={Colors.White}
          style={styles.close}
          onPress={onCancelPress}
          size={20}
        />
      )}
      <Column padding="24" width={Dimensions.get('screen').width * 0.8}>
        {props.title && (
          <Text weight="semibold" margin="0 0 12 0">
            {props.title}
          </Text>
        )}
        {props.message && <Text margin="0 0 12 0">{props.message}</Text>}
        {props.hasProgress && (
          <LinearProgress variant="indeterminate" color={Colors.Orange} />
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
  onCancel?: () => void;
}
