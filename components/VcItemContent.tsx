import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground, View } from 'react-native';
import { getLocalizedField } from '../i18n';
import { VerifiableCredential } from '../types/vc';
import { RotatingIcon } from './RotatingIcon';
import { VcItemTags } from './VcItemTags';
import VerifiedIcon from './VerifiedIcon';
import { Column, Row, Text } from './ui';
import { Theme } from './ui/styleUtils';
import { CheckBox, Icon } from 'react-native-elements';

const getDetails = (arg1, arg2, verifiableCredential) => {
  if (arg1 === 'Status') {
    return (
      <Column>
        <Text
          weight="bold"
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
            numLines={1}
            color={Theme.Colors.Details}
            weight="bold"
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
          size="smaller"
          weight={'bold'}
          style={Theme.Styles.vcItemLabelHeader}>
          {arg1}
        </Text>
        <Text
          numLines={4}
          color={Theme.Colors.Details}
          weight="bold"
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

export const VcItemContent: React.FC<VcItemContentProps> = (props) => {
  //Assigning the UIN and VID from the VC details to display the idtype label
  const uin = props.verifiableCredential?.credentialSubject.UIN;
  const vid = props.verifiableCredential?.credentialSubject.VID;
  const fullName = !props.verifiableCredential
    ? ''
    : getLocalizedField(props.verifiableCredential.credentialSubject.fullName);
  const { t } = useTranslation('VcDetails');
  const isvalid = !props.verifiableCredential ? '' : t('valid');
  const selectableOrCheck = props.selectable ? (
    <CheckBox
      checked={props.selected}
      checkedIcon={<Icon name="radio-button-checked" />}
      uncheckedIcon={<Icon name="radio-button-unchecked" />}
      onPress={() => props.onPress()}
    />
  ) : null;

  return (
    <ImageBackground
      source={!props.verifiableCredential ? null : Theme.CloseCard}
      resizeMode="stretch"
      borderRadius={4}
      style={
        !props.verifiableCredential
          ? Theme.Styles.vertloadingContainer
          : Theme.Styles.backgroundImageContainer
      }>
      <Column>
        <Row align="space-between">
          <Row>
            <ImageBackground
              source={
                !props.verifiableCredential
                  ? Theme.ProfileIcon
                  : { uri: props.context.credential.biometrics.face }
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
              {getDetails(t('fullName'), fullName, props.verifiableCredential)}

              <Column margin="10 0 0 0">
                <Text
                  color={
                    !props.verifiableCredential
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
                    !props.verifiableCredential
                      ? Theme.Styles.loadingTitle
                      : Theme.Styles.subtitle
                  }>
                  {t('nationalCard')}
                </Text>
              </Column>
            </Column>
          </Row>

          <Column>
            {props.verifiableCredential ? selectableOrCheck : null}
          </Column>
        </Row>

        <Row
          align="space-between"
          margin="5 0 0 0"
          style={
            !props.verifiableCredential ? Theme.Styles.loadingContainer : null
          }>
          <Column>
            {uin ? getDetails(t('uin'), uin, props.verifiableCredential) : null}
            {vid ? getDetails(t('vid'), vid, props.verifiableCredential) : null}
            {!props.verifiableCredential
              ? getDetails(t('id'), uin || vid, props.verifiableCredential)
              : null}
            {getDetails(
              t('generatedOn'),
              props.generatedOn,
              props.verifiableCredential
            )}
          </Column>
          <Column>
            {props.verifiableCredential
              ? getDetails(t('status'), isvalid, props.verifiableCredential)
              : null}
          </Column>
          <Column
            style={{ display: props.verifiableCredential ? 'flex' : 'none' }}>
            <Image
              source={Theme.MosipLogo}
              style={Theme.Styles.logo}
              resizeMethod="auto"
            />
          </Column>
        </Row>
      </Column>
      <VcItemTags tag={props.tag} />
    </ImageBackground>
  );
};

interface VcItemContentProps {
  context: any;
  verifiableCredential: VerifiableCredential;
  generatedOn: string;
  tag: string;
  selectable: boolean;
  selected: boolean;
  iconName?: string;
  iconType?: string;
  service: any;
  onPress?: () => void;
}
