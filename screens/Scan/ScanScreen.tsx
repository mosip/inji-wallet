import React from 'react';
import { useTranslation } from 'react-i18next';
import { QrScanner } from '../../components/QrScanner';
import { Button, Centered, Column, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { useScanScreen } from './ScanScreenController';

export const ScanScreen: React.FC = () => {
  const { t } = useTranslation('ScanScreen');
  const controller = useScanScreen();

  return (
    <Centered fill align="space-evenly" backgroundColor={Colors.LightGrey}>
      <Text align="center">{t('header')}</Text>

      {controller.isLocationDisabled || controller.isLocationDenied ? (
        <Column align="space-between">
          <Text align="center" margin="16 0" color={Colors.Red}>
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
        <Text align="center" color={Colors.Red}>
          {t('noShareableVcs', { vcLabel: controller.vcLabel.plural })}
        </Text>
      )}
    </Centered>
  );
};
