import React from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { Row, Text } from '../../../components/ui';
import { Theme } from '../../../components/ui/styleUtils';
import { useTranslation } from 'react-i18next';
import { BindingVcWarningOverlay } from './BindingVcWarningOverlay';
import { OtpVerificationModal } from './OtpVerificationModal';
import { MessageOverlay } from '../../../components/MessageOverlay';
import { useKebabPopUp } from '../../../components/KebabPopUpController';
import { Dimensions } from 'react-native';
import { ActorRefFrom } from 'xstate';
import { vcItemMachine } from '../../../machines/vcItem';

export const WalletBinding: React.FC<WalletBindingProps> = (props) => {
  const controller = useKebabPopUp(props);

  const WalletVerified: React.FC = () => {
    return (
      <Icon
        name="verified-user"
        color={Theme.Colors.VerifiedIcon}
        size={28}
        containerStyle={{ marginStart: 4, bottom: 1 }}
      />
    );
  };
  const { t } = useTranslation('WalletBinding');

  return controller.emptyWalletBindingId ? (
    <ListItem bottomDivider onPress={controller.ADD_WALLET_BINDING_ID}>
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
          size="small">
          {props.Content}
        </Text>
      </ListItem.Content>

      <BindingVcWarningOverlay
        isVisible={controller.isBindingWarning}
        onConfirm={controller.CONFIRM}
        onCancel={controller.CANCEL}
      />

      <OtpVerificationModal
        isVisible={controller.isAcceptingOtpInput}
        onDismiss={controller.DISMISS}
        onInputDone={controller.INPUT_OTP}
        error={controller.otpError}
      />
      <MessageOverlay
        isVisible={controller.isWalletBindingError}
        title={controller.walletBindingError}
        onCancel={controller.CANCEL}
      />
      <MessageOverlay
        isVisible={controller.WalletBindingInProgress}
        title={t('inProgress')}
        progress
      />
    </ListItem>
  ) : (
    <ListItem bottomDivider>
      <Row
        width={Dimensions.get('screen').width * 0.8}
        align="space-between"
        crossAlign="center">
        <Row crossAlign="center" style={{ flex: 1 }}>
          <WalletVerified />
          <Text
            color={Theme.Colors.Details}
            weight="bold"
            size="small"
            margin="10 10 10 10"
            children={t('profileAuthenticated')}></Text>
        </Row>
      </Row>
    </ListItem>
  );
};

interface WalletBindingProps {
  label: string;
  Content?: string;
  Icon?: string;
  service: ActorRefFrom<typeof vcItemMachine>;
}
