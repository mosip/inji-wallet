import React, {useCallback, useContext, useEffect, useRef} from 'react';
import {Camera} from 'expo-camera';
import {TouchableOpacity, View, Image} from 'react-native';
import {Button, Centered, Column, Row, Text} from './ui';
import {useInterpret, useSelector} from '@xstate/react';
import {useTranslation} from 'react-i18next';
import {
  FaceScannerEvents,
  selectIsCheckingPermission,
  selectIsValid,
  selectIsPermissionDenied,
  selectIsScanning,
  selectWhichCamera,
  createFaceScannerMachine,
  selectIsInvalid,
  selectIsCapturing,
  selectIsVerifying,
} from '../machines/faceScanner';
import {GlobalContext} from '../shared/GlobalContext';
import {selectIsActive} from '../machines/app';
import {RotatingIcon} from './RotatingIcon';
import {Theme} from './ui/styleUtils';
import {SvgImage} from './ui/svg';

export const FaceScanner: React.FC<FaceScannerProps> = props => {
  const {t} = useTranslation('FaceScanner');
  const {appService} = useContext(GlobalContext);
  const isActive = useSelector(appService, selectIsActive);

  const machine = useRef(createFaceScannerMachine(props.vcImage));
  const service = useInterpret(machine.current);

  const whichCamera = useSelector(service, selectWhichCamera);

  const isPermissionDenied = useSelector(service, selectIsPermissionDenied);
  const isValid = useSelector(service, selectIsValid);
  const isInvalid = useSelector(service, selectIsInvalid);
  const isCheckingPermission = useSelector(service, selectIsCheckingPermission);
  const isScanning = useSelector(service, selectIsScanning);
  const isCapturing = useSelector(service, selectIsCapturing);
  const isVerifying = useSelector(service, selectIsVerifying);

  const setCameraRef = useCallback(
    (node: Camera) => {
      if (node != null && !isScanning) {
        service.send(FaceScannerEvents.READY(node));
      }
    },
    [isScanning],
  );

  useEffect(() => {
    if (isValid) {
      props.onValid();
    } else if (isInvalid) {
      props.onInvalid();
    }
  }, [isValid, isInvalid]);

  useEffect(() => {
    if (isActive) {
      service.send(FaceScannerEvents.APP_FOCUSED());
    }
  }, [isActive]);

  if (isCheckingPermission) {
    return <Column></Column>;
  } else if (isPermissionDenied) {
    return (
      <Column padding="24" fill align="space-between">
        <Text align="center" color={Theme.Colors.errorMessage}>
          {t('missingPermissionText')}
        </Text>
        <Button
          title={t('allowCameraButton')}
          onPress={() => service.send(FaceScannerEvents.OPEN_SETTINGS())}
        />
      </Column>
    );
  }

  return (
    <Column fill align="space-between">
      <View style={Theme.Styles.scannerContainer}>
        <Camera
          style={Theme.Styles.scanner}
          type={whichCamera}
          ref={setCameraRef}
        />
      </View>
      <Text
        align="center"
        weight="semibold"
        style={Theme.TextStyles.base}
        margin="0 57">
        {t('imageCaptureGuide')}
      </Text>
      <Centered>
        {isCapturing || isVerifying ? (
          <RotatingIcon name="sync" size={64} />
        ) : (
          <Row align="center">
            <Centered style={Theme.Styles.imageCaptureButton}>
              <TouchableOpacity
                onPress={() => service.send(FaceScannerEvents.CAPTURE())}>
                {SvgImage.CameraCaptureIcon()}
              </TouchableOpacity>
              <Text size="small" weight="semibold" margin="8">
                {t('capture')}
              </Text>
            </Centered>

            <Centered>
              <TouchableOpacity
                onPress={() => service.send(FaceScannerEvents.FLIP_CAMERA())}>
                {SvgImage.FlipCameraIcon()}
              </TouchableOpacity>
              <Text size="smaller" weight="semibold" margin="8">
                {t('flipCamera')}
              </Text>
            </Centered>
          </Row>
        )}
      </Centered>
    </Column>
  );
};

interface FaceScannerProps {
  vcImage: string;
  onValid: () => void;
  onInvalid: () => void;
}
