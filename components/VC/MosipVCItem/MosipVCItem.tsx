import React, {useEffect} from 'react';
import {Pressable, View} from 'react-native';
import {ActorRefFrom} from 'xstate';
import {
  ExistingMosipVCItemEvents,
  ExistingMosipVCItemMachine,
} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {ErrorMessageOverlay} from '../../MessageOverlay';
import {Theme} from '../../ui/styleUtils';
import {MosipVCItemContent} from './MosipVCItemContent';
import {MosipVCItemActivationStatus} from './MosipVCItemActivationStatus';
import {Row} from '../../ui';
import {KebabPopUp} from '../../KebabPopUp';
import {VCMetadata} from '../../../shared/VCMetadata';
import {format} from 'date-fns';
import {EsignetMosipVCItemMachine} from '../../../machines/VCItemMachine/EsignetMosipVCItem/EsignetMosipVCItemMachine';
import {useVcItemController} from './VcItemController';

export const MosipVCItem: React.FC<
  ExistingMosipVCItemProps | EsignetMosipVCItemProps
> = props => {
  let {
    service,
    context,
    verifiableCredential,
    emptyWalletBindingId,
    isKebabPopUp,
    isSavingFailedInIdle,
    storeErrorTranslationPath,
    generatedOn,

    DISMISS,
    KEBAB_POPUP,
  } = useVcItemController(props);

  let formattedDate =
    generatedOn && format(new Date(generatedOn), 'MM/dd/yyyy');

  useEffect(() => {
    service.send(
      ExistingMosipVCItemEvents.UPDATE_VC_METADATA(props.vcMetadata),
    );
  }, [props.vcMetadata]);

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
          isDownloading={props.isDownloading}
        />
        <View style={Theme.Styles.horizontalLine} />
        {props.isSharingVc ? null : (
          <Row style={Theme.Styles.activationTab}>
            {props.activeTab !== 'receivedVcsTab' &&
              props.activeTab != 'sharingVcScreen' && (
                <MosipVCItemActivationStatus
                  vcMetadata={props.vcMetadata}
                  verifiableCredential={verifiableCredential}
                  emptyWalletBindingId={emptyWalletBindingId}
                  onPress={() => props.onPress(service)}
                  showOnlyBindedVc={props.showOnlyBindedVc}
                />
              )}
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
  activeTab?: string;
  iconName?: string;
  iconType?: string;
  isSharingVc?: boolean;
  isDownloading?: boolean;
}

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
  isDownloading?: boolean;
}
