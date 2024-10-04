import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Camera} from 'expo-camera';
import {Column, Text, Button} from '.././ui';
import {useInterpret, useSelector} from '@xstate/react';
import {useTranslation} from 'react-i18next';
import {
  FaceScannerEvents,
  selectIsCheckingPermission,
  selectIsValid,
  selectIsPermissionDenied,
  selectIsScanning,
  createFaceScannerMachine,
  selectIsInvalid,
  selectIsCapturing,
  selectIsVerifying,
  selectCameraRef,
} from '../../machines/faceScanner';
import {GlobalContext} from '../../shared/GlobalContext';
import {selectIsActive} from '../../machines/app';
import {Theme} from '.././ui/styleUtils';
import {getRandomInt} from '../../shared/commonUtil';
import {
  checkBlink,
  cropEyeAreaFromFace,
  faceDetectorConfig,
  getFaceBounds,
  imageCaptureConfig,
} from './FaceScannerHelper';
import LivenessDetection from './LivenessDetection';
import FaceCompare from './FaceCompare';
import {LIVENESS_CHECK} from '../../shared/constants';

export const FaceScanner: React.FC<FaceScannerProps> = props => {
  const {t} = useTranslation('FaceScanner');
  const {appService} = useContext(GlobalContext);
  const isActive = useSelector(appService, selectIsActive);

  const machine = useRef(createFaceScannerMachine(props.vcImages));
  const service = useInterpret(machine.current);

  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const cameraRef = useSelector(service, selectCameraRef);

  const isPermissionDenied = useSelector(service, selectIsPermissionDenied);
  const isValid = useSelector(service, selectIsValid);
  const isInvalid = useSelector(service, selectIsInvalid);
  const isCheckingPermission = useSelector(service, selectIsCheckingPermission);
  const isScanning = useSelector(service, selectIsScanning);
  const isCapturing = useSelector(service, selectIsCapturing);
  const isVerifying = useSelector(service, selectIsVerifying);

  const [counter, setCounter] = useState(0);
  const [screenColor, setScreenColor] = useState('#0000ff');
  const [faceToCompare, setFaceToCompare] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [picArray, setPicArray] = useState([]);

  const screenFlashColors = ['#0000FF', '#00FF00', '#FF0000'];
  const MAX_COUNTER = 15;

  const randomNumToFaceCompare = getRandomInt(counter, MAX_COUNTER - 1);
  const [infoText, setInfoText] = useState<string>(t('livenessCaptureGuide'));

  const setCameraRef = useCallback(
    (node: Camera) => {
      if (node != null && !isScanning) {
        service.send(FaceScannerEvents.READY(node));
      }
    },
    [isScanning],
  );

  const flipCamera = () => {
    setCameraType(prevType =>
      prevType === Camera.Constants.Type.front
        ? Camera.Constants.Type.back
        : Camera.Constants.Type.front,
    );
  };

  function handleOnCancel() {
    props.onCancel();
  }

  async function captureImage(screenColor) {
    try {
      if (cameraRef) {
        const capturedImage = await cameraRef.takePictureAsync(
          imageCaptureConfig,
        );

        setPicArray([...picArray, {color: screenColor, image: capturedImage}]);

        if (counter === randomNumToFaceCompare) {
          setFaceToCompare(capturedImage);
        }
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  async function handleFacesDetected({faces}) {
    checkBlink(faces[0]);

    if (counter == MAX_COUNTER) {
      setCounter(counter + 1);
      cameraRef.pausePreview();

      setScreenColor('#ffffff');
      setInfoText(t('faceProcessingInfo'));

      const result = await cropEyeAreaFromFace(
        picArray,
        props.vcImages[0],
        faceToCompare,
      );
      return result ? props.onValid() : props.onInvalid();
    } else if (faces.length > 0) {
      const [withinXBounds, withinYBounds, withinYawAngle, withinRollAngle] =
        getFaceBounds(faces[0]);

      setInfoText(t('faceOutGuide'));

      if (
        withinXBounds &&
        withinYBounds &&
        withinRollAngle &&
        withinYawAngle &&
        counter < MAX_COUNTER
      ) {
        const randomNum = getRandomInt(0, 2);
        const randomColor = screenFlashColors[randomNum];
        setScreenColor(randomColor);
        setCounter(counter + 1);
        setInfoText(t('faceInGuide'));
        await captureImage(screenColor);
      }
    }
  }

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
        <Text
          testID="missingPermissionText"
          align="center"
          color={Theme.Colors.errorMessage}>
          {t('missingPermissionText')}
        </Text>
        <Button
          testID="allowCameraButton"
          title={t('allowCameraButton')}
          onPress={() => service.send(FaceScannerEvents.OPEN_SETTINGS())}
        />
      </Column>
    );
  }

  if (LIVENESS_CHECK) {
    return (
      <LivenessDetection
        screenColor={screenColor}
        infoText={infoText}
        whichCamera={cameraType}
        setCameraRef={setCameraRef}
        handleFacesDetected={handleFacesDetected}
        faceDetectorConfig={faceDetectorConfig}
        handleOnCancel={handleOnCancel}
        opacity={opacity}
        setOpacity={setOpacity}
        t={t}
      />
    );
  } else {
    return (
      <FaceCompare
        whichCamera={cameraType}
        setCameraRef={setCameraRef}
        flipCamera={flipCamera}
        isCapturing={isCapturing}
        isVerifying={isVerifying}
        service={service}
        t={t}
      />
    );
  }
};
interface FaceScannerProps {
  vcImages: string[];
  onValid: () => void;
  onInvalid: () => void;
  isLiveness: boolean;
  onCancel: () => void;
}
