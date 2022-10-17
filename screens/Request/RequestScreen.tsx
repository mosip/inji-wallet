import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { Centered, Button, Row, Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useRequestScreen } from './RequestScreenController';
import { TFunction, useTranslation } from 'react-i18next';
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
      {controller.isBluetoothDenied && (
        <BluetoothPrompt t={t} controller={controller} />
      )}

      {!controller.isCheckingBluetoothService &&
      !controller.isBluetoothDenied ? (
        <Column align="flex-end" fill>
          {controller.isWaitingForConnection && (
            <SharingCode t={t} controller={controller} />
          )}
          <StatusMessage t={t} controller={controller} />
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
            onPress={controller.CANCEL}
          />
        )}
      </Column>
    )
  );
};

const SharingCode: React.FC<RequestScreenProps> = ({ t, controller }) => {
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

      <Row align="center" crossAlign="center" margin={[0, 0, 48, 0]}>
        <Text margin={[0, 16, 0, 0]}>Offline</Text>
        <Switch
          value={controller.sharingProtocol === 'ONLINE'}
          onValueChange={controller.SWITCH_PROTOCOL}
          disabled={Platform.OS === 'ios'}
        />
        <Text margin={[0, 0, 0, 16]}>Online</Text>
      </Row>
    </React.Fragment>
  );
};

interface RequestScreenProps {
  t: TFunction;
  controller: ReturnType<typeof useRequestScreen>;
}
