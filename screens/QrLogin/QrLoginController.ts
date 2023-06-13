import { useSelector } from '@xstate/react';
import { useContext, useState } from 'react';
import { ActorRefFrom } from 'xstate';
import {
  QrLoginEvents,
  selectClientName,
  selectErrorMessage,
  selectIsInvalidIdentity,
  selectIsisVerifyingIdentity,
  selectIsLinkTransaction,
  selectIsloadMyVcs,
  selectIsRequestConsent,
  selectIsSendingConsent,
  selectIsSharing,
  selectIsShowError,
  selectIsShowingVcList,
  selectIsVerifyingSuccesful,
  selectIsWaitingForData,
  selectLinkTransactionResponse,
  selectLogoUrl,
  selectDomainName,
  selectSelectedVc,
  selectVoluntaryClaims,
  selectIsSendingAuthenticate,
  selectEssentialClaims,
} from '../../machines/QrLoginMachine';
import { selectBindedVcs } from '../../machines/vc';
import { vcItemMachine } from '../../machines/vcItem';
import { GlobalContext } from '../../shared/GlobalContext';
import { VC } from '../../types/vc';
import { QrLoginProps } from './QrLogin';

export function useQrLogin({ service }: QrLoginProps) {
  const { appService } = useContext(GlobalContext);

  const vcService = appService.children.get('vc');
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const SELECT_VC = (vc: VC) => service.send(QrLoginEvents.SELECT_VC(vc));

  const SELECT_CONSENT = (value: boolean, claim: string) => {
    service.send(QrLoginEvents.TOGGLE_CONSENT_CLAIM(value, claim));
  };

  const isShare = useSelector(service, selectIsSharing);

  return {
    SELECT_VC_ITEM:
      (index: number) => (vcRef: ActorRefFrom<typeof vcItemMachine>) => {
        setSelectedIndex(index);
        const vcData = vcRef.getSnapshot().context;
        SELECT_VC(vcData);
      },

    vcKeys: useSelector(vcService, selectBindedVcs),
    selectedVc: useSelector(service, selectSelectedVc),
    linkTransactionResponse: useSelector(
      service,
      selectLinkTransactionResponse
    ),
    domainName: useSelector(service, selectDomainName),
    logoUrl: useSelector(service, selectLogoUrl),
    essentialClaims: useSelector(service, selectEssentialClaims),
    voluntaryClaims: useSelector(service, selectVoluntaryClaims),
    clientName: useSelector(service, selectClientName),
    error: useSelector(service, selectErrorMessage),

    isShare,

    selectedIndex,
    SELECT_VC,
    SELECT_CONSENT,
    isWaitingForData: useSelector(service, selectIsWaitingForData),
    isShowingVcList: useSelector(service, selectIsShowingVcList),
    isLinkTransaction: useSelector(service, selectIsLinkTransaction),
    isLoadingMyVcs: useSelector(service, selectIsloadMyVcs),
    isRequestConsent: useSelector(service, selectIsRequestConsent),
    isShowingError: useSelector(service, selectIsShowError),
    isSendingAuthenticate: useSelector(service, selectIsSendingAuthenticate),
    isSendingConsent: useSelector(service, selectIsSendingConsent),
    isVerifyingIdentity: useSelector(service, selectIsisVerifyingIdentity),
    isInvalidIdentity: useSelector(service, selectIsInvalidIdentity),
    isVerifyingSuccesful: useSelector(service, selectIsVerifyingSuccesful),

    DISMISS: () => service.send(QrLoginEvents.DISMISS()),
    SCANNING_DONE: (qrCode: string) =>
      service.send(QrLoginEvents.SCANNING_DONE(qrCode)),
    CONFIRM: () => service.send(QrLoginEvents.CONFIRM()),
    VERIFY: () => service.send(QrLoginEvents.VERIFY()),
    CANCEL: () => service.send(QrLoginEvents.CANCEL()),

    FACE_VALID: () => service.send(QrLoginEvents.FACE_VALID()),
    FACE_INVALID: () => service.send(QrLoginEvents.FACE_INVALID()),
    RETRY_VERIFICATION: () => service.send(QrLoginEvents.RETRY_VERIFICATION()),
  };
}
