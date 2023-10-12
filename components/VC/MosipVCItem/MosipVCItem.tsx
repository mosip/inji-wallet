import React, {useContext, useEffect, useMemo, useRef} from 'react';
import {useInterpret, useSelector} from '@xstate/react';
import {View, Pressable} from 'react-native';
import {ActorRefFrom} from 'xstate';
import {
  createExistingMosipVCItemMachine,
  selectVerifiableCredential,
  selectGeneratedOn,
  ExistingMosipVCItemMachine,
  selectContext,
  selectEmptyWalletBindingId,
  selectIsSavingFailedInIdle,
  selectKebabPopUp,
} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {ExistingMosipVCItemEvents} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {ErrorMessageOverlay} from '../../MessageOverlay';
import {Theme} from '../../ui/styleUtils';
import {GlobalContext} from '../../../shared/GlobalContext';
import {MosipVCItemContent} from './MosipVCItemContent';
import {MosipVCItemActivationStatus} from './MosipVCItemActivationStatus';
import {Row} from '../../ui';
import {KebabPopUp} from '../../KebabPopUp';
import {VCMetadata} from '../../../shared/VCMetadata';
import {format} from 'date-fns';
import {
  createEsignetMosipVCItemMachine,
  EsignetMosipVCItemEvents,
  EsignetMosipVCItemMachine,
  selectContext as esignetSelectContext,
  selectEmptyWalletBindingId as esignetSelectEmptyWalletBindingId,
  selectGeneratedOn as esignetSelectGeneratedOn,
  selectKebabPopUp as esignetSelectKebabPopUp,
  selectVerifiableCredentials as esignetSelectVerifiableCredentials,
} from '../../../machines/VCItemMachine/EsignetMosipVCItem/EsignetMosipVCItemMachine';

export const MosipVCItem: React.FC<
  ExistingMosipVCItemProps | EsignetMosipVCItemProps
> = props => {
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

  useEffect(() => {
    service.send(
      ExistingMosipVCItemEvents.UPDATE_VC_METADATA(props.vcMetadata),
    );
  }, [props.vcMetadata]);

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
    context = useSelector(service, esignetSelectContext);
    isKebabPopUp = useSelector(service, esignetSelectKebabPopUp);
    generatedOn = useSelector(service, esignetSelectGeneratedOn);
    emptyWalletBindingId = useSelector(
      service,
      esignetSelectEmptyWalletBindingId,
    );
    DISMISS = () => service.send(EsignetMosipVCItemEvents.DISMISS());
    KEBAB_POPUP = () => service.send(EsignetMosipVCItemEvents.KEBAB_POPUP());
    verifiableCredential = useSelector(
      service,
      esignetSelectVerifiableCredentials,
    );
  }
  let formattedDate =
    generatedOn && format(new Date(generatedOn), 'MM/dd/yyyy');
  return (
    <React.Fragment>
      <Pressable
        accessible={false}
        onPress={() => props.onPress(service)}
        disabled={!verifiableCredential}
        style={
          props.selected
            ? Theme.Styles.selectedBindedVc
            : Theme.Styles.closeCardBgContainer
        }>
        <MosipVCItemContent
          vcMetadata={props.vcMetadata}
          context={context}
          verifiableCredential={verifiableCredential}
          generatedOn={formattedDate}
          selectable={props.selectable}
          selected={props.selected}
          service={service}
          iconName={props.iconName}
          iconType={props.iconType}
          onPress={() => props.onPress(service)}
        />
        <View style={Theme.Styles.horizontalLine} />
        {props.isSharingVc ? null : (
          <Row style={Theme.Styles.activationTab}>
            <MosipVCItemActivationStatus
              vcMetadata={props.vcMetadata}
              verifiableCredential={verifiableCredential}
              emptyWalletBindingId={emptyWalletBindingId}
              onPress={() => props.onPress(service)}
              showOnlyBindedVc={props.showOnlyBindedVc}
            />
            <View style={Theme.Styles.verticalLine} />
            <Row style={Theme.Styles.kebabIcon}>
              <Pressable onPress={KEBAB_POPUP} accessible={false}>
                <KebabPopUp
                  vcMetadata={props.vcMetadata}
                  iconName="dots-three-horizontal"
                  iconType="entypo"
                  isVisible={isKebabPopUp}
                  onDismiss={DISMISS}
                  service={service}
                />
              </Pressable>
            </Row>
          </Row>
        )}
      </Pressable>
      <ErrorMessageOverlay
        isVisible={isSavingFailedInIdle}
        error={storeErrorTranslationPath}
        onDismiss={DISMISS}
        translationPath={'VcDetails'}
      />
    </React.Fragment>
  );
};

export interface ExistingMosipVCItemProps {
  vcMetadata: VCMetadata;
  margin?: string;
  selectable?: boolean;
  selected?: boolean;
  showOnlyBindedVc?: boolean;
  onPress?: (vcRef?: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => void;
  onShow?: (vcRef?: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => void;
  iconName?: string;
  iconType?: string;
  isSharingVc?: boolean;
}

export interface EsignetMosipVCItemProps {
  vcMetadata: VCMetadata;
  margin?: string;
  selectable?: boolean;
  selected?: boolean;
  showOnlyBindedVc?: boolean;
  onPress?: (vcRef?: ActorRefFrom<typeof EsignetMosipVCItemMachine>) => void;
  onShow?: (vcRef?: ActorRefFrom<typeof EsignetMosipVCItemMachine>) => void;
  iconName?: string;
  iconType?: string;
  isSharingVc?: boolean;
}
