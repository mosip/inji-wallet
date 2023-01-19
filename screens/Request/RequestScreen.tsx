import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { Switch } from 'react-native-elements';
import { Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Centered, Button, Row, Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useRequestScreen } from './RequestScreenController';
import { isBLEEnabled, isGoogleNearbyEnabled } from '../../lib/smartshare';

export const RequestScreen: React.FC = () => {
  const { t } = useTranslation('RequestScreen');
  const controller = useRequestScreen();
  const props: RequestScreenProps = { t, controller };

  return (
    <Column
      fill
      padding="24"
      backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
      {controller.isBluetoothDenied && <BluetoothPrompt {...props} />}

      {!controller.isCheckingBluetoothService &&
      !controller.isBluetoothDenied ? (
        <Column align="flex-end" fill>
          {controller.isWaitingForConnection && <SharingQR {...props} />}
          <StatusMessage {...props} />
        </Column>
      ) : null}
    </Column>
  );
};

const BluetoothPrompt: React.FC<RequestScreenProps> = ({ t, controller }) => {
  return (
    <Centered fill>
      <Text color={Theme.Colors.errorMessage} align="center">
        {t('bluetoothDenied', { vcLabel: controller.vcLabel.singular })}
      </Text>
      <Button
        margin={[32, 0, 0, 0]}
        title={t('gotoSettings')}
        onPress={controller.GOTO_SETTINGS}
      />
    </Centered>
  );
};

const SharingQR: React.FC<RequestScreenProps> = ({ t, controller }) => {
  return (
    <React.Fragment>
      <Text align="center">
        {t('showQrCode', { vcLabel: controller.vcLabel.singular })}
      </Text>

      <Centered fill>
        {controller.connectionParams !== '' ? (
          <QRCode
            size={200}
            value={controller.connectionParams}
            backgroundColor={Theme.Colors.QRCodeBackgroundColor}
          />
        ) : null}
      </Centered>
      {isGoogleNearbyEnabled && (
        <Row align="center" crossAlign="center" margin={[0, 0, 48, 0]}>
          <Text margin={[0, 16, 0, 0]}>{t('offline')}</Text>
          <Switch
            value={controller.sharingProtocol === 'ONLINE'}
            onValueChange={controller.SWITCH_PROTOCOL}
            disabled={Platform.OS === 'ios'}
          />
          <Text margin={[0, 0, 0, 16]}>{t('online')}</Text>
        </Row>
      )}
    </React.Fragment>
  );
};

const StatusMessage: React.FC<RequestScreenProps> = ({ t, controller }) => {
  return (
    controller.statusMessage !== '' && (
      <Column elevation={1} padding="16 24">
        <Text>{controller.statusMessage}</Text>
        {controller.statusHint !== '' && (
          <Text size="small" color={Theme.Colors.textLabel}>
            {controller.statusHint}
          </Text>
        )}
        {controller.isStatusCancellable && (
          <Button
            margin={[8, 0, 0, 0]}
            title={t('cancel', { ns: 'common' })}
            loading={controller.isCancelling}
            onPress={controller.CANCEL}
          />
        )}
      </Column>
    )
  );
};

interface RequestScreenProps {
  t: TFunction;
  controller: ReturnType<typeof useRequestScreen>;
}
