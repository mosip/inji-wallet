import React from 'react';

import {FaceScanner} from '../components/FaceScanner';
import {Column, Row, Button} from '../components/ui';
import {Theme} from '../components/ui/styleUtils';
import {VC, VerifiableCredential} from '../types/VC/vc';
import {Modal} from '../components/ui/Modal';
import {useTranslation} from 'react-i18next';
import {MessageOverlay} from '../components/MessageOverlay';

export const VerifyIdentityOverlay: React.FC<
  VerifyIdentityOverlayProps
> = props => {
  const {t} = useTranslation('VerifyIdentityOverlay');
  const credential = props.credential;
  const vcImage = props.verifiableCredentialData;

  return (
    <>
      <Modal
        isVisible={props.isVerifyingIdentity}
        arrowLeft={true}
        headerTitle={t('faceAuth')}
        onDismiss={props.onCancel}>
        <Column
          fill
          style={Theme.VerifyIdentityOverlayStyles.content}
          align="center">
          {credential != null && (
            <FaceScanner
              vcImage={vcImage}
              onValid={props.onFaceValid}
              onInvalid={props.onFaceInvalid}
            />
          )}
        </Column>
      </Modal>

      <MessageOverlay
        isVisible={props.isInvalidIdentity}
        title={t('VerifyIdentityOverlay:errors.invalidIdentity.title')}
        message={t('VerifyIdentityOverlay:errors.invalidIdentity.message')}
        minHeight={'auto'}
        onBackdropPress={props.onDismiss}>
        <Row>
          <Button
            testID="cancel"
            fill
            type="clear"
            title={t('common:cancel')}
            onPress={props.onDismiss}
            margin={[0, 8, 0, 0]}
          />
          <Button
            testID="tryAgain"
            fill
            title={t('common:tryAgain')}
            onPress={props.onRetryVerification}
          />
        </Row>
      </MessageOverlay>
    </>
  );
};

export interface VerifyIdentityOverlayProps {
  vc?: VC;
  credential?: VerifiableCredential | Credential;
  verifiableCredentialData: any;
  isVerifyingIdentity: boolean;
  onCancel: () => void;
  onFaceValid: () => void;
  onFaceInvalid: () => void;
  isInvalidIdentity: boolean;
  onDismiss: () => void;
  onRetryVerification: () => void;
}
