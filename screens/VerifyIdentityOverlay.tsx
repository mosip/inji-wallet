import React from 'react';
import { Icon, Overlay } from 'react-native-elements';

import { FaceScanner } from '../components/FaceScanner';
import { Column, Row } from '../components/ui';
import { Theme } from '../components/ui/styleUtils';
import { VC } from '../types/vc';

export const VerifyIdentityOverlay: React.FC<VerifyIdentityOverlayProps> = (
  props
) => {
  return (
    <Overlay isVisible={props.isVisible}>
      <Row align="flex-end" padding="16">
        <Icon name="close" color={Theme.Colors.Icon} onPress={props.onCancel} />
      </Row>
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
    </Overlay>
  );
};

export interface VerifyIdentityOverlayProps {
  isVisible: boolean;
  vc?: VC;
  onCancel: () => void;
  onFaceValid: () => void;
  onFaceInvalid: () => void;
}
