import React from 'react';
import { DeviceInfoList } from '../../components/DeviceInfoList';
import { Button, Column, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { VcDetails } from '../../components/VcDetails';
import { useReceiveVcScreen } from './ReceiveVcScreenController';
import { useTranslation } from 'react-i18next';

export const ReceiveVcScreen: React.FC = () => {
  const { t } = useTranslation('ReceiveVcScreen');
  const controller = useReceiveVcScreen();

  return (
    <Column scroll padding="24 0 48 0" backgroundColor={Colors.LightGrey}>
      <Column>
        <DeviceInfoList of="sender" deviceInfo={controller.senderInfo} />
        <Text weight="semibold" margin="24 24 0 24">
          {t('header', { vcLabel: controller.vcLabel.singular })}
        </Text>
        <VcDetails vc={controller.incomingVc} />
      </Column>
      <Column padding="0 24" margin="32 0 0 0">
        <Button
          title={t('acceptRequest', { vcLabel: controller.vcLabel.singular })}
          margin="12 0 12 0"
          onPress={controller.ACCEPT}
        />
        <Button
          type="clear"
          title={t('reject')}
          margin="0 0 12 0"
          onPress={controller.REJECT}
        />
      </Column>
    </Column>
  );
};
