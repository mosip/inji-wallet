import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { PinInput } from '../../../components/PinInput';
import { Column, Text } from '../../../components/ui';
import { ModalProps } from '../../../components/ui/Modal';
import { Colors } from '../../../components/ui/styleUtils';

const styles = StyleSheet.create({
  modal: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  viewContainer: {
    backgroundColor: Colors.White,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    position: 'absolute',
    top: 0,
    zIndex: 9,
    padding: 32,
  },
  close: {
    position: 'absolute',
    top: 32,
    right: 0,
    color: Colors.Orange,
  },
});

export const OtpVerification: React.FC<OtpVerificationModalProps> = (props) => {
  const { t } = useTranslation('OtpVerificationModal');

  return (
    <View style={styles.viewContainer}>
      <Column fill padding="32" backgroundColor={Colors.White}>
        <View style={styles.close}>
          <Icon name="close" onPress={() => props.onDismiss()} />
        </View>
        <Icon name="lock" color={Colors.Orange} size={60} />
        <Column fill align="space-between">
          <Text align="center">{t('enterOtp')}</Text>
          <Text align="center" color={Colors.Red} margin="16 0 0 0">
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
