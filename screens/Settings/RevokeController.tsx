import {useSelector} from '@xstate/react';
import {useContext, useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {GlobalContext} from '../../shared/GlobalContext';
import {
  selectIsRefreshingMyVcs,
  selectMyVcsMetadata,
  VcEvents,
} from '../../machines/vc';
import {vcItemMachine} from '../../machines/vcItem';
import {useTranslation} from 'react-i18next';

import {
  RevokeVidsEvents,
  selectIsAcceptingOtpInput,
  selectIsRevokingVc,
  selectIsLoggingRevoke,
} from '../../machines/revoke';

import {ActorRefFrom} from 'xstate';

export function useRevoke() {
  const {t} = useTranslation('ProfileScreen');
  const {appService} = useContext(GlobalContext);
  const vcService = appService.children.get('vc');
  const revokeService = appService.children.get('RevokeVids');
  const vcsMetadata = useSelector(vcService, selectMyVcsMetadata);
  const isRevokingVc = useSelector(revokeService, selectIsRevokingVc);
  const isLoggingRevoke = useSelector(revokeService, selectIsLoggingRevoke);
  const isAcceptingOtpInput = useSelector(
    revokeService,
    selectIsAcceptingOtpInput,
  );

  const [isRevoking, setRevoking] = useState(false);
  const [isAuthenticating, setAuthenticating] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const [selectedVidUniqueIds, setSelectedVidUniqueIds] = useState<string[]>(
    [],
  );

  const vidsMetadata = vcsMetadata.filter(
    vcMetadata => vcMetadata.idType === 'VID',
  );

  const selectVcItem = (index: number, vcUniqueId: string) => {
    return () => {
      setSelectedIndex(index);
      if (selectedVidUniqueIds.includes(vcUniqueId)) {
        setSelectedVidUniqueIds(
          selectedVidUniqueIds.filter(item => item !== vcUniqueId),
        );
      } else {
        setSelectedVidUniqueIds(prevArray => [...prevArray, vcUniqueId]);
      }
    };
  };

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
      setSelectedVidUniqueIds([]);
      showToast(t('revokeSuccessful'));
    }
    if (isLoggingRevoke) {
      revokeService.send(RevokeVidsEvents.DISMISS());
      vcService.send(VcEvents.REFRESH_MY_VCS());
    }
  }, [isRevokingVc, isLoggingRevoke]);

  return {
    error: '',
    isAcceptingOtpInput,
    isAuthenticating,
    isRefreshingVcs: useSelector(vcService, selectIsRefreshingMyVcs),
    isRevoking,
    isViewing,
    message,
    selectedIndex,
    selectedVidUniqueIds,
    toastVisible,
    uniqueVidsMetadata: vidsMetadata.filter(
      (vcMetadata, index, vid) => vid.indexOf(vcMetadata) === index,
    ),

    CONFIRM_REVOKE_VC: () => {
      setRevoking(true);
    },
    DISMISS: () => {
      revokeService.send(RevokeVidsEvents.DISMISS());
    },
    INPUT_OTP: (otp: string) =>
      revokeService.send(RevokeVidsEvents.INPUT_OTP(otp)),
    REFRESH: () => vcService.send(VcEvents.REFRESH_MY_VCS()),
    REVOKE_VC: () => {
      revokeService.send(RevokeVidsEvents.REVOKE_VCS(selectedVidUniqueIds));
      setRevoking(false);
      //since nested modals/overlays don't work in ios, we need to toggle revoke screen
      setIsViewing(false);
    },
    revokeVc: (otp: string) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          revokeService.send(RevokeVidsEvents.INPUT_OTP(otp));
        } else {
          revokeService.send(RevokeVidsEvents.DISMISS());
          showToast('Request network failed');
        }
      });
    },
    setAuthenticating,
    selectVcItem,
    setIsViewing,
    setRevoking,
  };
}

export interface RevokeProps {
  service: ActorRefFrom<typeof vcItemMachine>;
}
