import { useSelector, useMachine } from '@xstate/react';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../shared/GlobalContext';
import {  selectIsRefreshingMyVcs, selectMyVcs, VcEvents, } from '../../machines/vc';
import { vcItemMachine } from '../../machines/vcItem';
import { useTranslation } from 'react-i18next';

import {
  RevokeVidsEvents,
  revokeVidsMachine,
} from './RevokeMachine';
import { ActorRefFrom } from 'xstate';

export function useRevoke() {
  const { t } = useTranslation('ProfileScreen');
  const [state, send ] = useMachine(revokeVidsMachine);
  const { appService } = useContext(GlobalContext);
  const vcService = appService.children.get('vc');
  const vcKeys = useSelector(vcService, selectMyVcs);
  const isRevokingVc = state.matches('revokingVc');

  const [isRevoking, setRevoking] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [message, setMessage] = useState('');
  //const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const [selectedVidKeys, setSelectedVidKeys] = useState<string[]>([]);

  const vidKeys = vcKeys.filter((vc) => {
    const vcKey = vc.split(":");
    return vcKey[1] === 'VID';
  });

  const selectVcItem = (index: number, vcKey: string) => {
    return () => {
      setSelectedIndex(index);
      if(selectedVidKeys.includes(vcKey)) {
        setSelectedVidKeys(selectedVidKeys.filter(item => item !== vcKey))
      } else {
        setSelectedVidKeys(prevArray => [...prevArray, vcKey])
      }
    };
  }

  const showToast = (message: string) => {
    setToastVisible(true);
    setMessage(message);
    setTimeout(() => {
      setToastVisible(false);
      setMessage('');
    }, 3000);
  };

  useEffect(() => {
    if (isRevokingVc) {
      showToast(t('revokeSuccessful'));
      send(RevokeVidsEvents.DISMISS());
    }
  }, [isRevokingVc]);

  return {
    error: '',
    isAcceptingOtpInput: state.matches('acceptingOtpInput'),
    isRefreshingVcs: useSelector(vcService, selectIsRefreshingMyVcs),
    isRevoking,
    isViewing,
    message,
    selectedIndex,
    selectedVidKeys,
    toastVisible,
    vidKeys,
    
    CONFIRM_REVOKE_VC: () => {
      setRevoking(true);
    },
    DISMISS: () => {
      send(RevokeVidsEvents.DISMISS());
    },
    INPUT_OTP: (otp: string) => send(RevokeVidsEvents.INPUT_OTP(otp)),
    REFRESH: () => vcService.send(VcEvents.REFRESH_MY_VCS()),
    REVOKE_VC: () => {
      send(RevokeVidsEvents.REVOKE_VCS(selectedVidKeys));
      setRevoking(false);
    },
    selectVcItem,
    setIsViewing,
    setRevoking
  };
}

export interface RevokeProps {
  service: ActorRefFrom<typeof vcItemMachine>;
}