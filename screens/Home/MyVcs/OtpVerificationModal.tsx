import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {PinInput} from '../../../components/PinInput';
import {Button, Column, Text} from '../../../components/ui';
import {Modal} from '../../../components/ui/Modal';
import {Theme} from '../../../components/ui/styleUtils';
import {Image, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import {
  getImpressionEventData,
  incrementRetryCount,
  resetRetryCount,
  sendImpressionEvent,
} from '../../../shared/telemetry/TelemetryUtils';
import {TelemetryConstants} from '../../../shared/telemetry/TelemetryConstants';
import {MessageOverlay} from '../../../components/MessageOverlay';
import {
  OtpVerificationModalProps,
  useOtpVerificationModal,
} from './OtpVerificationModalController';
import {isIOS} from '../../../shared/constants';

export const OtpVerificationModal: React.FC<
  OtpVerificationModalProps
> = props => {
  const {t} = useTranslation('OtpVerificationModal');

  const [timer, setTimer] = useState(180); // 30 seconds

  const controller = useOtpVerificationModal(props);

  useEffect(() => {
    sendImpressionEvent(
      getImpressionEventData(
        props.flow,
        TelemetryConstants.Screens.otpVerificationModal,
      ),
    );
  }, [props.flow]);

  useEffect(() => {
    if (timer === 0) return;

    const intervalId = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const Seconds = seconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${
      Seconds < 10 ? '0' + Seconds : Seconds
    }`;
  };

  const handleOtpResend = () => {
    incrementRetryCount(
      props.flow,
      TelemetryConstants.Screens.otpVerificationModal,
    );
    props.resend();
  };

  const handleEnteredOtp = (otp: string) => {
    resetRetryCount();
    props.onInputDone(otp);
  };

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={props.onDismiss}
      onShow={() => setTimer(180)}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={isIOS() ? 'padding' : 'height'}>
        <Column pX={24}>
          <Column crossAlign="center">
            <Image source={Theme.OtpLogo} resizeMethod="auto" />
            <Text
              margin="6 0 6 0"
              weight="bold"
              style={Theme.TextStyles.header}>
              {t('title')}
            </Text>
            <Text
              color={Theme.Colors.RetrieveIdLabel}
              weight="semibold"
              size="small"
              align="center">
              {t('otpSentMessage')}
            </Text>

            <Text
              margin="6 0 0 0"
              align="center"
              color={Theme.Colors.errorMessage}>
              {props.error}
            </Text>
            <PinInput testID="pinInput" length={6} onDone={handleEnteredOtp} />
            <Text color={Theme.Colors.resendCodeTimer} weight="regular">
              {timer > 0 ? `${t('resendTheCode')} : ${formatTime(timer)}` : ''}
            </Text>

            <TouchableOpacity
              activeOpacity={1}
              onPress={
                timer > 0
                  ? null
                  : () => {
                      handleOtpResend();
                      setTimer(180);
                    }
              }>
              <Text
                testID="resendCode"
                color={
                  timer > 0 ? Theme.Colors.GrayText : Theme.Colors.AddIdBtnBg
                }
                weight="semibold">
                {t('resendCode')}
              </Text>
            </TouchableOpacity>
          </Column>
        </Column>
      </KeyboardAvoidingView>

      <MessageOverlay
        isVisible={controller.isDownloadCancelled}
        title={t('confirmationDialog.title')}
        message={t('confirmationDialog.message')}
        customHeight={250}>
        <Column>
          <Button
            type="gradient"
            title={t('confirmationDialog.wait')}
            onPress={controller.WAIT}
            margin={[0, 0, 8, 0]}
          />
          <Button
            type="clear"
            title={t('confirmationDialog.cancel')}
            onPress={controller.CANCEL}
          />
        </Column>
      </MessageOverlay>
    </Modal>
  );
};
