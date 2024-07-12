import React from 'react';
import {Camera, CameraType} from 'expo-camera';
import {View, TouchableOpacity} from 'react-native';
import Spinner from 'react-native-spinkit';
import {Column, Text} from '.././ui';
import {Theme} from '.././ui/styleUtils';
import Svg, {Defs, Mask, Rect, Ellipse} from 'react-native-svg';
import testIDProps from '../../shared/commonUtil';
import {FaceDetectorConfig} from './FaceScannerHelper';

const LivenessDetection: React.FC<LivenessDetectionProps> = ({
  screenColor,
  infoText,
  whichCamera,
  setCameraRef,
  handleFacesDetected,
  faceDetectorConfig,
  handleOnCancel,
  opacity,
  setOpacity,
  t,
}) => {
  return (
    <Column fill align="space-between" style={{backgroundColor: screenColor}}>
      <View style={Theme.CameraEnabledStyles.guideContainer}>
        <View style={Theme.CameraEnabledStyles.guideContentContainer}>
          <Spinner type="ThreeBounce" color={Theme.Colors.Loading} />
          <Text
            testID="captureInfoText"
            size="small"
            weight="bold"
            color="black"
            align="center">
            {infoText}
          </Text>
        </View>
      </View>
      <View style={{flex: 2, marginTop: 15}}>
        <View style={Theme.CameraEnabledStyles.scannerContainer}>
          <View>
            <Camera
              {...testIDProps('camera')}
              style={Theme.CameraEnabledStyles.scanner}
              type={whichCamera}
              ref={setCameraRef}
              onFacesDetected={handleFacesDetected}
              faceDetectorSettings={faceDetectorConfig}
            />
            <Svg height="100%" width="100%" style={{position: 'absolute'}}>
              <Defs>
                <Mask id="mask" x="0" y="0" height="100%" width="100%">
                  <Rect height="100%" width="100%" fill="#fff" opacity="0.3" />
                  <Ellipse rx="38%" ry="45%" cx="50%" cy="50%" fill="black" />
                </Mask>
              </Defs>
              <Rect
                height="100%"
                width="100%"
                fill="rgba(0, 0, 0, 0.8)"
                mask="url(#mask)"
              />
            </Svg>
          </View>
        </View>
      </View>
      <View style={Theme.CameraEnabledStyles.buttonContainer}>
        <TouchableOpacity
          {...testIDProps('cancel')}
          style={[Theme.CameraEnabledStyles.cancelButton, {opacity}]}
          onPressIn={() => setOpacity(0.5)}
          onPressOut={() => setOpacity(1)}
          onPress={handleOnCancel}>
          <Text
            testID="cancelText"
            size="small"
            weight="bold"
            margin="8"
            color="black">
            {t('cancel')}
          </Text>
        </TouchableOpacity>
      </View>
    </Column>
  );
};

export default LivenessDetection;

interface LivenessDetectionProps {
  screenColor: string;
  infoText: string;
  whichCamera: CameraType;
  setCameraRef: (node: Camera) => void;
  handleFacesDetected: (faces: any) => Promise<void>;
  faceDetectorConfig: FaceDetectorConfig;
  handleOnCancel: () => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  t: (key: string) => string;
}
