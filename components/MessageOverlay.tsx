import React from 'react';
import {useTranslation} from 'react-i18next';

import {Dimensions, StyleSheet} from 'react-native';
import {Overlay, LinearProgress} from 'react-native-elements';
import {Button, Column, Text} from './ui';
import {Theme} from './ui/styleUtils';

export const MessageOverlay: React.FC<MessageOverlayProps> = props => {
  const {t} = useTranslation('common');
  const style = StyleSheet.create({
    customHeight: {
      height: props.customHeight
        ? props.customHeight
        : props.progress
        ? 100
        : 150,
    },
  });
  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={Theme.MessageOverlayStyles.overlay}
      onShow={props.onShow}
      onBackdropPress={props.onBackdropPress}>
      <Column
        width={Dimensions.get('screen').width * 0.8}
        style={[Theme.MessageOverlayStyles.popupOverLay, style.customHeight]}>
        <Column padding="21" crossAlign="center">
          {props.title && (
            <Text
              align="center"
              weight="bold"
              margin="0 0 10 0"
              color={Theme.Colors.Details}>
              {props.title}
            </Text>
          )}
          {props.message && (
            <Text
              align="center"
              weight="semibold"
              size="small"
              margin="10 0 12 0"
              color={Theme.Colors.Details}>
              {props.message}
            </Text>
          )}
          {props.progress && <Progress progress={props.progress} />}
          {props.hint && (
            <Text
              size="smaller"
              color={Theme.Colors.textLabel}
              margin={[4, 0, 0, 0]}>
              {props.hint}
            </Text>
          )}
          {props.children}
        </Column>
        {!props.children && props.onCancel ? (
          <Button
            type="gradient"
            title={t('cancel')}
            onPress={props.onCancel}
            styles={Theme.MessageOverlayStyles.button}
          />
        ) : null}
        {!props.children && props.onCustomBtnTxt ? (
          <Button
            type="gradient"
            title={t(props.onCustomBtnTxt)}
            onPress={props.onCustomAction}
            styles={Theme.MessageOverlayStyles.button}
          />
        ) : null}
      </Column>
    </Overlay>
  );
};

export const ErrorMessageOverlay: React.FC<ErrorMessageOverlayProps> = ({
  isVisible,
  error,
  onDismiss,
  translationPath,
}) => {
  const {t} = useTranslation(translationPath);

  return (
    <MessageOverlay
      isVisible={isVisible}
      title={t(error + '.title')}
      message={t(error + '.message')}
      onBackdropPress={onDismiss}
    />
  );
};

export interface ErrorMessageOverlayProps {
  isVisible: boolean;
  error?: string;
  onDismiss?: () => void;
  translationPath: string;
}

const Progress: React.FC<Pick<MessageOverlayProps, 'progress'>> = props => {
  return typeof props.progress === 'boolean' ? (
    props.progress && (
      <LinearProgress variant="indeterminate" color={Theme.Colors.Loading} />
    )
  ) : (
    <LinearProgress variant="determinate" value={props.progress} />
  );
};

export interface MessageOverlayProps {
  isVisible: boolean;
  title?: string;
  onCustomBtnTxt?: string;
  onCustomAction: () => void;
  message?: string;
  progress?: boolean | number;
  requester?: boolean;
  hint?: string;
  onCancel?: () => void;
  onStayInProgress?: () => void;
  onRetry?: () => void;
  onBackdropPress?: () => void;
  onShow?: () => void;
  customHeight?: number | string | undefined;
}
