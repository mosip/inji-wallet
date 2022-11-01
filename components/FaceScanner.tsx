import React, { useCallback, useContext, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Camera } from 'expo-camera';
import { StyleSheet } from 'react-native';
import { Colors } from './ui/styleUtils';
import { Button, Centered, Column, Row, Text } from './ui';
import { useInterpret, useSelector } from '@xstate/react';
import { useTranslation } from 'react-i18next';
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
import { GlobalContext } from '../shared/GlobalContext';
import { selectIsActive } from '../machines/app';
import { RotatingIcon } from './RotatingIcon';

export const FaceScanner: React.FC<FaceScannerProps> = (props) => {
  const { t } = useTranslation('FaceScanner');
  const { appService } = useContext(GlobalContext);
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
    [isScanning]
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
        <Text align="center" color={Colors.Red}>
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
    <Column crossAlign="center">
      <Column style={[styles.scannerContainer]}>
        <Camera
          ratio="4:3"
          style={styles.scanner}
          type={whichCamera}
          ref={setCameraRef}
        />
      </Column>
      <Centered margin="24 0">
        {isCapturing || isVerifying ? (
          <RotatingIcon name="sync" size={64} />
        ) : (
          <Row crossAlign="center">
            <Icon
              name="flip-camera-ios"
              color={Colors.Black}
              size={64}
              onPress={() => service.send(FaceScannerEvents.FLIP_CAMERA())}
              style={{ margin: 8, marginEnd: 32 }}
            />
            <Icon
              name="photo-camera"
              color={Colors.Black}
              size={64}
              onPress={() => service.send(FaceScannerEvents.CAPTURE())}
              style={{ margin: 8, marginTop: 12, marginStart: 32 }}
            />
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

const styles = StyleSheet.create({
  scannerContainer: {
    borderWidth: 4,
    borderColor: Colors.Black,
    borderRadius: 32,
    justifyContent: 'center',
    height: 400,
    width: 300,
    overflow: 'hidden',
  },

  scanner: {
    height: '100%',
    width: '100%',
    margin: 'auto',
  },
});
