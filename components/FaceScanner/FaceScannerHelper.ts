import hexRgb, {RgbaObject} from 'hex-rgb';
import {LIVENESS_THRESHOLD, isAndroid} from '../../shared/constants';
import {closest} from 'color-diff';
import * as FaceDetector from 'expo-face-detector';
import ImageEditor from '@react-native-community/image-editor';
import {ImageType} from 'expo-camera';
import {getColors} from 'react-native-image-colors';
import {faceCompare} from '@iriscan/biometric-sdk-react-native';
import fileStorage from '../../shared/fileStorage';

let croppedFaceImages: any[] = new Array();
let croppedEyeImages: any[] = new Array();
let predictedColorResults: any[] = new Array();
let facePoints;
let calculatedThreshold;
let faceCompareOuptut;
let croppedFaceImage;
let leftEyeWasClosed = false;
let rightEyeWasClosed = false;
let lastBlinkTimestamp = 0;
let blinkCounter = 0;

const offsetX = 200;
const offsetY = 350;
const captureInterval = 650;
const eyeOpenProbability = 0.85;
const blinkConfidenceScore = 0.1;
const blinkThreshold = 0.4;
const blinkTimeInterval = 900;
const eyeCropHeightConst = 50;
const XAndYBoundsMax = 280;
const XAndYBoundsMin = 300;
const rollAngleThreshold = 10;
const yawAngleThreshold = 3;
const colorFiltered = ['background', 'dominant'];
const rxDataURI = /data:(?<mime>[\w/\-.]+);(?<encoding>\w+),(?<data>.*)/;
const colorComparePalette = [
  {R: 255, G: 0, B: 0},
  {R: 0, G: 255, B: 0},
  {R: 0, G: 0, B: 255},
];

export const imageCaptureConfig = {
  base64: true,
  quality: 1,
  imageType: ImageType.jpg,
};

export const faceDetectorConfig: FaceDetectorConfig = {
  mode: FaceDetector.FaceDetectorMode.accurate,
  detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
  runClassifications: FaceDetector.FaceDetectorClassifications.all,
  contourMode: FaceDetector.FaceDetectorClassifications.all,
  minDetectionInterval: captureInterval,
  tracking: true,
};

export const checkBlink = face => {
  const leftEyeOpenProbability = face.leftEyeOpenProbability;
  const rightEyeOpenProbability = face.rightEyeOpenProbability;

  const currentTime = new Date().getTime();

  const leftEyeClosed = leftEyeOpenProbability < blinkThreshold;
  const rightEyeClosed = rightEyeOpenProbability < blinkThreshold;

  if (leftEyeClosed && rightEyeClosed) {
    leftEyeWasClosed = true;
    rightEyeWasClosed = true;
  }

  if (
    leftEyeWasClosed &&
    rightEyeWasClosed &&
    !leftEyeClosed &&
    !rightEyeClosed
  ) {
    if (
      lastBlinkTimestamp === 0 ||
      currentTime - lastBlinkTimestamp > blinkTimeInterval
    ) {
      blinkCounter = blinkCounter + 1;
      lastBlinkTimestamp = currentTime;
    }
    leftEyeWasClosed = false;
    rightEyeWasClosed = false;
  }
};

export const getFaceBounds = face => {
  const {bounds, yawAngle, rollAngle} = face;

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

  return [withinXBounds, withinYBounds, withinYawAngle, withinRollAngle];
};

export const getNormalizedFacePoints = (facePoints: any): number[] => {
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
};

export const filterColor = color => {
  return (
    typeof color === 'string' &&
    color.startsWith('#') &&
    !colorFiltered.includes(color)
  );
};

export const getEyeColorPredictionResult = async (
  LeftrgbaColors: RgbaObject[],
  color: RgbaObject,
) => {
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
};

const cropFacePortionFromCapturedImage = async ({
  screenColor,
  capturedImageUri,
}) => {
  facePoints = (
    await FaceDetector.detectFacesAsync(capturedImageUri, faceDetectorConfig)
  ).faces[0];

  if (
    facePoints.leftEyeOpenProbability > eyeOpenProbability &&
    facePoints.rightEyeOpenProbability > eyeOpenProbability
  ) {
    croppedFaceImage = await ImageEditor.cropImage(capturedImageUri, {
      offset: {
        x: facePoints.bounds.origin.x,
        y: facePoints.bounds.origin.y,
      },
      size: {
        width: facePoints.bounds.size.width,
        height: facePoints.bounds.size.height,
      },
    });
    croppedFaceImages.push({screenColor, faceImageUri: croppedFaceImage.uri});
    await fileStorage.removeItemIfExist(capturedImageUri);
  }
};

const cropEyePortionsFromCroppedFaceImages = async ({
  screenColor,
  faceImageUri,
}) => {
  let [leftEyeX, leftEyeY, rightEyeX, rightEyeY] =
    getNormalizedFacePoints(facePoints);

  const leftCroppedImage = await ImageEditor.cropImage(faceImageUri, {
    offset: {
      x: leftEyeX - offsetX,
      y: leftEyeY - offsetY,
    },
    size: {
      width: offsetX * 2,
      height: offsetY / 2 - eyeCropHeightConst,
    },
  });

  const rightCroppedImage = await ImageEditor.cropImage(faceImageUri, {
    offset: {
      x: rightEyeX - offsetX,
      y: rightEyeY - offsetY,
    },
    size: {
      width: offsetX * 2,
      height: offsetY / 2 - eyeCropHeightConst,
    },
  });

  croppedEyeImages.push({
    screenColor: screenColor,
    leftEyeUri: leftCroppedImage.uri,
    rightEyeUri: rightCroppedImage.uri,
  });
  await fileStorage.removeItemIfExist(faceImageUri);
};

const compareEyeColorsWithScreenColor = async ({
  screenColor,
  leftEyeUri,
  rightEyeUri,
}) => {
  const leftEyeColors = await getColors(leftEyeUri);
  const rightEyeColors = await getColors(rightEyeUri);

  const leftRGBAColors = Object.values(leftEyeColors)
    .filter(filterColor)
    .map(color => hexRgb(color));

  const rightRGBAColors = Object.values(rightEyeColors)
    .filter(filterColor)
    .map(color => hexRgb(color));

  const rgbColor = hexRgb(screenColor);
  await getEyeColorPredictionResult(leftRGBAColors, rgbColor);
  await getEyeColorPredictionResult(rightRGBAColors, rgbColor);
  await fileStorage.removeItemIfExist(leftEyeUri);
  await fileStorage.removeItemIfExist(rightEyeUri);
};

const calculateThresholdAndDetectFaceLiveness = async (
  vcImage,
  randomCapturedImage,
) => {
  calculatedThreshold =
    predictedColorResults.filter(element => element).length /
    predictedColorResults.length;

  const matches = rxDataURI.exec(vcImage).groups;
  const vcFace = matches.data;

  faceCompareOuptut = await faceCompare(vcFace, randomCapturedImage.base64);

  if (blinkCounter > 0) {
    calculatedThreshold = calculatedThreshold + blinkConfidenceScore;
  }

  return calculatedThreshold > LIVENESS_THRESHOLD && faceCompareOuptut
    ? true
    : false;
};

export const validateLiveness = async (
  capturedImages,
  vcImage,
  randomCapturedImage,
) => {
  try {
    await Promise.all(
      capturedImages.map(async capturedImage => {
        await cropFacePortionFromCapturedImage(capturedImage);
      }),
    );

    await Promise.all(
      croppedFaceImages.map(async croppedFaceImage => {
        await cropEyePortionsFromCroppedFaceImages(croppedFaceImage);
      }),
    );
  } catch (err) {
    console.error('Unable to crop the images::', err);
    return false;
  }

  try {
    await Promise.all(
      croppedEyeImages.map(async croppedEyeImage => {
        compareEyeColorsWithScreenColor(croppedEyeImage);
      }),
    );
  } catch (err) {
    console.error(
      'Error occured when extracting the colors from eyes and comparing them with screen color::',
      err,
    );
    return false;
  }
  return calculateThresholdAndDetectFaceLiveness(vcImage, randomCapturedImage);
};

export interface FaceDetectorConfig {
  mode: FaceDetector.FaceDetectorMode;
  detectLandmarks: FaceDetector.FaceDetectorLandmarks;
  runClassifications: FaceDetector.FaceDetectorClassifications;
  contourMode: FaceDetector.FaceDetectorClassifications;
  minDetectionInterval: number;
  tracking: boolean;
}
