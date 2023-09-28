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
  selectTag,
  selectEmptyWalletBindingId,
  selectIsSavingFailedInIdle,
  selectKebabPopUp,
  selectIsTampered,
} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {ExistingMosipVCItemEvents} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {ErrorMessageOverlay, MessageOverlay} from '../../MessageOverlay';
import {Theme} from '../../ui/styleUtils';
import {GlobalContext} from '../../../shared/GlobalContext';
import {ExistingMosipVCItemContent} from './ExistingMosipVCItemContent';
import {ExistingMosipVCItemActivationStatus} from './ExistingMosipVCItemActivationStatus';
import {Row} from '../../ui';
import {KebabPopUp} from '../../KebabPopUp';
import {VCMetadata} from '../../../shared/VCMetadata';
import {format} from 'date-fns';
import {useTranslation} from 'react-i18next';

export const ExistingMosipVCItem: React.FC<
  ExistingMosipVCItemProps
> = props => {
  const {appService} = useContext(GlobalContext);
  const machine = useRef(
    createExistingMosipVCItemMachine(
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

  const context = useSelector(service, selectContext);
  const verifiableCredential = useSelector(service, selectVerifiableCredential);
  const emptyWalletBindingId = useSelector(service, selectEmptyWalletBindingId);
  const isKebabPopUp = useSelector(service, selectKebabPopUp);
  const DISMISS = () => service.send(ExistingMosipVCItemEvents.DISMISS());
  const KEBAB_POPUP = () =>
    service.send(ExistingMosipVCItemEvents.KEBAB_POPUP());
  const isSavingFailedInIdle = useSelector(service, selectIsSavingFailedInIdle);

  const storeErrorTranslationPath = 'errors.savingFailed';

  const generatedOn = useSelector(service, selectGeneratedOn);
  const formattedDate = format(new Date(generatedOn), 'MM/dd/yyyy');
  const tag = useSelector(service, selectTag);

  const isTampered = useSelector(service, selectIsTampered);
  const CLEAR_TAMPERED = () =>
    service.send(ExistingMosipVCItemEvents.DISMISS());
  const {t} = useTranslation('MyVcsTab');

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
        <ExistingMosipVCItemContent
          context={context}
          verifiableCredential={verifiableCredential}
          generatedOn={formattedDate}
          tag={tag}
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
            {props.activeTab !== 'receivedVcsTab' &&
              props.activeTab != 'sharingVcScreen' && (
                <ExistingMosipVCItemActivationStatus
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

      <MessageOverlay
        isVisible={isTampered}
        title={t('errors.vcIsTampered.title')}
        message={t('errors.vcIsTampered.message')}
        onButtonPress={CLEAR_TAMPERED}
        buttonText={t('common:ok')}
        customHeight={'auto'}
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
}
