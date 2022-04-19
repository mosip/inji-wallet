import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Centered, Column, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { MainRouteProps } from '../../routes/main';
import { ReceiveVcModal } from './ReceiveVcModal';
import { MessageOverlay } from '../../components/MessageOverlay';
import { useRequestScreen } from './RequestScreenController';
import { useTranslation } from 'react-i18next';

export const RequestScreen: React.FC<MainRouteProps> = (props) => {
  const { t } = useTranslation('RequestScreen');
  const controller = useRequestScreen(props);

  return (
    <Column fill padding="98 24 24 24" backgroundColor={Colors.LightGrey}>
      <Column>
        {controller.isBluetoothDenied ? (
          <Text color={Colors.Red} align="center">
            {t('bluetoothDenied', { vcLabel: controller.vcLabel.singular })}
          </Text>
        ) : (
          controller.isWaitingForConnection && (
            <Text align="center">
              {t('showQrCode', { vcLabel: controller.vcLabel.singular })}
            </Text>
          )
        )}
      </Column>

      <Centered fill>
        {controller.isWaitingForConnection &&
        controller.connectionParams !== '' ? (
          <QRCode
            size={200}
            value={controller.connectionParams}
            backgroundColor={Colors.LightGrey}
          />
        ) : null}
      </Centered>

      {controller.statusMessage !== '' && (
        <Column elevation={1} padding="16 24">
          <Text>{controller.statusMessage}</Text>
        </Column>
      )}

      <ReceiveVcModal
        isVisible={controller.isReviewing}
        onDismiss={controller.REJECT}
        onAccept={controller.ACCEPT}
        onReject={controller.REJECT}
        headerTitle={t('incomingVc', { vcLabel: controller.vcLabel.singular })}
      />

      <MessageOverlay
        isVisible={controller.isAccepted}
        title={t('statusAccepted.title')}
        message={t('statusAccepted.message', {
          vcLabel: controller.vcLabel.singular,
          sender: controller.senderInfo.deviceName,
        })}
        onBackdropPress={controller.DISMISS}
      />

      <MessageOverlay
        isVisible={controller.isRejected}
        title={t('statusRejected.title')}
        message={t('statusRejected.message', {
          vcLabel: controller.vcLabel.singular,
          sender: controller.senderInfo.deviceName,
        })}
        onBackdropPress={controller.DISMISS}
      />

      <MessageOverlay
        isVisible={controller.isDisconnected}
        title={t('statusDisconnected.title')}
        message={t('statusDisconnected.message')}
        onBackdropPress={controller.DISMISS}
      />
    </Column>
  );
};
