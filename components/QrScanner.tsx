import React, { useContext, useEffect, useState } from 'react';
import { Camera } from 'expo-camera';
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import { Linking, StyleSheet, View } from 'react-native';
import { Colors } from './ui/styleUtils';
import { Button, Text } from './ui';
import { GlobalContext } from '../shared/GlobalContext';
import { useSelector } from '@xstate/react';
import { selectIsActive } from '../machines/app';

const styles = StyleSheet.create({
  scannerContainer: {
    borderWidth: 4,
    borderColor: Colors.Black,
    borderRadius: 32,
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
  },
  scanner: {
    height: 400,
  },
  buttonContainer: {
    height: '100%',
    width: '100%',
  },
  buttonStyle: {
    position: 'absolute',
    width: '100%',
    bottom: -90,
  },
});

export const QrScanner: React.FC<QrScannerProps> = (props) => {
  const { appService } = useContext(GlobalContext);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

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
      <View style={styles.buttonContainer}>
        <Text align="center">
          This app uses the camera to scan the QR code of another device.
        </Text>
        <View style={styles.buttonStyle}>
          <Button title="Allow access to camera" onPress={openSettings} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.scannerContainer}>
      <Camera
        style={styles.scanner}
        barCodeScannerSettings={{
          barcodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onBarCodeScanned={scanned ? undefined : onBarcodeScanned}
      />
    </View>
  );

  function onBarcodeScanned(event: BarCodeEvent) {
    props.onQrFound(event.data);
    setScanned(true);
  }
};

interface QrScannerProps {
  onQrFound: (data: string) => void;
}
