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
  selectKebabPopUp,
  VcItemEvents,
} from '../machines/vcItem';
import { Column, Row, Text } from './ui';
import { Theme } from './ui/styleUtils';
import { GlobalContext } from '../shared/GlobalContext';
import { useTranslation } from 'react-i18next';

const VerifiedIcon: React.FC = () => {
  return (
    <Icon
      name="check-circle"
      color={Theme.Colors.VerifiedIcon}
      size={14}
      containerStyle={{ marginStart: 4, bottom: 1 }}
    />
  );
};
import { LocalizedField } from '../types/vc';
import { VcItemTags } from './VcItemTags';
import { KebabPopUp } from './KebabPopUp';

const getDetails = (arg1, arg2, verifiableCredential) => {
  if (arg1 === 'Status') {
    return (
      <Column>
        <Text
          weight="regular"
          size="smaller"
          color={
            !verifiableCredential
              ? Theme.Colors.LoadingDetailsLabel
              : Theme.Colors.DetailsLabel
          }>
          {arg1}
        </Text>
        <Row>
          <Text
            color={Theme.Colors.Details}
            weight="semibold"
            size="smaller"
            style={
              !verifiableCredential
                ? Theme.Styles.loadingTitle
                : Theme.Styles.subtitle
            }>
            {!verifiableCredential ? '' : arg2}
          </Text>
          {!verifiableCredential ? null : <VerifiedIcon />}
        </Row>
      </Column>
    );
  } else {
    return (
      <Column>
        <Text
          color={
            !verifiableCredential
              ? Theme.Colors.LoadingDetailsLabel
              : Theme.Colors.DetailsLabel
          }
          weight="regular"
          size="smaller">
          {arg1}
        </Text>
        <Text
          numLines={4}
          color={Theme.Colors.Details}
          weight="semibold"
          size="smaller"
          style={
            !verifiableCredential
              ? Theme.Styles.loadingTitle
              : Theme.Styles.subtitle
          }>
          {!verifiableCredential ? '' : arg2}
        </Text>
      </Column>
    );
  }
};

const WalletVerified: React.FC = () => {
  return (
    <Icon
      name="verified-user"
      color={Theme.Colors.VerifiedIcon}
      size={28}
      containerStyle={{ marginStart: 4, bottom: 1 }}
    />
  );
};

const WalletUnverified: React.FC = () => {
  return (
    <Icon
      name="shield-alert"
      color={Theme.Colors.Icon}
      size={28}
      type="material-community"
      containerStyle={{ marginStart: 4, bottom: 1 }}
    />
  );
};

export const VcItem: React.FC<VcItemProps> = (props) => {
  const { appService } = useContext(GlobalContext);
  const { t } = useTranslation('VcDetails');
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
  const DISMISS = () => service.send(VcItemEvents.DISMISS());
  //Assigning the UIN and VID from the VC details to display the idtype label
  const uin = verifiableCredential?.credentialSubject.UIN;
  const vid = verifiableCredential?.credentialSubject.VID;

  const generatedOn = useSelector(service, selectGeneratedOn);
  const fullName = !verifiableCredential
    ? ''
    : getLocalizedField(verifiableCredential.credentialSubject.fullName);
  const isvalid = !verifiableCredential ? '' : t('valid');
  const selectableOrCheck = props.selectable ? (
    <CheckBox
      checked={props.selected}
      checkedIcon={<Icon name="radio-button-checked" />}
      uncheckedIcon={<Icon name="radio-button-unchecked" />}
      onPress={() => props.onPress(service)}
    />
  ) : null;

  const tag = useSelector(service, selectTag);
  const [visible, setVisible] = useState(false);
  return (
    <Pressable
      onPress={() => props.onPress(service)}
      disabled={!verifiableCredential}
      style={
        props.selected
          ? Theme.Styles.selectedVc
          : Theme.Styles.closeCardBgContainer
      }>
      <ImageBackground
        source={!verifiableCredential ? null : Theme.CloseCard}
        resizeMode="stretch"
        borderRadius={4}
        style={
          !verifiableCredential
            ? Theme.Styles.vertloadingContainer
            : Theme.Styles.backgroundImageContainer
        }>
        <Column>
          <Row align="space-between">
            <Row>
              <ImageBackground
                source={
                  !verifiableCredential
                    ? Theme.ProfileIcon
                    : { uri: context.credential.biometrics.face }
                }
                style={Theme.Styles.closeCardImage}>
                {props.iconName && (
                  <Icon
                    name={props.iconName}
                    type={props.iconType}
                    color={Theme.Colors.Icon}
                    style={{ marginLeft: -80 }}
                  />
                )}
              </ImageBackground>
              <Column margin="0 0 0 10">
                {getDetails(t('fullName'), fullName, verifiableCredential)}

                <Column margin="10 0 0 0">
                  <Text
                    color={
                      !verifiableCredential
                        ? Theme.Colors.LoadingDetailsLabel
                        : Theme.Colors.DetailsLabel
                    }
                    weight="semibold"
                    size="smaller"
                    align="left">
                    {t('idType')}
                  </Text>
                  <Text
                    weight="regular"
                    color={Theme.Colors.Details}
                    size="smaller"
                    style={
                      !verifiableCredential
                        ? Theme.Styles.loadingTitle
                        : Theme.Styles.subtitle
                    }>
                    {t('nationalCard')}
                  </Text>
                </Column>
              </Column>
            </Row>

            <Column>{verifiableCredential ? selectableOrCheck : null}</Column>
          </Row>

          <Row
            align="space-between"
            margin="5 0 0 0"
            style={
              !verifiableCredential ? Theme.Styles.loadingContainer : null
            }>
            <Column>
              {uin ? getDetails(t('uin'), uin, verifiableCredential) : null}
              {vid ? getDetails(t('vid'), vid, verifiableCredential) : null}
              {!verifiableCredential
                ? getDetails(t('id'), uin || vid, verifiableCredential)
                : null}
              {getDetails(t('generatedOn'), generatedOn, verifiableCredential)}
            </Column>
            <Column>
              {verifiableCredential
                ? getDetails(t('status'), isvalid, verifiableCredential)
                : null}
            </Column>
            <Column style={{ display: verifiableCredential ? 'flex' : 'none' }}>
              <Image
                source={Theme.MosipLogo}
                style={Theme.Styles.logo}
                resizeMethod="auto"
              />
            </Column>
          </Row>
        </Column>
        <VcItemTags tag={tag} />
      </ImageBackground>
      <Row
        width={Dimensions.get('screen').width * 0.8}
        align="space-between"
        crossAlign="center">
        <Row crossAlign="center" style={{ flex: 1 }}>
          {verifiableCredential &&
            (emptyWalletBindingId ? <WalletUnverified /> : <WalletVerified />)}
          <Text
            color={Theme.Colors.Details}
            weight="semibold"
            size="small"
            margin="10 33 10 10"
            style={
              !verifiableCredential
                ? Theme.Styles.loadingTitle
                : Theme.Styles.subtitle
            }
            children={
              emptyWalletBindingId
                ? t('offlineAuthDisabledHeader')
                : t('profileAuthenticated')
            }></Text>
        </Row>
        {verifiableCredential && (
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
        )}
      </Row>
    </Pressable>
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
}

function getLocalizedField(rawField: string | LocalizedField) {
  if (typeof rawField === 'string') {
    return rawField;
  }
  try {
    const locales: LocalizedField[] = JSON.parse(JSON.stringify(rawField));
    return locales[0].value;
  } catch (e) {
    return '';
  }
}
