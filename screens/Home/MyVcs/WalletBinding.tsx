import React, { useState } from 'react';
import {
  Dimensions,
  I18nManager,
  RefreshControl,
  SafeAreaView,
  View,
} from 'react-native';
import { Divider, Icon, ListItem, Overlay } from 'react-native-elements';
import { Button, Column, Centered, Row, Text } from '../../../components/ui';
import { VidItem } from '../../../components/VidItem';
import { Theme } from '../../../components/ui/styleUtils';
import { ToastItem } from '../../../components/ui/ToastItem';
import { OIDcAuthenticationOverlay } from '../../../components/OIDcAuthModal';
import { useTranslation } from 'react-i18next';
import { useRevoke } from '../../Profile/RevokeController';
import { BindingVcWarningOverlay } from './BindingVcWarningOverlay';
import { useViewVcModal } from '../ViewVcModalController';
import { OtpVerification } from './OtpVerification';
import { useWalletBinding } from './WalletBindingController';
import { MessageOverlay } from '../../../components/MessageOverlay';

export const WalletBinding: React.FC<WalletBindingProps> = (props) => {
  const controller = useWalletBinding();

  const { t } = useTranslation('ProfileScreen');

  return (
    <ListItem bottomDivider onPress={() => controller.setBindingWarning(true)}>
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

      <BindingVcWarningOverlay
        isVisible={controller.isBindingWarning}
        onConfirm={controller.CONFIRM}
        onCancel={controller.DISMISS}
      />

      <OtpVerification
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
        isVisible={controller.isWalletBindingInProgress}
        title={t('inProgress')}
        progress
      />
    </ListItem>
  );
};

interface WalletBindingProps {
  label: string;
  Content?: string;
  Icon?: string;
}
