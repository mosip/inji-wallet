import React from 'react';
import { useInterpret } from '@xstate/react';
import { appMachine, logState } from '../machines/app';

import { GlobalContext } from '../shared/GlobalContext';

export const GlobalContextProvider: React.FC = (props) => {
  const appService = useInterpret(appMachine);

  // TODO: remove in production builds
  appService.subscribe(logState);

  return (
    <GlobalContext.Provider value={{ appService }}>
      {props.children}
    </GlobalContext.Provider>
  );
};
