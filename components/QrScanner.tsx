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
      <View>
        <Row style={Theme.Styles.cameraDisabledPopUp}>
          <Column>
            <Text color={Theme.Colors.whiteText} weight="bold">
              {t('cameraAccessDisabled')}
            </Text>
            <Text
              color={Theme.Colors.whiteText}
              weight="semibold"
              size="smaller">
              {t('cameraPermissionGuideLabel')}
            </Text>
          </Column>
          <Pressable>
            <Icon
              name="close"
              onPress={controller.DISMISS}
              color={Theme.Colors.whiteText}
              size={19}
            />
          </Pressable>
        </Row>
      </View>
    );
  };
  return (
    <Column fill align="space-between">
      {hasPermission == false && <CameraDisabledPopUp />}
      <View style={Theme.Styles.scannerContainer}>
        <Camera
          style={Theme.Styles.scanner}
          barCodeScannerSettings={{
            barcodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          onBarCodeScanned={scanned ? undefined : onBarcodeScanned}
          type={cameraType}
        />
      </View>
      {props.title && (
        <Text
          align="center"
          weight="semibold"
          style={Theme.TextStyles.base}
          margin="0 57">
          {props.title}
        </Text>
      )}
      <Column crossAlign="center">
        <TouchableOpacity
          onPress={() => {
            setCameraType(
              cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
            );
          }}>
          <Image
            source={Theme.CameraFlipIcon}
            style={Theme.Styles.cameraFlipIcon}
          />
        </TouchableOpacity>
        <Text size="small" weight="semibold" margin="8">
          {t('flipCamera')}
        </Text>
      </Column>
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
