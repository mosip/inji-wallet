import {useContext, useRef} from 'react';
import {GlobalContext} from '../../shared/GlobalContext';
import {
  selectContext,
  selectGeneratedOn,
  selectKebabPopUp,
  selectWalletBindingResponse,
  selectCredential,
  selectVerifiableCredentialData,
  selectCredential2,
} from '../../machines/VerifiableCredential/VCItemMachine/VCItemSelectors';
import {useInterpret, useSelector} from '@xstate/react';
import {VCItemProps} from './Views/VCCardView';
import {
  createVCItemMachine,
  VCItemEvents,
} from '../../machines/VerifiableCredential/VCItemMachine/VCItemMachine';
import {selectIsSavingFailedInIdle} from '../../screens/Home/MyVcsTabMachine';
import {selectIsTourGuide} from '../../machines/auth';

export function useVcItemController(props: VCItemProps) {
  const {appService} = useContext(GlobalContext);
  const machine = useRef(
    createVCItemMachine(
      appService.getSnapshot().context.serviceRefs,
      props.vcMetadata,
    ),
  );
  const VCItemService = useInterpret(machine.current, {devTools: __DEV__});
  const authService = appService.children.get('auth');

  return {
    VCItemService,
    context: useSelector(VCItemService, selectContext),
    credential: useSelector(VCItemService, selectCredential2),
    verifiableCredentialData: useSelector(
      VCItemService,
      selectVerifiableCredentialData,
    ),
    walletBindingResponse: useSelector(
      VCItemService,
      selectWalletBindingResponse,
    ),
    isKebabPopUp: useSelector(VCItemService, selectKebabPopUp),
    DISMISS: () => VCItemService.send(VCItemEvents.DISMISS()),
    KEBAB_POPUP: () => VCItemService.send(VCItemEvents.KEBAB_POPUP()),
    UPDATE_VC_METADATA: vcMetadata =>
      VCItemService.send(VCItemEvents.UPDATE_VC_METADATA(vcMetadata)),
    isSavingFailedInIdle: useSelector(
      VCItemService,
      selectIsSavingFailedInIdle,
    ),
    storeErrorTranslationPath: 'errors.savingFailed',
    generatedOn: useSelector(VCItemService, selectGeneratedOn),
    isTourGuide: useSelector(authService, selectIsTourGuide),
  };
}
