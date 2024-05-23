import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {ActorRefFrom} from 'xstate';
import {ErrorMessageOverlay} from '../../MessageOverlay';
import {Theme} from '../../ui/styleUtils';
import {VCMetadata} from '../../../shared/VCMetadata';
import {format} from 'date-fns';

import {VCCardSkeleton} from '../common/VCCardSkeleton';
import {VCCardViewContent} from './VCCardViewContent';
import {useVcItemController} from '../VCItemController';
import {getCredentialIssuersWellKnownConfig} from '../../../shared/openId4VCI/Utils';
import {CARD_VIEW_DEFAULT_FIELDS, isVCLoaded} from '../common/VCUtils';
import {
  VCItemEvents,
  VCItemMachine,
} from '../../../machines/VerifiableCredential/VCItemMachine/VCItemMachine';
import {CopilotStep, walkthroughable} from 'react-native-copilot';
import {useTranslation} from 'react-i18next';

export const VCCardView: React.FC<VCItemProps> = props => {
  let {
    service,
    context,
    credential,
    verifiableCredentialData,
    walletBindingResponse,
    isKebabPopUp,
    isSavingFailedInIdle,
    storeErrorTranslationPath,
    generatedOn,
    DISMISS,
    KEBAB_POPUP,
  } = useVcItemController(props);

  const CopilotView = walkthroughable(View);
  const {t} = useTranslation();

  let formattedDate =
    generatedOn && format(new Date(generatedOn), 'MM/dd/yyyy');

  useEffect(() => {
    service.send(VCItemEvents.UPDATE_VC_METADATA(props.vcMetadata));
  }, [props.vcMetadata]);

  const vc = props.isDownloading ? null : credential;

  const [fields, setFields] = useState([]);
  const [wellknown, setWellknown] = useState(null);
  useEffect(() => {
    getCredentialIssuersWellKnownConfig(
      verifiableCredentialData?.issuer,
      verifiableCredentialData?.wellKnown,
      verifiableCredentialData?.credentialTypes,
      CARD_VIEW_DEFAULT_FIELDS,
    ).then(response => {
      setWellknown(response.wellknown);
      setFields(response.fields);
    });
  }, [verifiableCredentialData?.wellKnown]);

  if (!isVCLoaded(credential, fields)) {
    return <VCCardSkeleton />;
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
        {props.isTopCard ? (
          <CopilotStep
            text={t('copilot:cardMessage')}
            order={6}
            name={t('copilot:cardTitle')}>
            <CopilotView>
              <VCCardViewContent
                vcMetadata={props.vcMetadata}
                context={context}
                walletBindingResponse={walletBindingResponse}
                credential={vc}
                verifiableCredentialData={verifiableCredentialData}
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
                isVerified={props.vcMetadata.isVerified}
                isInitialLaunch={props.isInitialLaunch}
              />
            </CopilotView>
          </CopilotStep>
        ) : (
          <VCCardViewContent
            vcMetadata={props.vcMetadata}
            context={context}
            walletBindingResponse={walletBindingResponse}
            credential={vc}
            verifiableCredentialData={verifiableCredentialData}
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
            isVerified={props.vcMetadata.isVerified}
            isInitialLaunch={props.isInitialLaunch}
          />
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

export interface VCItemProps {
  vcMetadata: VCMetadata;
  margin?: string;
  selectable?: boolean;
  selected?: boolean;
  onPress?: (vcRef?: ActorRefFrom<typeof VCItemMachine>) => void;
  onShow?: (vcRef?: ActorRefFrom<typeof VCItemMachine>) => void;
  isDownloading?: boolean;
  isPinned?: boolean;
  flow?: string;
  isInitialLaunch: boolean;
  isTopCard: boolean;
}
