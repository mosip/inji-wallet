import React, { useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Camera } from 'expo-camera';
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import { Linking, TouchableOpacity, View } from 'react-native';
import { Theme } from './ui/styleUtils';
import { Column, Button, Text, Centered } from './ui';
import { GlobalContext } from '../shared/GlobalContext';
import { useSelector } from '@xstate/react';
import { selectIsActive } from '../machines/app';
import { useTranslation } from 'react-i18next';

export const QrScanner: React.FC<QrScannerProps> = (props) => {
  const { t } = useTranslation('QrScanner');
  const { appService } = useContext(GlobalContext);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);

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

  if (hasPermission === false) {
    return (
      <Column padding="24" fill align="space-between">
        <Centered fill>
          <Text align="center" color={Theme.Colors.errorMessage}>
            {t('missingPermissionText')}
          </Text>
        </Centered>
        <Button title={t('allowCameraButton')} onPress={openSettings}></Button>
      </Column>
    );
  }

  return (
    <View>
      <View style={Theme.Styles.scannerContainer}>
        <Camera
          style={Theme.Styles.scanner}
          barCodeScannerSettings={{
            barcodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          onBarCodeScanned={scanned ? undefined : onBarcodeScanned}
          type={type}
        />
      </View>
      {props.title && (
        <Text
          align="center"
          weight="bold"
          style={Theme.TextStyles.base}
          margin="20 57 0 57">
          {props.title}
        </Text>
      )}
    </View>
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
