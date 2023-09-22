import React, {useContext, useRef} from 'react';
import {useInterpret, useSelector} from '@xstate/react';
import {Pressable} from 'react-native';
import {ActorRefFrom} from 'xstate';
import {GlobalContext} from '../../../shared/GlobalContext';
import {logState} from '../../../machines/app';
import {Theme} from '../../ui/styleUtils';
import {Row} from '../../ui';
import {KebabPopUp} from '../../KebabPopUp';
import {VCMetadata} from '../../../shared/VCMetadata';
import {EsignetMosipVCItemContent} from './EsignetMosipVCItemContent';
import {EsignetMosipVCActivationStatus} from './EsignetMosipVCItemActivationStatus';
import {
  EsignetMosipVCItemEvents,
  EsignetMosipVCItemMachine,
  createEsignetMosipVCItemMachine,
  selectContext,
  selectGeneratedOn,
  selectKebabPopUp,
  selectVerifiableCredentials,
} from '../../../machines/VCItemMachine/EsignetMosipVCItem/EsignetMosipVCItemMachine';

export const EsignetMosipVCItem: React.FC<EsignetMosipVCItemProps> = props => {
  const {appService} = useContext(GlobalContext);
  const machine = useRef(
    createEsignetMosipVCItemMachine(
      appService.getSnapshot().context.serviceRefs,
      props.vcMetadata,
    ),
  );

  const service = useInterpret(machine.current, {devTools: __DEV__});
  service.subscribe(logState);
  const context = useSelector(service, selectContext);

  const isKebabPopUp = useSelector(service, selectKebabPopUp);
  const DISMISS = () => service.send(EsignetMosipVCItemEvents.DISMISS());
  const KEBAB_POPUP = () =>
    service.send(EsignetMosipVCItemEvents.KEBAB_POPUP());

  const credentials = useSelector(service, selectVerifiableCredentials);
  const generatedOn = useSelector(service, selectGeneratedOn);

  return (
    <React.Fragment>
      <Pressable
        onPress={() => props.onPress(service)}
        disabled={!credentials}
        style={
          props.selected
            ? Theme.Styles.selectedBindedVc
            : Theme.Styles.closeCardBgContainer
        }>
        <EsignetMosipVCItemContent
          context={context}
          credential={credentials}
          generatedOn={generatedOn}
          selectable={props.selectable}
          selected={props.selected}
          service={service}
          iconName={props.iconName}
          iconType={props.iconType}
          onPress={() => props.onPress(service)}
        />
        {props.isSharingVc ? null : (
          <Row crossAlign="center">
            {props.activeTab !== 'receivedVcsTab' &&
              props.activeTab != 'sharingVcScreen' && (
                <EsignetMosipVCActivationStatus
                  verifiableCredential={credentials}
                  showOnlyBindedVc={props.showOnlyBindedVc}
                  emptyWalletBindingId
                />
              )}
            <Pressable onPress={KEBAB_POPUP}>
              <KebabPopUp
                testID="ellipsis"
                vcMetadata={props.vcMetadata}
                iconName="dots-three-horizontal"
                iconType="entypo"
                isVisible={isKebabPopUp}
                onDismiss={DISMISS}
                service={service}
              />
            </Pressable>
          </Row>
        )}
      </Pressable>
    </React.Fragment>
  );
};

export interface EsignetMosipVCItemProps {
  vcMetadata: VCMetadata;
  margin?: string;
  selectable?: boolean;
  selected?: boolean;
  showOnlyBindedVc?: boolean;
  onPress?: (vcRef?: ActorRefFrom<typeof EsignetMosipVCItemMachine>) => void;
  onShow?: (vcRef?: ActorRefFrom<typeof EsignetMosipVCItemMachine>) => void;
  activeTab?: string;
  iconName?: string;
  iconType?: string;
  isSharingVc?: boolean;
}
