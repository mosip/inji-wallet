import React from 'react';
import { useTranslation } from 'react-i18next';

import { Dimensions, StyleSheet, View } from 'react-native';
import { LinearProgress } from 'react-native-elements';
import { Button, Centered, Column, Text } from './ui';
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
  viewContainer: {
    backgroundColor: 'rgba(0,0,0,.6)',
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    position: 'absolute',
    top: 0,
    zIndex: 9,
  },
  boxContainer: {
    backgroundColor: Colors.White,
    padding: 24,
    elevation: 6,
    borderRadius: 4,
  },
});

export const Message: React.FC<MessageProps> = (props) => {
  const { t } = useTranslation('common');
  return (
    <View style={styles.viewContainer} onTouchStart={props.onBackdropPress}>
      <Centered fill>
        <Column
          width={Dimensions.get('screen').width * 0.8}
          style={styles.boxContainer}>
          <Column>
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
          </Column>
          {props.onCancel && (
            <Button
              title={t('cancel')}
              onPress={props.onCancel}
              styles={styles.button}
            />
          )}
        </Column>
      </Centered>
    </View>
  );
};

const Progress: React.FC<Pick<MessageProps, 'progress'>> = (props) => {
  return typeof props.progress === 'boolean' ? (
    props.progress && (
      <LinearProgress variant="indeterminate" color={Colors.Orange} />
    )
  ) : (
    <LinearProgress variant="determinate" value={props.progress} />
  );
};

export interface MessageProps {
  title?: string;
  message?: string;
  progress?: boolean | number;
  hint?: string;
  onCancel?: () => void;
  onBackdropPress?: () => void;
}
