import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {ActorRefFrom} from 'xstate';
import {
  ExistingMosipVCItemEvents,
  ExistingMosipVCItemMachine,
} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {ErrorMessageOverlay} from '../../MessageOverlay';
import {Theme} from '../../ui/styleUtils';
import {VCMetadata} from '../../../shared/VCMetadata';
import {format} from 'date-fns';
import {EsignetMosipVCItemMachine} from '../../../machines/VCItemMachine/EsignetMosipVCItem/EsignetMosipVCItemMachine';

import {VCCardSkeleton} from '../common/VCCardSkeleton';
import {VCCardViewContent} from './VCCardViewContent';
import {useVcItemController} from '../VcItemController';
import {getCredentialIssuersWellKnownConfig} from '../../../shared/openId4VCI/Utils';
import {CARD_VIEW_DEFAULT_FIELDS, isVCLoaded} from '../common/VCUtils';

export const VCCardView: React.FC<
  ExistingVCItemProps | EsignetVCItemProps
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
    isVerified,
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
    : new VCMetadata(props.vcMetadata).isFromOpenId4VCI()
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
      setFields(response.fields);
    });
  }, [verifiableCredential?.wellKnown]);

  if (!isVCLoaded(verifiableCredential, fields)) {
    return (
      <View style={Theme.Styles.closeCardBgContainer}>
        <VCCardSkeleton />
      </View>
    );
  }

  return (
    <React.Fragment>
      <Pressable
        accessible={false}
        onPress={() => props.onPress(service)}
        style={
          props.selected
            ? Theme.Styles.selectedBindedVc
            : Theme.Styles.closeCardBgContainer
        }>
        <VCCardViewContent
          vcMetadata={props.vcMetadata}
          context={context}
          verifiableCredential={verifiableCredential}
          emptyWalletBindingId={emptyWalletBindingId}
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
          flow={props.flow}
          isKebabPopUp={isKebabPopUp}
          DISMISS={DISMISS}
          KEBAB_POPUP={KEBAB_POPUP}
          isVerified={verifiableCredential !== null}
        />
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

export interface ExistingVCItemProps {
  vcMetadata: VCMetadata;
  margin?: string;
  selectable?: boolean;
  selected?: boolean;
  onPress?: (vcRef?: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => void;
  onShow?: (vcRef?: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => void;
  isDownloading?: boolean;
  isPinned?: boolean;
  flow?: string;
}

export interface EsignetVCItemProps {
  vcMetadata: VCMetadata;
  margin?: string;
  selectable?: boolean;
  selected?: boolean;
  onPress?: (vcRef?: ActorRefFrom<typeof EsignetMosipVCItemMachine>) => void;
  onShow?: (vcRef?: ActorRefFrom<typeof EsignetMosipVCItemMachine>) => void;
  isDownloading?: boolean;
  isPinned?: boolean;
  flow?: string;
}
