import React from 'react';

import {FaceScanner} from '../components/FaceScanner';
import {Column} from '../components/ui';
import {Theme} from '../components/ui/styleUtils';
import {VC} from '../types/VC/ExistingMosipVC/vc';
import {Modal} from '../components/ui/Modal';
import {useTranslation} from 'react-i18next';
import {VCMetadata} from '../shared/VCMetadata';

export const VerifyIdentityOverlay: React.FC<
  VerifyIdentityOverlayProps
> = props => {
  const {t} = useTranslation('VerifyIdentityOverlay');
  const isOpenId4VCI =
    props.vc?.vcMetadata &&
    VCMetadata.fromVC(props.vc?.vcMetadata).isFromOpenId4VCI();
  const credential = isOpenId4VCI
    ? props.vc?.verifiableCredential
    : props.vc?.credential;
  const vcImage = isOpenId4VCI
    ? props.vc?.verifiableCredential.credential.credentialSubject.face
    : props.vc?.credential?.biometrics.face;

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
    </>
  );
};

export interface VerifyIdentityOverlayProps {
  vc?: VC;
  isVerifyingIdentity: boolean;
  onCancel: () => void;
  onFaceValid: () => void;
  onFaceInvalid: () => void;
}
