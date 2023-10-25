import {useContext, useRef} from 'react';
import {GlobalContext} from '../../../shared/GlobalContext';
import {
  selectContext,
  selectEmptyWalletBindingId,
  selectGeneratedOn,
  selectKebabPopUp,
  selectVerifiableCredential,
} from '../../../machines/VCItemMachine/commonSelectors';
import {
  createExistingMosipVCItemMachine,
  ExistingMosipVCItemEvents,
  selectIsSavingFailedInIdle,
} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {
  createEsignetMosipVCItemMachine,
  EsignetMosipVCItemEvents,
} from '../../../machines/VCItemMachine/EsignetMosipVCItem/EsignetMosipVCItemMachine';
import {useInterpret, useSelector} from '@xstate/react';
import {EsignetMosipVCItemProps, ExistingMosipVCItemProps} from './MosipVCItem';

export function useVcItemController(
  props: ExistingMosipVCItemProps | EsignetMosipVCItemProps,
) {
  const {appService} = useContext(GlobalContext);
  const machine = useRef(
    !props.vcMetadata.isFromOpenId4VCI()
      ? createExistingMosipVCItemMachine(
          appService.getSnapshot().context.serviceRefs,
          props.vcMetadata,
        )
      : createEsignetMosipVCItemMachine(
          appService.getSnapshot().context.serviceRefs,
          props.vcMetadata,
        ),
  );

  const service = useInterpret(machine.current, {devTools: __DEV__});

  let context = useSelector(service, selectContext);
  let verifiableCredential = useSelector(service, selectVerifiableCredential);
  let emptyWalletBindingId = useSelector(service, selectEmptyWalletBindingId);
  let isKebabPopUp = useSelector(service, selectKebabPopUp);
  let DISMISS = () => service.send(ExistingMosipVCItemEvents.DISMISS());
  let KEBAB_POPUP = () => service.send(ExistingMosipVCItemEvents.KEBAB_POPUP());
  const isSavingFailedInIdle = useSelector(service, selectIsSavingFailedInIdle);
  const storeErrorTranslationPath = 'errors.savingFailed';
  let generatedOn = useSelector(service, selectGeneratedOn);
  if (props.vcMetadata.isFromOpenId4VCI()) {
    context = useSelector(service, selectContext);
    isKebabPopUp = useSelector(service, selectKebabPopUp);
    generatedOn = useSelector(service, selectGeneratedOn);
    emptyWalletBindingId = useSelector(service, selectEmptyWalletBindingId);
    DISMISS = () => service.send(EsignetMosipVCItemEvents.DISMISS());
    KEBAB_POPUP = () => service.send(EsignetMosipVCItemEvents.KEBAB_POPUP());
    verifiableCredential = useSelector(service, selectVerifiableCredential);
  }
  return {
    service,
    context,
    verifiableCredential,
    emptyWalletBindingId,
    isKebabPopUp,
    DISMISS,
    KEBAB_POPUP,
    isSavingFailedInIdle,
    storeErrorTranslationPath,
    generatedOn,
  };
}
