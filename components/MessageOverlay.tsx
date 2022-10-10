import React from 'react';
import { useTranslation } from 'react-i18next';

import { Dimensions, StyleSheet } from 'react-native';
import { Overlay, LinearProgress } from 'react-native-elements';
import { Button, Column, Text } from './ui';
import { Colors, elevation } from './ui/styleUtils';

const styles = StyleSheet.create({
  overlay: {
    ...elevation(5),
    backgroundColor: Colors.White,
    padding: 0,
  },
  button: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

export const MessageOverlay: React.FC<MessageOverlayProps> = (props) => {
  const { t } = useTranslation('common');
  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={styles.overlay}
      onBackdropPress={props.onBackdropPress}>
      <Column width={Dimensions.get('screen').width * 0.8}>
        <Column padding="24">
          {props.title && (
            <Text weight="semibold" margin="0 0 12 0">
              {props.title}
            </Text>
          )}
          {props.message && <Text margin="0 0 12 0">{props.message}</Text>}
          {props.progress && <Progress progress={props.progress} />}
          {props.hint && (
            <Text size="smaller" color={Colors.Grey} margin={[4, 0, 0, 0]}>
              {props.hint}
            </Text>
          )}
          {props.children}
        </Column>
        {!props.children && props.onCancel ? (
          <Button
            title={t('cancel')}
            onPress={props.onCancel}
            styles={styles.button}
          />
        ) : null}
      </Column>
    </Overlay>
  );
};

const Progress: React.FC<Pick<MessageOverlayProps, 'progress'>> = (props) => {
  return typeof props.progress === 'boolean' ? (
    props.progress && (
      <LinearProgress variant="indeterminate" color={Colors.Orange} />
    )
  ) : (
    <LinearProgress variant="determinate" value={props.progress} />
  );
};

export interface MessageOverlayProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  progress?: boolean | number;
  hint?: string;
  onCancel?: () => void;
  onBackdropPress?: () => void;
}
