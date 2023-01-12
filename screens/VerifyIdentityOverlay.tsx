import React from 'react';
import { Icon, Overlay } from 'react-native-elements';

import { FaceScanner } from '../components/FaceScanner';
import { Column, Row } from '../components/ui';
import { Theme } from '../components/ui/styleUtils';
import { VC } from '../types/vc';
import { Modal } from '../components/ui/Modal';
import { t } from 'i18next';

export const VerifyIdentityOverlay: React.FC<VerifyIdentityOverlayProps> = (
  props
) => {
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
        {props.vc?.credential != null && (
          <FaceScanner
            vcImage={props.vc.credential.biometrics.face}
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
