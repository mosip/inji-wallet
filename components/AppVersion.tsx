import React, { useContext } from 'react';
import { useSelector } from '@xstate/react';
import { getVersion } from 'react-native-device-info';

import { selectBackendInfo } from '../machines/app';
import { GlobalContext } from '../shared/GlobalContext';
import { Column, Text } from './ui';
import { Colors } from './ui/styleUtils';

export const AppVersion: React.FC = () => {
  const { appService } = useContext(GlobalContext);
  const backendInfo = useSelector(appService, selectBackendInfo);

  return (
    <Column>
      <VersionText>Version: {getVersion()}</VersionText>
      {backendInfo.application.name !== '' ? (
        <React.Fragment>
          <VersionText>
            {backendInfo.application.name}: {backendInfo.application.version}
          </VersionText>
          <VersionText>MOSIP: {backendInfo.config['mosip.host']}</VersionText>
        </React.Fragment>
      ) : null}
    </Column>
  );
};

const VersionText: React.FC = (props) => (
  <Text weight="semibold" align="center" size="smaller" color={Colors.Grey}>
    {props.children}
  </Text>
);
