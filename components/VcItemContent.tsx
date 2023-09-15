import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground, View } from 'react-native';
import { getLocalizedField } from '../i18n';
import { VerifiableCredential } from '../types/vc';
import { VcItemTags } from './VcItemTags';
import VerifiedIcon from './VerifiedIcon';
import { Column, Row, Text } from './ui';
import { Theme } from './ui/styleUtils';
import { CheckBox, Icon } from 'react-native-elements';

const getDetails = (arg1, arg2, verifiableCredential) => {
  if (arg1 === 'Status') {
    return (
      <Column
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 7,
        }}>
        <Text
          testID="status"
          weight="regular"
          size="smaller"
          color={
            !verifiableCredential
              ? Theme.Colors.LoadingDetailsLabel
              : Theme.Colors.DetailsLabel
          }>
          {arg1}
        </Text>
        <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {!verifiableCredential ? null : <VerifiedIcon />}
          <Text
            testID="valid"
            numLines={1}
            color={Theme.Colors.Details}
            weight="semibold"
            size="smaller"
            style={
              !verifiableCredential
                ? Theme.Styles.loadingTitle
                : Theme.Styles.detailsValue
            }>
            {!verifiableCredential ? '' : arg2}
          </Text>
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
                <Image
                  source={Theme.PinIcon}
                  style={{
                    height: 30,
                    width: 30,
                    marginLeft: -11,
                    marginTop: -8,
                  }}></Image>
              )}
            </ImageBackground>

            <Column margin="0 0 13 12">
              <Column>
                <Text
                  testID="fullNameTitle"
                  weight="regular"
                  size="smaller"
                  color={
                    !props.verifiableCredential
                      ? Theme.Colors.LoadingDetailsLabel
                      : Theme.Colors.DetailsLabel
                  }>
                  {t('fullName')}
                </Text>
                <Text
                  testID="fullNameValue"
                  weight="semibold"
                  size="smaller"
                  style={
                    !props.verifiableCredential
                      ? Theme.Styles.loadingTitle
                      : Theme.Styles.detailsValue
                  }>
                  {fullName}
                </Text>
              </Column>

              <Column margin="6 0 0 0">
                <Text
                  testID="idType"
                  color={
                    !props.verifiableCredential
                      ? Theme.Colors.LoadingDetailsLabel
                      : Theme.Colors.DetailsLabel
                  }
                  weight="regular"
                  size="smaller"
                  align="left">
                  {t('idType')}
                </Text>
                <Text
                  testID="nationalCard"
                  weight="semibold"
                  color={Theme.Colors.Details}
                  size="smaller"
                  style={
                    !props.verifiableCredential
                      ? Theme.Styles.loadingTitle
                      : Theme.Styles.detailsValue
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
            {uin ? (
              <Column margin="0 0 9 0">
                <Text
                  testID="uin"
                  weight="regular"
                  size="smaller"
                  color={Theme.Colors.DetailsLabel}>
                  {t('uin')}
                </Text>
                <Text
                  testID="uinNumber"
                  weight="semibold"
                  size="smaller"
                  color={Theme.Colors.statusLabel}>
                  {'*'.repeat(uin.length - 4) + uin.slice(-4)}
                </Text>
              </Column>
            ) : null}

            {vid ? (
              <Column margin="0 0 9 0">
                <Text
                  testID="vid"
                  weight="regular"
                  size="smaller"
                  color={Theme.Colors.DetailsLabel}>
                  {t('vid')}
                </Text>
                <Text
                  testID="vidNumber"
                  weight="semibold"
                  size="smaller"
                  color={Theme.Colors.Details}>
                  {'*'.repeat(vid.length - 4) + vid.slice(-4)}
                </Text>
              </Column>
            ) : null}
            {!props.verifiableCredential
              ? getDetails(t('id'), uin || vid, props.verifiableCredential)
              : null}

            <Column margin="9 0 0 0">
              <Text
                testID="generatedOnTitle"
                weight="regular"
                size="smaller"
                color={
                  !props.verifiableCredential
                    ? Theme.Colors.LoadingDetailsLabel
                    : Theme.Colors.DetailsLabel
                }>
                {t('generatedOn')}
              </Text>
              <Text
                testID="generatedOnValue"
                weight="semibold"
                size="smaller"
                style={
                  !props.verifiableCredential
                    ? Theme.Styles.loadingTitle
                    : Theme.Styles.subtitle
                }>
                {props.generatedOn}
              </Text>
            </Column>
          </Column>
          <Column margin="48 0 0 -50">
            {props.verifiableCredential
              ? getDetails(t('status'), isvalid, props.verifiableCredential)
              : null}
          </Column>
          <Column
            testID="logo"
            style={{
              display: props.verifiableCredential ? 'flex' : 'none',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image
              source={Theme.MosipSplashLogo}
              style={Theme.Styles.logo}
              resizeMethod="scale"
              resizeMode="contain"
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
