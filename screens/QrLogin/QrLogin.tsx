import React from 'react';
import {Column} from '../../components/ui';
import {useTranslation} from 'react-i18next';
import {useQrLogin} from './QrLoginController';
import {VerifyIdentityOverlay} from '../VerifyIdentityOverlay';
import {MessageOverlay} from '../../components/MessageOverlay';
import {MyBindedVcs} from './MyBindedVcs';
import {QrLoginSuccess} from './QrLoginSuccessMessage';
import {QrConsent} from './QrConsent';
import {QrLoginRef} from '../../machines/QrLogin/QrLoginMachine';
import {Icon} from 'react-native-elements';
import {View} from 'react-native';
import {FaceVerificationAlertOverlay} from '../Scan/FaceVerificationAlertOverlay';
import {LIVENESS_CHECK} from '../../shared/constants';

export const QrLogin: React.FC<QrLoginProps> = props => {
  const controller = useQrLogin(props);
  const {t} = useTranslation('QrLogin');

  return (
    <View
      isVisible={props.isVisible}
      onDismiss={controller.DISMISS}
      headerTitle={t('title')}
      headerRight={<Icon name={''} />}>
      <Column fill>
        <MyBindedVcs
          isVisible={controller.isShowingVcList}
          service={props.service}
        />

        <MessageOverlay
          isVisible={
            controller.isWaitingForData ||
            controller.isLoadingMyVcs ||
            controller.isLinkTransaction ||
            controller.isSendingConsent ||
            controller.isSendingAuthenticate
          }
          title={t('loading')}
          progress
        />

        <MessageOverlay
          isVisible={controller.isShowingError}
          title={controller.error}
          onButtonPress={controller.DISMISS}
          testID="qrLoginError"
        />

        <VerifyIdentityOverlay
          credential={controller.selectCredential}
          verifiableCredentialData={controller.verifiableCredentialData}
          isVerifyingIdentity={controller.isVerifyingIdentity}
          onCancel={controller.CANCEL}
          onFaceValid={controller.FACE_VALID}
          onFaceInvalid={controller.FACE_INVALID}
          isInvalidIdentity={controller.isInvalidIdentity}
          onNavigateHome={controller.GO_TO_HOME}
          onRetryVerification={controller.RETRY_VERIFICATION}
          isLivenessEnabled={LIVENESS_CHECK}
        />

        <FaceVerificationAlertOverlay
          isQrLogin={true}
          isVisible={controller.isFaceVerificationConsent}
          onConfirm={controller.FACE_VERIFICATION_CONSENT}
          close={controller.DISMISS}
        />

        <QrConsent
          isVisible={controller.isRequestConsent}
          onConfirm={controller.CONFIRM}
          onCancel={controller.DISMISS}
          service={props.service}
        />

        <QrLoginSuccess
          isVisible={controller.isVerifyingSuccesful}
          onPress={controller.CONFIRM}
          service={props.service}
        />
      </Column>
    </View>
  );
};

export interface QrLoginProps {
  isVisible: boolean;
  service: QrLoginRef;
}
