import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PinInput } from '../../../components/PinInput';
import { Column, Text } from '../../../components/ui';
import { ModalProps, Modal } from '../../../components/ui/Modal';
import { Theme } from '../../../components/ui/styleUtils';
import { Image, TouchableOpacity } from 'react-native';

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = (
  props
) => {
  const { t } = useTranslation('OtpVerificationModal');

  const [timer, setTimer] = useState(180); // 30 seconds

  useEffect(() => {
    if (timer === 0) return;

    const intervalId = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const Seconds = seconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${
      Seconds < 10 ? '0' + Seconds : Seconds
    }`;
  };

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={props.onDismiss}
      onShow={() => setTimer(180)}>
      <Column
        fill
        padding="32"
        backgroundColor={Theme.Colors.whiteBackgroundColor}>
        <Column fill align="space-between" crossAlign="center">
          <Column crossAlign="center">
            <Image source={Theme.OtpLogo} resizeMethod="auto" />
            <Text
              margin="24 0 6 0"
              weight="bold"
              style={Theme.TextStyles.header}>
              {t('title')}
            </Text>
            <Text
              margin="0 24 15 24"
              color={Theme.Colors.RetrieveIdLabel}
              weight="semibold"
              size="small"
              align="center">
              {t('otpSentMessage')}
            </Text>
          </Column>

          <Text
            align="center"
            color={Theme.Colors.errorMessage}
            margin="16 0 0 0">
            {props.error}
          </Text>
          <PinInput length={6} onDone={props.onInputDone} />

          <Text
            margin="36 0 0 0"
            color={Theme.Colors.resendCodeTimer}
            weight="regular">
            {` ${t('resendTheCode')} :  ${formatTime(timer)}`}
          </Text>

          <TouchableOpacity
            activeOpacity={1}
            onPress={
              timer > 0
                ? null
                : () => {
                    props.resend();
                    setTimer(180);
                  }
            }>
            <Text
              color={
                timer > 0 ? Theme.Colors.GrayText : Theme.Colors.AddIdBtnBg
              }
              margin="10 0 0 0"
              weight="semibold">
              {t('resendCode')}
            </Text>
          </TouchableOpacity>
        </Column>
        <Column fill></Column>
      </Column>
    </Modal>
  );
};

interface OtpVerificationModalProps extends ModalProps {
  onInputDone: (otp: string) => void;
  error?: string;
  resend?: () => void;
}
