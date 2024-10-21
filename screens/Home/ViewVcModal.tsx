import React, { useEffect, useState } from 'react';
import { Row } from '../../components/ui';
import { Modal } from '../../components/ui/Modal';
import { MessageOverlay } from '../../components/MessageOverlay';
import { ToastItem } from '../../components/ui/ToastItem';
import { useViewVcModal, ViewVcModalProps } from './ViewVcModalController';
import { useTranslation } from 'react-i18next';
import { OtpVerificationModal } from './MyVcs/OtpVerificationModal';
import { BindingVcWarningOverlay } from './MyVcs/BindingVcWarningOverlay';
import { VcDetailsContainer } from '../../components/VC/VcDetailsContainer';
import { TelemetryConstants } from '../../shared/telemetry/TelemetryConstants';
import { BannerNotificationContainer } from '../../components/BannerNotificationContainer';
import { Icon, ThemeConsumer } from 'react-native-elements';
import { Theme } from '../../components/ui/styleUtils';
import testIDProps from '../../shared/commonUtil';
import { HelpScreen } from '../../components/HelpScreen';
import { Pressable, View } from 'react-native';
import { KebabPopUp } from '../../components/KebabPopUp';
import { SvgImage } from '../../components/ui/svg';
import { VCMetadata } from '../../shared/VCMetadata';
import { WalletBinding } from './MyVcs/WalletBinding';
import { RemoveVcWarningOverlay } from './MyVcs/RemoveVcWarningOverlay';
import { HistoryTab } from './MyVcs/HistoryTab';
import { getDetailedViewFields } from '../../shared/openId4VCI/Utils';
import {
  DETAIL_VIEW_DEFAULT_FIELDS,
  isVCLoaded,
} from '../../components/VC/common/VCUtils';
import { ActivityIndicator } from '../../components/ui/ActivityIndicator';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {
  BannerNotification,
  BannerStatus,
} from '../../components/BannerNotification';

export const ViewVcModal: React.FC<ViewVcModalProps> = props => {
  const { t } = useTranslation('ViewVcModal');
  const controller = useViewVcModal(props);
  const profileImage = controller.verifiableCredentialData.face;
  const verificationStatus = controller.verificationStatus;
  useEffect(() => {
    if (controller.isVerificationInProgress) {
      controller.SHOW_VERIFICATION_STATUS_BANNER();
    }
    if (
      !controller.verifiableCredentialData.vcMetadata.isVerified &&
      !controller.isVerificationInProgress
    ) {
      props.vcItemActor.send({ type: 'VERIFY' });
    }
  }, [controller.verifiableCredentialData.vcMetadata.isVerified]);

  let [fields, setFields] = useState([]);
  const [wellknown, setWellknown] = useState(null);

  const verifiableCredentialData = controller.verifiableCredentialData;

  useEffect(() => {
    getDetailedViewFields(
      verifiableCredentialData?.issuer,
      verifiableCredentialData?.credentialTypes,
      DETAIL_VIEW_DEFAULT_FIELDS,
    ).then(response => {
      setWellknown(response.wellknown);
      setFields(response.fields);
    });
  }, [verifiableCredentialData?.wellKnown]);

  const headerRight = flow => {
    return flow === 'downloadedVc' ? (
      <Row align="space-between">
        <HelpScreen
          triggerComponent={
            <View style={Theme.Styles.IconContainer}>{SvgImage.questionIcon()}</View>
          }
        />
        {isVCLoaded(controller.credential, fields) ? (
          <Pressable
            onPress={() => props.vcItemActor.send('KEBAB_POPUP')}
            accessible={false}>
            <KebabPopUp
              icon={SvgImage.kebabIcon('KebabIcon')}
              vcMetadata={controller.verifiableCredentialData.vcMetadata}
              isVisible={
                props.vcItemActor.getSnapshot()?.context
                  .isMachineInKebabPopupState
              }
              onDismiss={() => props.vcItemActor.send('DISMISS')}
              service={props.vcItemActor}
              vcHasImage={profileImage !== undefined}
            />
          </Pressable>
        ) : (
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            width={35}
            height={35}
            style={Theme.Styles.shimmer}
          />
        )}
      </Row>
    ) : undefined;
  };

  const handleModalDismiss = () => {
    props.onDismiss();
    if (controller.isVerificationCompleted) {
      props.vcItemActor.send('REMOVE_VERIFICATION_STATUS_BANNER');
    }
  };

  return (
    <Modal
      isVisible={props.isVisible}
      testID="idDetailsHeader"
      arrowLeft={true}
      headerRight={headerRight(props.flow)}
      headerTitle={t('title')}
      onDismiss={handleModalDismiss}
      headerElevation={2}>
      <BannerNotificationContainer showVerificationStatusBanner={false} />

      {controller.showVerificationStatusBanner && (
        <BannerNotification
          type={verificationStatus?.statusType as BannerStatus}
          message={t(`VcVerificationBanner:${verificationStatus?.statusType}`, {
            vcDetails: `${verificationStatus.vcType} ${verificationStatus?.vcNumber}`,
          })}
          onClosePress={controller.RESET_VERIFICATION_STATUS}
          key={'reVerificationInProgress'}
          testId={'reVerificationInProgress'}
        />
      )}

      {!isVCLoaded(controller.credential, fields) ? (
        <ActivityIndicator />
      ) : (
        <VcDetailsContainer
          fields={fields}
          wellknown={wellknown}
          credential={controller.credential}
          verifiableCredentialData={controller.verifiableCredentialData}
          onBinding={controller.addtoWallet}
          walletBindingResponse={controller.walletBindingResponse}
          activeTab={props.activeTab}
          vcHasImage={profileImage !== undefined}
        />
      )}

      {controller.isAcceptingBindingOtp && (
        <OtpVerificationModal
          service={props.vcItemActor}
          isVisible={controller.isAcceptingBindingOtp}
          onDismiss={controller.DISMISS}
          onInputDone={controller.inputOtp}
          error={controller.otpError}
          resend={controller.RESEND_OTP}
          phone={controller.isCommunicationDetails.phoneNumber}
          email={controller.isCommunicationDetails.emailId}
          flow={TelemetryConstants.FlowType.vcActivation}
        />
      )}

      <BindingVcWarningOverlay
        isVisible={controller.isBindingWarning}
        onConfirm={controller.CONFIRM}
        onCancel={controller.CANCEL}
      />

      <MessageOverlay
        testID="walletBindingError"
        isVisible={controller.isBindingError}
        title={controller.walletBindingError}
        onButtonPress={() => {
          controller.CANCEL();
        }}
      />

      <MessageOverlay
        isVisible={controller.isWalletBindingInProgress}
        title={t('inProgress')}
        progress
      />

      {controller.toastVisible && <ToastItem message={controller.message} />}

      <WalletBinding
        service={props.vcItemActor}
        vcMetadata={controller.verifiableCredentialData.vcMetadata}
      />

      <RemoveVcWarningOverlay
        testID="removeVcWarningOverlay"
        service={props.vcItemActor}
        vcMetadata={controller.verifiableCredentialData.vcMetadata}
      />

      <HistoryTab
        service={props.vcItemActor}
        vcMetadata={VCMetadata.fromVC(
          controller.verifiableCredentialData.vcMetadata,
        )}
      />
    </Modal>
  );
};
