import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../components/ui/styleUtils';
import { Modal } from '../../components/ui/Modal';
import { Image } from 'react-native';
import { Column, Text } from '../../components/ui';
import { DeviceInfoList } from '../../components/DeviceInfoList';
import { Button } from '../../components/ui';
import { useScanLayout } from './ScanLayoutController';
import { useSendVcScreen } from './SendVcScreenController';

export const SharingSuccessModal: React.FC<SharingSuccessModalProps> = (
  props
) => {
  const { t } = useTranslation('ScanScreen');
  const controller = useScanLayout();
  const controller1 = useSendVcScreen();

  return (
    <React.Fragment>
      <Modal isVisible={controller.isDone}>
        <Column
          margin="64 0"
          crossAlign="center"
          style={Theme.SelectVcOverlayStyles.sharedSuccessfully}>
          <Image source={Theme.SuccessLogo} height={22} width={22} />
          <Text style={Theme.TextStyles.bold}>
            {t('ScanScreen:status.accepted.title')}
          </Text>
          <Text
            align="center"
            style={Theme.TextStyles.bold}
            color={Theme.Colors.profileValue}>
            {t('ScanScreen:status.accepted.message')}
          </Text>
          <Text style={Theme.TextStyles.bold}>
            <DeviceInfoList deviceInfo={controller1.receiverInfo} />
          </Text>
        </Column>
        <Column margin="0 0  0">
          <Button
            type="gradient"
            title={t('ScanScreen:status.accepted.gotohome')}
            onPress={controller.DISMISS}
          />
        </Column>
      </Modal>
    </React.Fragment>
  );
};

interface SharingSuccessModalProps {
  isVisible: boolean;
}
