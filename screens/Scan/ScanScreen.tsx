import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from '@xstate/react';
import { StyleSheet, View } from 'react-native';
import { QrScanner } from '../../components/QrScanner';
import { Button, Column, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { MainRouteProps } from '../../routes/main';
import { MessageOverlay } from '../../components/MessageOverlay';
import { GlobalContext } from '../../shared/GlobalContext';
import { SendVidModal } from './SendVidModal';
import { useScanScreen } from './ScanScreenController';

const styles = StyleSheet.create({
  buttonContainer: {
    height: '93%',
    width: '100%',
  },
  buttonStyle: {
    position: 'absolute',
    width: '100%',
    bottom: -90,
  },
});

export const ScanScreen: React.FC<MainRouteProps> = (props) => {
  const { appService } = useContext(GlobalContext);
  const controller = useScanScreen(props);

  return (
    <Column fill padding="98 24" backgroundColor={Colors.LightGrey}>
      <Column>
        <Text align="center">Scan QR Code</Text>
        {controller.isLocationDenied && (
          <View style={styles.buttonContainer}>
            <Text align="center" margin="16 0" color={Colors.Red}>
              Location access is required for the scanning functionality.
            </Text>
            <View>
              <Button title="Allow access to location" onPress={controller.REQUEST} />
            </View>
          </View>
        )}
      </Column>
      {!controller.isEmpty ? (
        <Column fill padding="16 0" crossAlign="center">
          {controller.isScanning && (
            <QrScanner onQrFound={controller.SCAN} />
          )}
        </Column>
      ) : (
        <Text align="center" margin="16 0" color={Colors.Red}>
          No sharable {controller.vidLabel.plural} are available.
        </Text>
      )}

      <MessageOverlay
        isVisible={controller.statusMessage !== ''}
        message={controller.statusMessage}
        hasProgress={!controller.isInvalid}
        onBackdropPress={controller.onDismissInvalid}
      />

      <SendVidModal
        isVisible={controller.isReviewing}
        onDismiss={controller.DISMISS}
        headerElevation={2}
        headerTitle={`Sharing ${controller.vidLabel.singular}`}
      />
    </Column>
  );
};
