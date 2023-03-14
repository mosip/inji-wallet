import React from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { Text } from '../../../components/ui';
import { Theme } from '../../../components/ui/styleUtils';
import { useTranslation } from 'react-i18next';
import { BindingVcWarningOverlay } from './BindingVcWarningOverlay';
import { OtpVerificationModal } from './OtpVerificationModal';
import { MessageOverlay } from '../../../components/MessageOverlay';
import { ToastItem } from '../../../components/ui/ToastItem';
import { useWalletBinding } from './WalletBindingController';

export const WalletBinding: React.FC<WalletBindingProps> = (props) => {
  const controller = useWalletBinding(props);

  return (
    <ListItem
      bottomDivider
      onPress={() => {
        controller.setisBindingWarning(true);
      }}>
      {props.Icon && (
        <Icon
          name={props.Icon}
          type="font-awesome"
          size={20}
          style={Theme.Styles.profileIconBg}
          color={Theme.Colors.Icon}
        />
      )}
      <ListItem.Content>
        <ListItem.Title>
          <Text
            size="small"
            weight="semibold"
            color={Theme.Colors.walletbindingLabel}>
            {props.label}
          </Text>
        </ListItem.Title>
        <Text
          weight="bold"
          color={Theme.Colors.walletbindingContent}
          size="smaller">
          {props.Content}
        </Text>
      </ListItem.Content>

      {controller.isAcceptingBindingOtp && (
        <OtpVerificationModal
          isVisible={controller.isAcceptingBindingOtp}
          onDismiss={controller.DISMISS}
          onInputDone={controller.inputOtp}
          error={controller.otpError}
        />
      )}

      <BindingVcWarningOverlay
        isVisible={controller.isBindingWarning}
        onConfirm={controller.CONFIRM}
        onCancel={controller.CANCEL}
      />

      <MessageOverlay
        isVisible={controller.isBindingError}
        title={controller.walletBindingError}
        onCancel={() => {
          controller.CANCEL();
        }}
      />

      <MessageOverlay
        isVisible={controller.WalletBindingInProgress}
        title={'inProgress'}
        progress
      />

      {controller.toastVisible && <ToastItem message={controller.message} />}
    </ListItem>
  );
};

interface WalletBindingProps {
  label: string;
  Content: string;
  Icon?: string;
  vcKey?: string;
}
