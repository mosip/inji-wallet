import React from 'react';
import {Icon, Overlay} from 'react-native-elements';

import {FaceScanner} from '../components/FaceScanner';
import {Column, Row} from '../components/ui';
import {Theme} from '../components/ui/styleUtils';
import {VC} from '../types/VC/ExistingMosipVC/vc';
import {Modal} from '../components/ui/Modal';
import {t} from 'i18next';
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
    <Modal
      isVisible={props.isVisible}
      arrowLeft={<Icon name={''} />}
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
  );
};

export interface VerifyIdentityOverlayProps {
  isVisible: boolean;
  vc?: VC;
  onCancel: () => void;
  onFaceValid: () => void;
  onFaceInvalid: () => void;
}
