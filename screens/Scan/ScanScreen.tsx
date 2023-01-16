import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageOverlay } from '../../components/MessageOverlay';
import { QrScanner } from '../../components/QrScanner';
import { Button, Centered, Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { QrLogin } from '../QrLogin/QrLogin';
import { useScanScreen } from './ScanScreenController';

export const ScanScreen: React.FC = () => {
  const { t } = useTranslation('ScanScreen');
  const controller = useScanScreen();

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
        {controller.isQrLogin && (
          <QrLogin
            isVisible={controller.isQrLogin}
            service={controller.isQrRef}
          />
        )}
        <MessageOverlay
          isVisible={controller.isQrLoginstoring}
          title={t('loading')}
          progress
        />
      </Centered>
    </Column>
  );
};
