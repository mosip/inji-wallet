import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from './ui';

export const DeviceInfoList: React.FC<DeviceInfoProps> = (props) => {
  const { t } = useTranslation('DeviceInfoList');

  return (
    <React.Fragment>
      <TextItem
        divider
        label={props.of === 'receiver' ? t('requestedBy') : t('sentBy')}
        text={t(props.deviceInfo.deviceName)}
      />
    </React.Fragment>
  );
};

interface DeviceInfoProps {
  deviceInfo: DeviceInfo;
}

export interface DeviceInfo {
  deviceName: string;
  name: string;
  deviceId: string;
}
