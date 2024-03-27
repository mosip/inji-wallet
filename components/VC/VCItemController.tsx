import {useContext, useRef} from 'react';
import {GlobalContext} from '../../shared/GlobalContext';
import {
  selectContext,
  selectGeneratedOn,
  selectKebabPopUp,
  selectWalletBindingResponse,
  selectCredential,
  selectVerifiableCredentialData,
} from '../../machines/VCItemMachine/selectors';

import {useInterpret, useSelector} from '@xstate/react';
import {VCItemProps} from './Views/VCCardView';
import {VCMetadata} from '../../shared/VCMetadata';
import {
  createVCItemMachine,
  VCItemEvents,
} from '../../machines/VCItemMachine/VCItemMachine';
import {selectIsSavingFailedInIdle} from '../../screens/Home/MyVcsTabMachine';

export function useVcItemController(props: VCItemProps) {
  const {appService} = useContext(GlobalContext);
  const vcMetadata = VCMetadata.fromVC(props.vcMetadata);
  const machine = useRef(
    createVCItemMachine(
      appService.getSnapshot().context.serviceRefs,
      props.vcMetadata,
    ),
  );

  const service = useInterpret(machine.current, {devTools: __DEV__});

  const context = useSelector(service, selectContext);
  const walletBindingResponse = useSelector(
    service,
    selectWalletBindingResponse,
  );
  const isKebabPopUp = useSelector(service, selectKebabPopUp);
  let DISMISS = () => service.send(VCItemEvents.DISMISS());
  let KEBAB_POPUP = () => service.send(VCItemEvents.KEBAB_POPUP());
  const isSavingFailedInIdle = useSelector(service, selectIsSavingFailedInIdle);
  const storeErrorTranslationPath = 'errors.savingFailed';
  const generatedOn = useSelector(service, selectGeneratedOn);
  if (vcMetadata.isFromOpenId4VCI()) {
    DISMISS = () => service.send(VCItemEvents.DISMISS());
    KEBAB_POPUP = () => service.send(VCItemEvents.KEBAB_POPUP());
  }
  return {
    service,
    context,
    credential: useSelector(service, selectCredential),
    verifiableCredentialData: useSelector(
      service,
      selectVerifiableCredentialData,
    ),
    walletBindingResponse,
    isKebabPopUp,
    DISMISS,
    KEBAB_POPUP,
    isSavingFailedInIdle,
    storeErrorTranslationPath,
    generatedOn,
  };
}
