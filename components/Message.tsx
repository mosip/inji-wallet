import React from 'react';
import { useTranslation } from 'react-i18next';

import { Dimensions, View } from 'react-native';
import { LinearProgress } from 'react-native-elements';
import { Button, Centered, Column, Text } from './ui';
import { Theme } from './ui/styleUtils';

export const Message: React.FC<MessageProps> = (props) => {
  const { t } = useTranslation('common');
  return (
    <View
      style={Theme.MessageStyles.viewContainer}
      onTouchStart={props.onBackdropPress}>
      <Centered fill>
        <Column
          width={Dimensions.get('screen').width * 0.8}
          style={Theme.MessageStyles.boxContainer}>
          <Column>
            {props.title && (
              <Text weight="semibold" margin="0 0 12 0">
                {props.title}
              </Text>
            )}
            {props.message && <Text margin="0 0 12 0">{props.message}</Text>}
            {props.progress && <Progress progress={props.progress} />}
            {props.hint && (
              <Text
                size="smaller"
                color={Theme.Colors.textLabel}
                margin={[4, 0, 0, 0]}>
                {props.hint}
              </Text>
            )}
          </Column>
          {props.onCancel && (
            <Button
              title={t('cancel')}
              onPress={props.onCancel}
              styles={Theme.MessageStyles.button}
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
      <LinearProgress variant="indeterminate" color={Theme.Colors.Icon} />
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
