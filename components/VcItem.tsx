import React, { useContext, useRef, useState } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { Pressable, Image, ImageBackground, Dimensions } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';
import { ActorRefFrom } from 'xstate';
import {
  createVcItemMachine,
  selectVerifiableCredential,
  selectGeneratedOn,
  vcItemMachine,
  selectContext,
  selectTag,
  selectEmptyWalletBindingId,
  selectStoreError,
  selectIsSavingFailedInIdle,
  selectKebabPopUp,
} from '../machines/vcItem';
import { VcItemEvents } from '../machines/vcItem';
import { ErrorMessageOverlay } from '../components/MessageOverlay';
import { Theme } from './ui/styleUtils';
import { GlobalContext } from '../shared/GlobalContext';
import { useTranslation } from 'react-i18next';
import { VcItemTags } from './VcItemTags';
import { KebabPopUp } from './KebabPopUp';
import VerifiedIcon from './VerifiedIcon';
import { getLocalizedField } from '../i18n';
import { VcItemContent } from './VcItemContent';
import { VcItemActivationStatus } from './VcItemActivationStatus';
import { Column, Row } from './ui';

export const VcItem: React.FC<VcItemProps> = (props) => {
  const { appService } = useContext(GlobalContext);
  const machine = useRef(
    createVcItemMachine(
      appService.getSnapshot().context.serviceRefs,
      props.vcKey
    )
  );

  const service = useInterpret(machine.current, { devTools: __DEV__ });
  const context = useSelector(service, selectContext);
  const verifiableCredential = useSelector(service, selectVerifiableCredential);
  const emptyWalletBindingId = useSelector(service, selectEmptyWalletBindingId);
  const isKebabPopUp = useSelector(service, selectKebabPopUp);
  const KEBAB_POPUP = () => service.send(VcItemEvents.KEBAB_POPUP());
  const storeError = useSelector(service, selectStoreError);
  const isSavingFailedInIdle = useSelector(service, selectIsSavingFailedInIdle);
  const DISMISS = () => service.send(VcItemEvents.DISMISS());

  let storeErrorTranslationPath = 'errors.savingFailed';

  //ENOSPC - no space left on a device / drive
  const isDiskFullError = storeError?.message?.match('ENOSPC') != null;
  if (isDiskFullError) {
    storeErrorTranslationPath = 'errors.diskFullError';
  }

  const generatedOn = useSelector(service, selectGeneratedOn);
  const tag = useSelector(service, selectTag);
  return (
    <React.Fragment>
      <Pressable
        onPress={() => props.onPress(service)}
        disabled={!verifiableCredential}
        style={
          props.selected
            ? Theme.Styles.selectedBindedVc
            : Theme.Styles.closeCardBgContainer
        }>
        <VcItemContent
          context={context}
          verifiableCredential={verifiableCredential}
          generatedOn={generatedOn}
          tag={tag}
        />
        <Row crossAlign="center">
          {props.activeTab !== 'receivedVcsTab' &&
            props.activeTab != 'sharingVcScreen' && (
              <VcItemActivationStatus
                verifiableCredential={verifiableCredential}
                emptyWalletBindingId={emptyWalletBindingId}
                onPress={() => props.onPress(service)}
                showOnlyBindedVc={props.showOnlyBindedVc}
              />
            )}
          <Pressable onPress={KEBAB_POPUP}>
            <KebabPopUp
              vcKey={props.vcKey}
              iconName="dots-three-horizontal"
              iconType="entypo"
              isVisible={isKebabPopUp}
              onDismiss={DISMISS}
              service={service}
            />
          </Pressable>
        </Row>
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

interface VcItemProps {
  vcKey: string;
  margin?: string;
  selectable?: boolean;
  selected?: boolean;
  showOnlyBindedVc?: boolean;
  onPress?: (vcRef?: ActorRefFrom<typeof vcItemMachine>) => void;
  onShow?: (vcRef?: ActorRefFrom<typeof vcItemMachine>) => void;
  iconName?: string;
  iconType?: string;
  activeTab?: string;
}
