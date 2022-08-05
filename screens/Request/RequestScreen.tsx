import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Centered, Column, Row, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { MainRouteProps } from '../../routes/main';
import { ReceiveVcModal } from './ReceiveVcModal';
import { MessageOverlay } from '../../components/MessageOverlay';
import { useRequestScreen } from './RequestScreenController';
import { useTranslation } from 'react-i18next';
import { Switch } from 'react-native-elements';

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

      <Row align="center" crossAlign="center" margin={[0, 0, 48, 0]}>
        <Text margin={[0, 16, 0, 0]}>Offline</Text>
        <Switch
          value={controller.sharingProtocol === 'ONLINE'}
          onValueChange={controller.SWITCH_PROTOCOL}
          disabled={Platform.OS === 'ios'}
        />
        <Text margin={[0, 0, 0, 16]}>Online</Text>
      </Row>

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
        title={t('status.accepted.title')}
        message={t('status.accepted.message', {
          vcLabel: controller.vcLabel.singular,
          sender: controller.senderInfo.deviceName,
        })}
        onBackdropPress={controller.DISMISS}
      />

      <MessageOverlay
        isVisible={controller.isRejected}
        title={t('status.rejected.title')}
        message={t('status.rejected.message', {
          vcLabel: controller.vcLabel.singular,
          sender: controller.senderInfo.deviceName,
        })}
        onBackdropPress={controller.DISMISS}
      />

      <MessageOverlay
        isVisible={controller.isDisconnected}
        title={t('status.disconnected.title')}
        message={t('status.disconnected.message')}
        onBackdropPress={controller.DISMISS}
      />
    </Column>
  );
};
