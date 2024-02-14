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
  selectIsVcVerified,
} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {
  createEsignetMosipVCItemMachine,
  EsignetMosipVCItemEvents,
} from '../../../machines/VCItemMachine/EsignetMosipVCItem/EsignetMosipVCItemMachine';
import {useInterpret, useSelector} from '@xstate/react';
import {EsignetMosipVCItemProps, ExistingMosipVCItemProps} from './MosipVCItem';
import {VCMetadata} from '../../../shared/VCMetadata';

export function useVcItemController(
  props: ExistingMosipVCItemProps | EsignetMosipVCItemProps,
) {
  const {appService} = useContext(GlobalContext);
  const vcMetadata = VCMetadata.fromVC(props.vcMetadata);
  const machine = useRef(
    !vcMetadata.isFromOpenId4VCI()
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

  const context = useSelector(service, selectContext);
  const verifiableCredential = useSelector(service, selectVerifiableCredential);
  const emptyWalletBindingId = useSelector(service, selectEmptyWalletBindingId);
  const isKebabPopUp = useSelector(service, selectKebabPopUp);
  let DISMISS = () => service.send(ExistingMosipVCItemEvents.DISMISS());
  let KEBAB_POPUP = () => service.send(ExistingMosipVCItemEvents.KEBAB_POPUP());
  const isSavingFailedInIdle = useSelector(service, selectIsSavingFailedInIdle);
  let isVerified: undefined | boolean;
  if (!vcMetadata.isFromOpenId4VCI()) {
    isVerified = useSelector(service, selectIsVcVerified);
  }
  const storeErrorTranslationPath = 'errors.savingFailed';
  const generatedOn = useSelector(service, selectGeneratedOn);
  if (vcMetadata.isFromOpenId4VCI()) {
    DISMISS = () => service.send(EsignetMosipVCItemEvents.DISMISS());
    KEBAB_POPUP = () => service.send(EsignetMosipVCItemEvents.KEBAB_POPUP());
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
    isVerified,
  };
}
