import React from 'react';
import {FaceScanner} from '../components/FaceScanner';
import {Column} from '../components/ui';
import {Theme} from '../components/ui/styleUtils';
import {VerifiableCredential} from '../machines/VerifiableCredential/VCMetaMachine/vc';
import {Modal} from '../components/ui/Modal';
import {useTranslation} from 'react-i18next';
import {Error} from '../components/ui/Error';
import {SvgImage} from '../components/ui/svg';

export const VerifyIdentityOverlay: React.FC<
  VerifyIdentityOverlayProps
> = props => {
  const {t} = useTranslation('VerifyIdentityOverlay');
  const credential = props.credential;
  const vcImage = props.verifiableCredentialData.face;

  const modalProps = {
    isVisible: props.isVerifyingIdentity,
    onDismiss: props.onCancel,
    animationType: 'slide',
    arrowLeft: true,
    headerTitle: t('faceAuth'),
    presentationStyle: "overFullScreen",
    showClose: true,
    showHeader: true,
  };
  
  if (props.isLivenessEnabled) {
    modalProps.arrowLeft = false;
    modalProps.headerTitle = '';
    modalProps.showClose = false;
    modalProps.showHeader = false;
  }
  
  return (
    <>
      <Modal
         {...modalProps}>
        <Column
          fill
          style={Theme.VerifyIdentityOverlayStyles.content}
          align="center">
          {credential != null && (
            <FaceScanner
              vcImage={vcImage}
              onValid={props.onFaceValid}
              onInvalid={props.onFaceInvalid}
              isLiveness={props.isLivenessEnabled}
              onCancel={props.onCancel}
            />
          )}
        </Column>
      </Modal>

      <Error
        isModal
        alignActionsOnEnd
        showClose={false}
        isVisible={props.isInvalidIdentity}
        title={t('ScanScreen:postFaceCapture.captureFailureTitle')}
        message={t('ScanScreen:postFaceCapture.captureFailureMessage')}
        image={SvgImage.PermissionDenied()}
        primaryButtonTestID={'retry'}
        primaryButtonText={t('ScanScreen:status.retry')}
        primaryButtonEvent={props.onRetryVerification}
        textButtonTestID={'home'}
        textButtonText={t('ScanScreen:status.accepted.home')}
        textButtonEvent={props.onNavigateHome}
        customImageStyles={{paddingBottom: 0, marginBottom: -6}}
        customStyles={{marginTop: '20%'}}
        testID={'shareWithSelfieError'}
      />
    </>
  );
};

export interface VerifyIdentityOverlayProps {
  credential?: VerifiableCredential | Credential;
  verifiableCredentialData: any;
  isVerifyingIdentity: boolean;
  onCancel: () => void;
  onFaceValid: () => void;
  onFaceInvalid: () => void;
  isInvalidIdentity: boolean;
  onNavigateHome: () => void;
  onRetryVerification: () => void;
  isLivenessEnabled: boolean;
}
