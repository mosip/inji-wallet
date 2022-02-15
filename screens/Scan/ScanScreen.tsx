import React from 'react';
import { QrScanner } from '../../components/QrScanner';
import { Column, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { MainRouteProps } from '../../routes/main';
import { MessageOverlay } from '../../components/MessageOverlay';
import { SendVidModal } from './SendVidModal';
import { useScanScreen } from './ScanScreenController';

export const ScanScreen: React.FC<MainRouteProps> = (props) => {
  const controller = useScanScreen(props);

  return (
    <Column fill padding="98 24" backgroundColor={Colors.LightGrey}>
      <Column>
        <Text align="center">Scan QR Code</Text>
        {controller.isLocationDenied && (
          <Text align="center" margin="16 0" color={Colors.Red}>
            Location access is required for the scanning functionality.
          </Text>
        )}
      </Column>
      {!controller.isEmpty ? (
        <Column fill padding="16 0" crossAlign="center">
          {controller.isScanning ? (
            <QrScanner onQrFound={controller.SCAN} />
          ) : null}
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
