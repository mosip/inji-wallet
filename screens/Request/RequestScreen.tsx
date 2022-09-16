import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Centered, Button, Row, Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { MainRouteProps } from '../../routes/main';
import { ReceiveVcModal } from './ReceiveVcModal';
import { MessageOverlay } from '../../components/MessageOverlay';
import { useRequestScreen } from './RequestScreenController';
import { useTranslation } from 'react-i18next';
import { Switch } from 'react-native-elements';
import { Platform } from 'react-native';

export const RequestScreen: React.FC = () => {
  const { t } = useTranslation('RequestScreen');
  const controller = useRequestScreen();

  return (
    <Column
      fill
      padding="24"
      backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
      <Column>
        {controller.isBluetoothDenied ? (
          <React.Fragment>
            <Text color={Theme.Colors.errorMessage} align="center">
              {t('bluetoothDenied', { vcLabel: controller.vcLabel.singular })}
            </Text>
            <Button
              margin={[32, 0, 0, 0]}
              title={t('gotoSettings')}
              onPress={controller.GOTO_SETTINGS}
            />
          </React.Fragment>
        ) : (
          <Text align="center">
            {t('showQrCode', { vcLabel: controller.vcLabel.singular })}
          </Text>
        )}
      </Column>

      <Centered fill>
        {controller.connectionParams !== '' ? (
          <QRCode
            size={200}
            value={controller.connectionParams}
            backgroundColor={Theme.Colors.QRCodeBackgroundColor}
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
    </Column>
  );
};
