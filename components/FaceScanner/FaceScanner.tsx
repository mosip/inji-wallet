import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Camera} from 'expo-camera';
import {TouchableOpacity, View} from 'react-native';
import {Centered, Column, Row, Text, Button} from '.././ui';
import {useInterpret, useSelector} from '@xstate/react';
import {useTranslation} from 'react-i18next';
import {Ellipse, Defs, Mask, Rect, Svg} from 'react-native-svg';
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
  selectCameraRef,
} from '../../machines/faceScanner';
import {selectIsLivenessEnabled} from '../../machines/settings';
import {GlobalContext} from '../../shared/GlobalContext';
import {selectIsActive} from '../../machines/app';
import {RotatingIcon} from '.././RotatingIcon';
import {Theme} from '.././ui/styleUtils';
import {SvgImage} from '.././ui/svg';
import Spinner from 'react-native-spinkit';
import {getRandomInt} from '../../shared/commonUtil';
import testIDProps from '../../shared/commonUtil';
import {
  checkBlink,
  cropEyeAreaFromFace,
  faceDetectorConfig,
  getFaceBounds,
  imageCaptureConfig,
  screenFlashColors,
} from './FaceScannerHelper';
import LivenessEnabled from './LivenessEnabled';
import LivenessDisabled from './LivenessDisabled';


export let faceToCompare;

export const FaceScanner: React.FC<FaceScannerProps> = props => {
  const {t} = useTranslation('FaceScanner');
  const {appService} = useContext(GlobalContext);
  const settingsService = appService?.children?.get('settings') || {};
  const isActive = useSelector(appService, selectIsActive);

  const machine = useRef(createFaceScannerMachine(props.vcImage));
  const service = useInterpret(machine.current);

  const whichCamera = useSelector(service, selectWhichCamera);
  const cameraRef = useSelector(service, selectCameraRef);
  const livenessEnabled = useSelector(settingsService, selectIsLivenessEnabled);

  const isPermissionDenied = useSelector(service, selectIsPermissionDenied);
  const isValid = useSelector(service, selectIsValid);
  const isInvalid = useSelector(service, selectIsInvalid);
  const isCheckingPermission = useSelector(service, selectIsCheckingPermission);
  const isScanning = useSelector(service, selectIsScanning);
  const isCapturing = useSelector(service, selectIsCapturing);
  const isVerifying = useSelector(service, selectIsVerifying);

  const [counter, setCounter] = useState(0);
  const [screenColor, setScreenColor] = useState('#0000ff');
  const [opacity, setOpacity] = useState(1);
  const [picArray, setPicArray] = useState([]);

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
          faceToCompare = capturedImage;
        }
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  async function handleFacesDetected({faces}) {

    checkBlink(faces[0]);

    if (!livenessEnabled) {
      return;
    }

    if (counter == MAX_COUNTER) {
      setCounter(counter + 1);
      cameraRef.pausePreview();

      setScreenColor('#ffffff');
      setInfoText(t('faceProcessingInfo'));

      console.log("I am here-->", picArray.length);
      const result = await cropEyeAreaFromFace(picArray, props.vcImage);

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
        if (counter == 0) {
          console.log('FACE_LIVENESS :: Start time-->', Date.now());
        }

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

  if (livenessEnabled) {
    return (
      <LivenessEnabled
        screenColor={screenColor}
        infoText={infoText}
        whichCamera={whichCamera}
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
      <LivenessDisabled
        whichCamera={whichCamera}
        setCameraRef={setCameraRef}
        isCapturing={isCapturing}
        isVerifying={isVerifying}
        service={service}
        t={t}
      />
    );
  }
};
interface FaceScannerProps {
  vcImage: string;
  onValid: () => void;
  onInvalid: () => void;
  isLiveness: boolean;
  onCancel: () => void;
}