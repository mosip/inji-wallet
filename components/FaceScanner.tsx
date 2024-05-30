import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Camera, ImageType} from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import {TouchableOpacity, View, Dimensions} from 'react-native';
import {Centered, Column, Row, Text, Button} from './ui';
import {useInterpret, useSelector} from '@xstate/react';
import {useTranslation} from 'react-i18next';
import ImageEditor from '@react-native-community/image-editor';
import {getColors} from 'react-native-image-colors';
import hexRgb, {RgbaObject} from 'hex-rgb';
import {closest} from 'color-diff';
import {Ellipse, Defs, Mask, Rect, Svg} from 'react-native-svg';
import {faceCompare} from '@iriscan/biometric-sdk-react-native';
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
} from '../machines/faceScanner';
import {selectIsLivenessEnabled} from '../machines/settings';
import {GlobalContext} from '../shared/GlobalContext';
import {selectIsActive} from '../machines/app';
import {RotatingIcon} from './RotatingIcon';
import {Theme} from './ui/styleUtils';
import {SvgImage} from './ui/svg';
import Spinner from 'react-native-spinkit';
import {isAndroid, LIVENESS_THRESHOLD} from '../shared/constants';
import {getRandomInt} from '../shared/commonUtil';
import testIDProps from '../shared/commonUtil';

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

  const rxDataURI = /data:(?<mime>[\w/\-.]+);(?<encoding>\w+),(?<data>.*)/;
  const matches = rxDataURI.exec(props.vcImage).groups;
  const vcFace = matches.data;

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
  const [faceToCompare, setFaceToCompare] = useState(null);
  const MAX_COUNTER = 15;

  const [picArray, setPicArray] = useState([]);
  const randomNumToFaceCompare = getRandomInt(counter, MAX_COUNTER - 1);
  const [infoText, setInfoText] = useState<string>(t('livenessCaptureGuide'));

  let FaceCropPicArray: any[] = new Array();
  let EyeCropPicArray: any[] = new Array();
  let predictedColorResults: any[] = new Array();
  let facePoints;
  let calculatedThreshold;
  let faceCompareOuptut;
  let capturedFaceImage;

  const screenFlashColors = ['#0000FF', '#00FF00', '#FF0000'];
  const colorFiltered = ['background', 'dominant'];
  const offsetX = 200;
  const offsetY = 350;
  const captureInterval = 1000;
  const eyeOpenProbability = 0.85;
  const BLINK_THRESHOLD = 0.4;
  const BLINK_TIME_WINDOW = 900;
  const eyeCropHeightConst = 50;
  const XAndYBoundsMax = 280;
  const XAndYBoundsMin = 300;
  const rollAngleThreshold = 10;
  const yawAngleThreshold = 3;
  const colorComparePalette = [
    {R: 255, G: 0, B: 0},
    {R: 0, G: 255, B: 0},
    {R: 0, G: 0, B: 255},
  ];
  const imageCaptureConfig = {
    base64: true,
    quality: 1,
    imageType: ImageType.jpg,
  };
  const faceDetectorConfig = {
    mode: FaceDetector.FaceDetectorMode.accurate,
    detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
    runClassifications: FaceDetector.FaceDetectorClassifications.all,
    contourMode: FaceDetector.FaceDetectorClassifications.all,
    minDetectionInterval: captureInterval,
    tracking: true,
  };

  const setCameraRef = useCallback(
    (node: Camera) => {
      if (node != null && !isScanning) {
        service.send(FaceScannerEvents.READY(node));
      }
    },
    [isScanning],
  );

  function getNormalizedFacePoints(facePoints: any): number[] {
    return isAndroid()
      ? [
          facePoints.LEFT_EYE.x,
          facePoints.LEFT_EYE.y,
          facePoints.RIGHT_EYE.x,
          facePoints.RIGHT_EYE.y,
        ]
      : [
          facePoints.leftEyePosition.x,
          facePoints.leftEyePosition.y,
          facePoints.rightEyePosition.x,
          facePoints.rightEyePosition.y,
        ];
  }

  function filterColor(color) {
    return (
      typeof color === 'string' &&
      color.startsWith('#') &&
      !colorFiltered.includes(color)
    );
  }

  function handleOnCancel() {
    props.onCancel();
  }

  async function getEyeColorPredictionResult(
    LeftrgbaColors: RgbaObject[],
    color: RgbaObject,
  ) {
    LeftrgbaColors.forEach(colorRGBA => {
      let colorRGB = {};
      colorRGB['R'] = colorRGBA.red;
      colorRGB['G'] = colorRGBA.green;
      colorRGB['B'] = colorRGBA.blue;

      const closestColor = closest(colorRGB, colorComparePalette);

      const result =
        color.red === closestColor.R &&
        color.blue === closestColor.B &&
        color.green === closestColor.G;

      predictedColorResults.push(result);
    });
  }

  async function cropEyeAreaFromFace() {
    await Promise.all(
      picArray.map(async pic => {
        facePoints = (
          await FaceDetector.detectFacesAsync(pic.image.uri, faceDetectorConfig)
        ).faces[0];

        if (
          facePoints.leftEyeOpenProbability > eyeOpenProbability &&
          facePoints.rightEyeOpenProbability > eyeOpenProbability
        ) {
          capturedFaceImage = await ImageEditor.cropImage(pic.image.uri, {
            offset: {
              x: facePoints.bounds.origin.x,
              y: facePoints.bounds.origin.y,
            },
            size: {
              width: facePoints.bounds.size.width,
              height: facePoints.bounds.size.height,
            },
          });

          FaceCropPicArray.push({color: pic.color, image: capturedFaceImage});
        }
      }),
    );

    await Promise.all(
      FaceCropPicArray.map(async pic => {
        let [leftEyeX, leftEyeY, rightEyeX, rightEyeY] =
          getNormalizedFacePoints(facePoints);

        const leftCroppedImage = await ImageEditor.cropImage(pic.image.uri, {
          offset: {
            x: leftEyeX - offsetX,
            y: leftEyeY - offsetY,
          },
          size: {width: offsetX * 2, height: offsetY / 2 - eyeCropHeightConst},
        });

        const rightCroppedImage = await ImageEditor.cropImage(pic.image.uri, {
          offset: {
            x: rightEyeX - offsetX,
            y: rightEyeY - offsetY,
          },
          size: {width: offsetX * 2, height: offsetY / 2 - eyeCropHeightConst},
        });

        EyeCropPicArray.push({
          color: pic.color,
          leftEye: leftCroppedImage,
          rightEye: rightCroppedImage,
        });
      }),
    );

    await Promise.all(
      EyeCropPicArray.map(async pic => {
        const leftEyeColors = await getColors(pic.leftEye.uri);
        const rightEyeColors = await getColors(pic.rightEye.uri);

        const leftRGBAColors = Object.values(leftEyeColors)
          .filter(filterColor)
          .map(color => hexRgb(color));

        const rightRGBAColors = Object.values(rightEyeColors)
          .filter(filterColor)
          .map(color => hexRgb(color));

        const rgbColor = hexRgb(pic.color);
        await getEyeColorPredictionResult(leftRGBAColors, rgbColor);
        await getEyeColorPredictionResult(rightRGBAColors, rgbColor);
      }),
    );

    calculatedThreshold =
      predictedColorResults.filter(element => element).length /
      predictedColorResults.length;

    console.log('FACE_LIVENESS :: Threshold is ->', calculatedThreshold);

    faceCompareOuptut = await faceCompare(vcFace, faceToCompare.base64);

    console.log(
      'FACE_LIVENESS :: face compare result is-->',
      faceCompareOuptut,
    );

    console.log('FACE_LIVENESS :: End time-->', Date.now());

    if (calculatedThreshold > LIVENESS_THRESHOLD && faceCompareOuptut) {
      props.onValid();
    } else {
      props.onInvalid();
    }
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

  // let blinkCount = 0;
  // let leftEyeWasClosed = false;
  // let rightEyeWasClosed = false;
  // let lastBlinkTimestamp = 0;

  async function handleFacesDetected({faces}) {

    // const leftEyeOpenProbability = faces[0].leftEyeOpenProbability;
    // const rightEyeOpenProbability = faces[0].rightEyeOpenProbability;

    // const currentTime = new Date().getTime();

    // const leftEyeClosed = leftEyeOpenProbability < BLINK_THRESHOLD;
    // const rightEyeClosed = rightEyeOpenProbability < BLINK_THRESHOLD;

    // if (leftEyeClosed && rightEyeClosed) {
    //   leftEyeWasClosed = true;
    //   rightEyeWasClosed = true;
    // }

    // if (leftEyeWasClosed && rightEyeWasClosed && !leftEyeClosed && !rightEyeClosed) {
    //   // if (lastBlinkTimestamp === 0 || (currentTime - lastBlinkTimestamp) > BLINK_TIME_WINDOW) {
    //     blinkCount += 1;
    //     lastBlinkTimestamp = currentTime;
    //     console.log(`Blink detected! Total blinks: ${blinkCount}`);
    //   // }
    //   leftEyeWasClosed = false;
    //   rightEyeWasClosed = false;
    // }

    if (!livenessEnabled) {
      return;
    }

    if (counter == MAX_COUNTER) {
      setCounter(counter + 1);
      cameraRef.pausePreview();
      setScreenColor('#ffffff');
      setInfoText(t('faceProcessingInfo'));
      await cropEyeAreaFromFace();
      return;
    } else if (faces.length > 0) {
      const {bounds, yawAngle, rollAngle} = faces[0];

      const withinXBounds =
        bounds.origin.x + bounds.size.width >= XAndYBoundsMax &&
        bounds.origin.x <= XAndYBoundsMin;
      const withinYBounds =
        bounds.origin.y + bounds.size.height >= XAndYBoundsMax &&
        bounds.origin.y <= XAndYBoundsMin;
      const withinYawAngle =
        yawAngle > -yawAngleThreshold && yawAngle < yawAngleThreshold;
      const withinRollAngle =
        rollAngle > -rollAngleThreshold && rollAngle < rollAngleThreshold;

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

  return (
    <Column
      fill
      {...(!livenessEnabled && {align: 'space-between'})}
      style={{backgroundColor: livenessEnabled ? screenColor : '#ffffff'}}>
      {livenessEnabled && (
        <View
          style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 9,
              width: Dimensions.get('window').width * 0.85,
              alignItems: 'center',
              marginTop: Dimensions.get('window').height * 0.15,
              padding: 3,
            }}>
            <Spinner type="ThreeBounce" color={Theme.Colors.Loading} />
            <Text size="small" weight="bold" color="black" align="center">
              {infoText}
            </Text>
          </View>
        </View>
      )}
      <View style={{flex: 2, marginTop: 15}}>
        <View style={Theme.CameraEnabledStyles.scannerContainer}>
          <View>
            <Camera
              {...testIDProps('camera')}
              style={Theme.CameraEnabledStyles.scanner}
              type={whichCamera}
              ref={setCameraRef}
              {...(livenessEnabled
                ? {
                    onFacesDetected: handleFacesDetected,
                    faceDetectorSettings: faceDetectorConfig,
                  }
                : {})}
            />
            {livenessEnabled && (
              <Svg height="100%" width="100%" style={{position: 'absolute'}}>
                <Defs>
                  <Mask id="mask" x="0" y="0" height="100%" width="100%">
                    <Rect
                      height="100%"
                      width="100%"
                      fill="#fff"
                      opacity="0.3"
                    />
                    <Ellipse rx="38%" ry="45%" cx="50%" cy="50%" fill="black" />
                  </Mask>
                </Defs>
                <Rect
                  height="100%"
                  width="100%"
                  fill="rgba(0, 0, 0, 0.8)"
                  mask="url(#mask)"
                  fill-opacity="0"
                />
              </Svg>
            )}
          </View>
        </View>
        { !livenessEnabled && (<Text
            testID="imageCaptureGuide"
            align="center"
            weight="semibold"
            style={Theme.TextStyles.base}
            margin="80 57">
            {t('imageCaptureGuide')}
          </Text>) }
      </View>
      {livenessEnabled ? (
        <View
          style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 9,
              width: Dimensions.get('window').width * 0.3,
              alignSelf: 'center',
              alignItems: 'center',
              height: 40,
              marginBottom: Dimensions.get('window').height * 0.1,
              opacity: opacity,
            }}
            onPressIn={() => setOpacity(0.5)}
            onPressOut={() => setOpacity(1)}
            onPress={handleOnCancel}>
            <Text size="small" weight="bold" margin="8" color="black">
            {t('cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Centered>
              {isCapturing || isVerifying ? (
                <RotatingIcon name="sync" size={64} />
              ) : (
                <Row align="center">
                  <Centered style={Theme.Styles.imageCaptureButton}>
                    <TouchableOpacity
                      onPress={() => {
                        service.send(FaceScannerEvents.CAPTURE());
                      } }>
                      {SvgImage.CameraCaptureIcon()}
                    </TouchableOpacity>
                    <Text  testID="captureText"
                style={Theme.CameraEnabledStyles.iconText}>
                      {t('capture')}
                    </Text>
                  </Centered>

                  <Centered>
                    <TouchableOpacity
                      onPress={() => service.send(FaceScannerEvents.FLIP_CAMERA())}>
                      {SvgImage.FlipCameraIcon()}
                    </TouchableOpacity>
                    <Text  testID="flipCameraText"
                style={Theme.CameraEnabledStyles.iconText}>
                      {t('flipCamera')}
                    </Text>
                  </Centered>
                </Row>
              )}
            </Centered></>
      )}
    </Column>
  );
};
interface FaceScannerProps {
  vcImage: string;
  onValid: () => void;
  onInvalid: () => void;
  isLiveness: boolean;
  onCancel: () => void;
}
