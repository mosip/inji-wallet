import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {ActorRefFrom} from 'xstate';
import {
  ExistingMosipVCItemEvents,
  ExistingMosipVCItemMachine,
} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {ErrorMessageOverlay} from '../../MessageOverlay';
import {Theme} from '../../ui/styleUtils';
import {Row} from '../../ui';
import {KebabPopUp} from '../../KebabPopUp';
import {VCMetadata} from '../../../shared/VCMetadata';
import {format} from 'date-fns';
import {EsignetMosipVCItemMachine} from '../../../machines/VCItemMachine/EsignetMosipVCItem/EsignetMosipVCItemMachine';

import {VCCardSkeleton} from '../common/VCCardSkeleton';
import {VCCardViewContent} from './VCCardViewContent';
import {MosipVCItemActivationStatus} from '../MosipVCItem/MosipVCItemActivationStatus';
import {useVcItemController} from '../MosipVCItem/VcItemController';
import {getCredentialIssuersWellKnownConfig} from '../../../shared/openId4VCI/Utils';
import {
  CARD_VIEW_ADD_ON_FIELDS,
  CARD_VIEW_DEFAULT_FIELDS,
  isVCLoaded,
} from '../common/VCUtils';

export const VCCardView: React.FC<
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

  const credential = props.isDownloading
    ? null
    : props.vcMetadata.isFromOpenId4VCI()
    ? verifiableCredential?.credential
    : verifiableCredential;

  const [fields, setFields] = useState([]);
  const [wellknown, setWellknown] = useState(null);
  useEffect(() => {
    getCredentialIssuersWellKnownConfig(
      props?.vcMetadata.issuer,
      verifiableCredential?.wellKnown,
      CARD_VIEW_DEFAULT_FIELDS,
    ).then(response => {
      setWellknown(response.wellknown);
      setFields(response.fields.slice(0, 3).concat(CARD_VIEW_ADD_ON_FIELDS));
    });
  }, [verifiableCredential?.wellKnown]);

  if (!isVCLoaded(verifiableCredential, fields)) {
    return <VCCardSkeleton />;
  }

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
        <VCCardViewContent
          vcMetadata={props.vcMetadata}
          context={context}
          verifiableCredential={verifiableCredential}
          credential={credential}
          fields={fields}
          wellknown={wellknown}
          generatedOn={formattedDate}
          selectable={props.selectable}
          selected={props.selected}
          service={service}
          isPinned={props.isPinned}
          onPress={() => props.onPress(service)}
          isDownloading={props.isDownloading}
        />
        <View style={Theme.Styles.horizontalLine} />
        {props.isSharingVc ? null : (
          <Row style={Theme.Styles.activationTab}>
            <MosipVCItemActivationStatus
              vcMetadata={props.vcMetadata}
              verifiableCredential={verifiableCredential}
              emptyWalletBindingId={emptyWalletBindingId}
              showOnlyBindedVc={props.showOnlyBindedVc}
            />
            <Row style={Theme.Styles.verticalLineWrapper}>
              <View style={Theme.Styles.verticalLine} />
            </Row>
            <Row style={Theme.Styles.kebabIcon}>
              <Pressable
                onPress={KEBAB_POPUP}
                accessible={false}
                style={Theme.Styles.kebabPressableContainer}>
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
  isSharingVc?: boolean;
  isDownloading?: boolean;
  isPinned?: boolean;
}

export interface EsignetMosipVCItemProps {
  vcMetadata: VCMetadata;
  margin?: string;
  selectable?: boolean;
  selected?: boolean;
  showOnlyBindedVc?: boolean;
  onPress?: (vcRef?: ActorRefFrom<typeof EsignetMosipVCItemMachine>) => void;
  onShow?: (vcRef?: ActorRefFrom<typeof EsignetMosipVCItemMachine>) => void;
  isSharingVc?: boolean;
  isDownloading?: boolean;
  isPinned?: boolean;
}
