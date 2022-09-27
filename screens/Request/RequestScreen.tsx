import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Button, Centered, Column, Row, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';

import { useRequestScreen } from './RequestScreenController';
import { useTranslation } from 'react-i18next';
import { Switch } from 'react-native-elements';
import { Platform } from 'react-native';

export const RequestScreen: React.FC = () => {
  const { t } = useTranslation('RequestScreen');
  const controller = useRequestScreen();

  return (
    <Column fill padding="24" backgroundColor={Colors.LightGrey}>
      <Column>
        {controller.isBluetoothDenied ? (
          <React.Fragment>
            <Text color={Colors.Red} align="center">
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
          {controller.statusHint !== '' && (
            <Text size="small" color={Colors.Grey}>
              {controller.statusHint}
            </Text>
          )}
          {controller.isStatusCancellable && (
            <Button
              margin={[8, 0, 0, 0]}
              title={t('cancel', { ns: 'common' })}
              onPress={controller.CANCEL}
            />
          )}
        </Column>
      )}
    </Column>
  );
};
