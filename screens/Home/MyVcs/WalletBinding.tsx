import React, {useEffect} from 'react';
import {Icon, ListItem} from 'react-native-elements';
import {Row, Text} from '../../../components/ui';
import {Theme} from '../../../components/ui/styleUtils';
import {useTranslation} from 'react-i18next';
import {BindingVcWarningOverlay} from './BindingVcWarningOverlay';
import {OtpVerificationModal} from './OtpVerificationModal';
import {MessageOverlay} from '../../../components/MessageOverlay';
import {useKebabPopUp} from '../../../components/KebabPopUpController';
import {ActorRefFrom} from 'xstate';
import {ExistingMosipVCItemMachine} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import testIDProps from '../../../shared/commonUtil';
import {VCMetadata} from '../../../shared/VCMetadata';
import {
  getEndEventData,
  getErrorEventData,
  sendEndEvent,
  sendErrorEvent,
} from '../../../shared/telemetry/TelemetryUtils';
import {TelemetryConstants} from '../../../shared/telemetry/TelemetryConstants';
import {isActivationNeeded} from '../../../shared/openId4VCI/Utils';
import {KebabPopupListItemContainer} from '../../../components/KebabPopUp';
import {SvgImage} from '../../../components/ui/svg';
import {FlowType} from '../../../shared/Utils';

export const WalletVerified: React.FC = () => {
  return (
    <Icon
      name="verified-user"
      color={Theme.Colors.VerifiedIcon}
      size={28}
      containerStyle={{marginStart: 4, bottom: 1}}
    />
  );
};

export const WalletBinding: React.FC<WalletBindingProps> = props => {
  const controller = useKebabPopUp(props);

  useEffect(() => {
    let error = controller.walletBindingError;
    if (error) {
      error = controller.bindingAuthFailedError
        ? controller.bindingAuthFailedError + '-' + error
        : error;
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.vcActivation,
          TelemetryConstants.ErrorId.activationFailed,
          error,
        ),
      );
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.vcActivation,
          TelemetryConstants.EndEventStatus.failure,
        ),
      );
    }
  }, [controller.walletBindingError]);

  const {t} = useTranslation('WalletBinding');
  return (
    <>
      <BindingVcWarningOverlay
        isVisible={controller.isBindingWarning}
        onConfirm={controller.CONFIRM}
        onCancel={controller.CANCEL}
      />

      {controller.isAcceptingOtpInput && (
        <OtpVerificationModal
          service={props.service}
          isVisible={controller.isAcceptingOtpInput}
          onDismiss={controller.DISMISS}
          onInputDone={controller.INPUT_OTP}
          error={controller.otpError}
          resend={controller.RESEND_OTP}
          flow={TelemetryConstants.FlowType.vcActivationFromKebab}
        />
      )}

      <MessageOverlay
        testID="walletBindingError"
        isVisible={controller.isWalletBindingError}
        title={controller.walletBindingError}
        onButtonPress={controller.CANCEL}
      />
      <MessageOverlay
        isVisible={controller.WalletBindingInProgress}
        title={t('inProgress')}
        progress
      />
    </>
  );
};

export const ActivationStatus = props => {
  const controller = useKebabPopUp(props);
  const {t} = useTranslation('WalletBinding');
  const activationNotCompleted =
    props.emptyWalletBindingId && isActivationNeeded(props?.vcMetadata.issuer);

  function loadScanScreen() {
    controller.SELECT_VC_ITEM(props.service, FlowType.MINI_VIEW_QR_LOGIN),
      controller.GOTO_SCANSCREEN(),
      props.service.send('CLOSE_VC_MODAL');
  }

  return (
    <KebabPopupListItemContainer
      label={
        activationNotCompleted
          ? t('offlineAuthenticationDisabled!')
          : isActivationNeeded(props?.vcMetadata.issuer)
          ? t('profileAuthenticated')
          : t('credentialActivated')
      }
      listItemIcon={SvgImage.OutlinedShieldedIcon()}
      onPress={
        activationNotCompleted ? props.ADD_WALLET_BINDING_ID : loadScanScreen
      }
      testID="pinOrUnPinCard"
    />
  );
};

interface WalletBindingProps {
  testID?: string;
  service: ActorRefFrom<typeof ExistingMosipVCItemMachine>;
  vcMetadata: VCMetadata;
}
