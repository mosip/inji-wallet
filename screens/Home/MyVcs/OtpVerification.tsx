import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { PinInput } from '../../../components/PinInput';
import { Column, Text } from '../../../components/ui';
import { ModalProps } from '../../../components/ui/Modal';
import { Theme } from '../../../components/ui/styleUtils';

export const OtpVerification: React.FC<OtpVerificationModalProps> = (props) => {
  const { t } = useTranslation('OtpVerificationModal');

  return (
    <View style={Theme.OtpVerificationStyles.viewContainer}>
      <Column
        fill
        padding="32"
        backgroundColor={Theme.Colors.whiteBackgroundColor}>
        <View style={Theme.OtpVerificationStyles.close}>
          <Icon name="close" onPress={() => props.onDismiss()} />
        </View>
        <Icon name="lock" color={Theme.Colors.Icon} size={60} />
        <Column fill align="space-between">
          <Text align="center">{t('enterOtp')}</Text>
          <Text
            align="center"
            color={Theme.Colors.errorMessage}
            margin="16 0 0 0">
            {props.error}
          </Text>
          <PinInput length={6} onDone={props.onInputDone} />
        </Column>
        <Column fill></Column>
      </Column>
    </View>
  );
};

interface OtpVerificationModalProps extends ModalProps {
  onInputDone: (otp: string) => void;
  error?: string;
}
