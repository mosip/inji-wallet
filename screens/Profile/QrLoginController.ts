import { useSelector } from '@xstate/react';
import { useContext, useState } from 'react';
import {
  QrLoginEvents,
  selectIsScanQrCode,
  selectIsShowWarning,
} from '../../machines/QrLoginMachine';
import { GlobalContext } from '../../shared/GlobalContext';

export function useQrLogin() {
  const [isQrLogin, setQrLogin] = useState(false);
  const { appService } = useContext(GlobalContext);
  const qrLoginService = appService.children.get('QrLogin');
  console.log(qrLoginService.id);
  return {
    isQrLogin,
    showQrCode: useSelector(qrLoginService, selectIsScanQrCode),
    showWarning: useSelector(qrLoginService, selectIsShowWarning),
    setQrLogin,
    DISMISS: () => qrLoginService.send(QrLoginEvents.DISMISS()),
    SHOW_QRCODE: () => qrLoginService.send(QrLoginEvents.SHOW_QRCODE()),
    SCANNING_DONE: (qrCode: string) =>
      qrLoginService.send(QrLoginEvents.SCANNING_DONE(qrCode)),
  };
}
