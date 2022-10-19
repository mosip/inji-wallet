import FaceAuth from 'mosip-mobileid-sdk';
import React from 'react';
import { Dimensions } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { Column, Row } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import {
  useVerifyIdentityOverlay,
  VerifyIdentityOverlayProps,
} from './VerifyIdentityOverlayController';

export const VerifyIdentityOverlay: React.FC<VerifyIdentityOverlayProps> = (
  props
) => {
  const controller = useVerifyIdentityOverlay();

  return (
    <Overlay isVisible={props.isVisible}>
      <Row align="flex-end" padding="16">
        <Icon name="close" color={Theme.Colors.Icon} onPress={props.onCancel} />
      </Row>
      <Column
        fill
        style={Theme.VerifyIdentityOverlayStyles.content}
        align="center">
        <FaceAuth
          data={controller.selectedVc?.credential?.biometrics.face}
          onValidationSuccess={props.onFaceValid}
          // onValidationFailed={props.onFaceInvalid}
        />
      </Column>
    </Overlay>
  );
};
