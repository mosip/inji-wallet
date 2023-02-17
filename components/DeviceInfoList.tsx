import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from './ui';

export const DeviceInfoList: React.FC<DeviceInfoProps> = (props) => {
  const { t } = useTranslation('DeviceInfoList');

  return (
    <React.Fragment>
      <Text>{props.deviceInfo.deviceName}</Text>
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
