import React from 'react';
import { useTranslation } from 'react-i18next';
import { PinInput } from '../../../components/PinInput';
import { Column, Text } from '../../../components/ui';
import { ModalProps, Modal } from '../../../components/ui/Modal';
import { Theme } from '../../../components/ui/styleUtils';
import { Image } from 'react-native';
import { Icon } from 'react-native-elements';

export const OtpVerification: React.FC<OtpVerificationModalProps> = (props) => {
  const { t } = useTranslation('OtpVerificationModal');

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={props.onDismiss}
      headerElevation={2}
      headerTitle={t('header')}
      headerRight={<Icon name={''} />}>
      <Column
        fill
        padding="32"
        backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
        <Column fill align="space-between" crossAlign="center">
          <Text align="center">{t('enterOtp')}</Text>
          <Image source={Theme.OtpLogo} resizeMethod="auto" />
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
    </Modal>
  );
};

interface OtpVerificationModalProps extends ModalProps {
  onInputDone: (otp: string) => void;
  error?: string;
}
