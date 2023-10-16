import React from 'react';
import {useTranslation} from 'react-i18next';

import {Dimensions, StyleSheet} from 'react-native';
import {Overlay} from 'react-native-elements';
import {Button, Column, Text} from './ui';
import {Theme} from './ui/styleUtils';

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = props => {
  const {t} = useTranslation('common');
  const style = StyleSheet.create({
    customHeight: {
      height: props.customHeight ? props.customHeight : 300,
    },
  });
  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={Theme.MessageOverlayStyles.overlay}
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
              size={'subHeader'}
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
        </Column>
        <Button
          type="gradient"
          title={t(props.confirmButtonText)}
          onPress={props.onConfirmButtonPress}
          styles={Theme.MessageOverlayStyles.button}
        />
        <Button
          type="text"
          title={t(props.cancelButtonText)}
          onPress={props.onCancelButtonPress}
          styles={Theme.MessageOverlayStyles.button}
        />
      </Column>
    </Overlay>
  );
};

export interface ConfirmationDialogProps {
  isVisible: boolean;
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  message?: string;
  onConfirmButtonPress: () => void;
  onCancelButtonPress: () => void;
  onBackdropPress?: () => void;
  customHeight?: number;
}
