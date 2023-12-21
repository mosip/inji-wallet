import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Camera} from 'expo-camera';
import {BarCodeEvent, BarCodeScanner} from 'expo-barcode-scanner';
import {Linking, TouchableOpacity, View, Image, Pressable} from 'react-native';
import {Theme} from './ui/styleUtils';
import {Column, Button, Text, Centered, Row} from './ui';
import {GlobalContext} from '../shared/GlobalContext';
import {useSelector} from '@xstate/react';
import {selectIsActive} from '../machines/app';
import {useTranslation} from 'react-i18next';
import {useScanLayout} from '../screens/Scan/ScanLayoutController';
import testIDProps from '../shared/commonUtil';
import {SvgImage} from './ui/svg';

export const QrScanner: React.FC<QrScannerProps> = props => {
  const {t} = useTranslation('QrScanner');
  const {appService} = useContext(GlobalContext);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const controller = useScanLayout();

  const isActive = useSelector(appService, selectIsActive);

  const openSettings = () => {
    Linking.openSettings();
  };

  useEffect(() => {
    (async () => {
      const response = await Camera.requestCameraPermissionsAsync();
      setHasPermission(response.granted);
    })();
  }, []);

  useEffect(() => {
    if (isActive && hasPermission === false) {
      (async () => {
        const response = await Camera.requestCameraPermissionsAsync();
        setHasPermission(response.granted);
      })();
    }
  }, [isActive]);

  if (hasPermission === null) {
    return <View />;
  }

  const CameraDisabledPopUp: React.FC = () => {
    return (
      <View
        {...testIDProps('cameraDisabledPopup')}
        style={Theme.Styles.cameraDisabledPopupContainer}>
        <Row style={Theme.Styles.cameraDisabledPopUp}>
          <Column style={{flex: 1}}>
            <Text
              testID="cameraAccessDisabled"
              color={Theme.Colors.whiteText}
              weight="semibold"
              margin="0 0 5 0">
              {t('cameraAccessDisabled')}
            </Text>
            <Text
              testID="cameraPermissionGuide"
              color={Theme.Colors.whiteText}
              size="regular"
              style={{opacity: 0.8}}>
              {t('cameraPermissionGuideLabel')}
            </Text>
          </Column>
          <Pressable>
            <Icon
              testID="close"
              name="close"
              onPress={controller.DISMISS}
              color={Theme.Colors.whiteText}
              size={18}
            />
          </Pressable>
        </Row>
      </View>
    );
  };
  return (
    <Column fill align="space-between" margin="0 0 60 0">
      <View style={Theme.Styles.scannerContainer}>
        {hasPermission ? (
          <Camera
            {...testIDProps('camera')}
            style={Theme.Styles.scanner}
            barCodeScannerSettings={{
              barcodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
            onBarCodeScanned={scanned ? undefined : onBarcodeScanned}
            type={cameraType}
          />
        ) : (
          <View style={Theme.Styles.disabledScannerContainer} />
        )}
      </View>
      {props.title && (
        <Text
          testID="holdPhoneSteadyMessage"
          align="center"
          weight="semibold"
          style={Theme.TextStyles.base}
          margin="0 57">
          {props.title}
        </Text>
      )}
      <Column crossAlign="center">
        <TouchableOpacity
          disabled={hasPermission === false}
          onPress={() => {
            setCameraType(
              cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
            );
          }}>
          {SvgImage.FlipCameraIcon()}
        </TouchableOpacity>
        <Text testID="flipCameraText" size="small" weight="semibold" margin="8">
          {t('flipCamera')}
        </Text>
      </Column>
      {hasPermission == false && <CameraDisabledPopUp />}
    </Column>
  );

  function onBarcodeScanned(event: BarCodeEvent) {
    props.onQrFound(event.data);
    setScanned(true);
  }
};

interface QrScannerProps {
  onQrFound: (data: string) => void;
  title?: string;
}
