import React from 'react';
import { TextItem } from './ui/TextItem';

export const DeviceInfoList: React.FC<DeviceInfoProps> = (props) => {
  return (
    <React.Fragment>
      <TextItem
        divider
        label={props.of === 'receiver' ? 'Requested by' : 'Sent by'}
        text={props.deviceInfo.deviceName}
      />
      <TextItem divider label="Name" text={props.deviceInfo.name} />
      <TextItem
        divider
        label="Device reference number"
        text={props.deviceInfo.deviceId}
      />
    </React.Fragment>
  );
};

interface DeviceInfoProps {
  of: 'sender' | 'receiver';
  deviceInfo: DeviceInfo;
}

export interface DeviceInfo {
  deviceName: string;
  name: string;
  deviceId: string;
}
