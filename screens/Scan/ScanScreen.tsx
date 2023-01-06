import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { QrScanner } from '../../components/QrScanner';
import { Button, Centered, Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useScanScreen } from './ScanScreenController';

export const ScanScreen: React.FC = () => {
  const { t } = useTranslation('ScanScreen');
  const controller = useScanScreen();
  const props: ScanScreenProps = { t, controller };

  const BluetoothPrompt: React.FC<ScanScreenProps> = ({ t, controller }) => {
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

  return (
    <Column
      fill
      padding="24 0"
      backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
      <Centered
        fill
        align="space-evenly"
        backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
        <Text align="center">{t('header')}</Text>

        {controller.isBluetoothDenied && <BluetoothPrompt {...props} />}

        {controller.isLocationDisabled || controller.isLocationDenied ? (
          <Column align="space-between">
            <Text
              align="center"
              margin="16 0"
              color={Theme.Colors.errorMessage}>
              {controller.locationError.message}
            </Text>
            <Button
              title={controller.locationError.button}
              onPress={controller.LOCATION_REQUEST}
            />
          </Column>
        ) : null}

        {!controller.isEmpty ? (
          controller.isScanning && (
            <Column crossAlign="center">
              <QrScanner onQrFound={controller.SCAN} />
            </Column>
          )
        ) : (
          <Text align="center" color={Theme.Colors.errorMessage}>
            {t('noShareableVcs', { vcLabel: controller.vcLabel.plural })}
          </Text>
        )}
      </Centered>
    </Column>
  );
};

interface ScanScreenProps {
  t: TFunction;
  controller: ReturnType<typeof useScanScreen>;
}
