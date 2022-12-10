import { useSelector } from '@xstate/react';
import { useContext, useState } from 'react';
import { ActorRefFrom } from 'xstate';
import {
  QrLoginEvents,
  selectIsInvalidIdentity,
  selectIsisVerifyingIdentity,
  selectIsloadMyVcs,
  selectIsScanning,
  selectIsShowingVcList,
  selectIsShowWarning,
  selectIsVerifyingSuccesful,
  selectMyVcs,
  selectSelectedVc,
} from '../../machines/QrLoginMachine';
import { selectVcLabel } from '../../machines/settings';
import { vcItemMachine } from '../../machines/vcItem';
import { GlobalContext } from '../../shared/GlobalContext';
import { VC } from '../../types/vc';

export function useQrLogin() {
  const [isQrLogin, setQrLogin] = useState(false);
  const { appService } = useContext(GlobalContext);
  const settingsService = appService.children.get('settings');
  const qrLoginService = appService.children.get('QrLogin');
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const SELECT_VC = (vc: VC) =>
    qrLoginService.send(QrLoginEvents.SELECT_VC(vc));

  return {
    SELECT_VC_ITEM:
      (index: number) => (vcRef: ActorRefFrom<typeof vcItemMachine>) => {
        setSelectedIndex(index);
        const vcData = vcRef.getSnapshot().context;
        SELECT_VC(vcData);
      },

    vcKeys: useSelector(qrLoginService, selectMyVcs),
    selectedVc: useSelector(qrLoginService, selectSelectedVc),

    isQrLogin,
    setQrLogin,
    selectedIndex,
    SELECT_VC,

    isScanningQr: useSelector(qrLoginService, selectIsScanning),
    isShowWarning: useSelector(qrLoginService, selectIsShowWarning),
    isLoadingVc: useSelector(qrLoginService, selectIsloadMyVcs),
    isShowingVcList: useSelector(qrLoginService, selectIsShowingVcList),
    isVerifyingIdentity: useSelector(
      qrLoginService,
      selectIsisVerifyingIdentity
    ),
    isInvalidIdentity: useSelector(qrLoginService, selectIsInvalidIdentity),
    isVerifyingSuccesful: useSelector(
      qrLoginService,
      selectIsVerifyingSuccesful
    ),
    vcLabel: useSelector(settingsService, selectVcLabel),

    DISMISS: () => qrLoginService.send(QrLoginEvents.DISMISS()),
    SCANNING_DONE: (qrCode: string) =>
      qrLoginService.send(QrLoginEvents.SCANNING_DONE(qrCode)),
    CONFIRM: () => qrLoginService.send(QrLoginEvents.CONFIRM()),
    VERIFY: () => qrLoginService.send(QrLoginEvents.VERIFY()),
    CANCEL: () => qrLoginService.send(QrLoginEvents.CANCEL()),

    FACE_VALID: () => qrLoginService.send(QrLoginEvents.FACE_VALID()),
    FACE_INVALID: () => qrLoginService.send(QrLoginEvents.FACE_INVALID()),
    RETRY_VERIFICATION: () =>
      qrLoginService.send(QrLoginEvents.RETRY_VERIFICATION()),
  };
}
