import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, ImageBackground, View} from 'react-native';
import {getLocalizedField} from '../../../i18n';
import {VerifiableCredential} from '../../../types/VC/ExistingMosipVC/vc';
import VerifiedIcon from '../../VerifiedIcon';
import {Column, Row, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import {CheckBox, Icon} from 'react-native-elements';
import testIDProps from '../../../shared/commonUtil';

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
        <Row
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 9,
          }}>
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
          weight="regular"
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

function getIdNumber(id: string) {
  return '*'.repeat(id.length - 4) + id.slice(-4);
}

const getIssuerLogo = (isOpenId4VCI: boolean, issuerLogo: string) => {
  if (isOpenId4VCI) {
    return (
      <Image
        src={issuerLogo}
        style={Theme.Styles.issuerLogo}
        resizeMethod="scale"
        resizeMode="contain"
      />
    );
  }
  return (
    <Image
      source={Theme.MosipSplashLogo}
      style={Theme.Styles.logo}
      resizeMethod="scale"
      resizeMode="contain"
    />
  );
};

export const MosipVCItemContent: React.FC<
  ExistingMosipVCItemContentProps | EsignetMosipVCItemContentProps
> = props => {
  const verifiableCredential = props.vcMetadata.isFromOpenId4VCI()
    ? props.verifiableCredential?.credential
    : props.verifiableCredential;

  //Assigning the UIN and VID from the VC details to display the idtype label
  const uin = verifiableCredential?.credentialSubject.UIN;
  const vid = verifiableCredential?.credentialSubject.VID;
  const fullName = !verifiableCredential
    ? ''
    : getLocalizedField(verifiableCredential?.credentialSubject.fullName);
  const {t} = useTranslation('VcDetails');
  const isvalid = !verifiableCredential ? '' : t('valid');
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
      source={!verifiableCredential ? null : Theme.CloseCard}
      resizeMode="stretch"
      style={
        !verifiableCredential
          ? Theme.Styles.vertloadingContainer
          : Theme.Styles.backgroundImageContainer
      }>
      <Column>
        <Row align="space-between">
          <Row margin="5 0 0 5">
            <ImageBackground
              imageStyle={Theme.Styles.faceImage}
              source={
                !verifiableCredential
                  ? Theme.ProfileIcon
                  : {
                      uri: props.vcMetadata.isFromOpenId4VCI()
                        ? verifiableCredential?.credentialSubject.face
                        : props.context.credential.biometrics.face,
                    }
              }
              style={Theme.Styles.closeCardImage}>
              {props.iconName && (
                <Image
                  source={Theme.PinIcon}
                  style={Theme.Styles.pinIcon}
                  {...testIDProps('pinIcon')}
                />
              )}
            </ImageBackground>

            <Column margin="0 0 10 20" height={96} align="space-between">
              <Column>
                <Text
                  testID="fullNameTitle"
                  weight="regular"
                  size="smaller"
                  color={
                    !verifiableCredential
                      ? Theme.Colors.LoadingDetailsLabel
                      : Theme.Colors.DetailsLabel
                  }>
                  {t('fullName')}
                </Text>
                <Text
                  testID="fullNameValue"
                  weight="semibold"
                  style={
                    !verifiableCredential
                      ? Theme.Styles.loadingTitle
                      : Theme.Styles.detailsValue
                  }>
                  {fullName}
                </Text>
              </Column>

              <Column>
                <Text
                  testID="idType"
                  color={
                    !verifiableCredential
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
                  style={
                    !verifiableCredential
                      ? Theme.Styles.loadingTitle
                      : Theme.Styles.detailsValue
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
          margin="9 10 0 7"
          style={!verifiableCredential ? Theme.Styles.loadingContainer : null}>
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
                  size="extraSmall"
                  color={Theme.Colors.statusLabel}>
                  {getIdNumber(uin)}
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
                  size="extraSmall"
                  color={Theme.Colors.Details}>
                  {getIdNumber(vid)}
                </Text>
              </Column>
            ) : null}
            {!verifiableCredential
              ? getDetails(t('id'), uin || vid, verifiableCredential)
              : null}
          </Column>
        </Row>

        <Row
          style={{flexDirection: 'row', flex: 1}}
          align="space-between"
          margin="0 8 5 8">
          <Column margin="9 0 0 0">
            <Text
              testID="generatedOnTitle"
              weight="regular"
              size="smaller"
              color={
                !verifiableCredential
                  ? Theme.Colors.LoadingDetailsLabel
                  : Theme.Colors.DetailsLabel
              }>
              {t('generatedOn')}
            </Text>
            <Text
              testID="generatedOnValue"
              weight="semibold"
              style={
                !verifiableCredential
                  ? Theme.Styles.loadingTitle
                  : Theme.Styles.subtitle
              }>
              {props.generatedOn}
            </Text>
          </Column>
          <Column margin="0 35 0 0">
            {verifiableCredential
              ? getDetails(t('status'), isvalid, verifiableCredential)
              : null}
          </Column>
          <Column
            testID="logo"
            style={{
              display: verifiableCredential ? 'flex' : 'none',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {getIssuerLogo(
              props.vcMetadata.isFromOpenId4VCI(),
              props.verifiableCredential?.issuerLogo,
            )}
          </Column>
        </Row>
      </Column>
    </ImageBackground>
  );
};

interface ExistingMosipVCItemContentProps {
  context: any;
  verifiableCredential: VerifiableCredential;
  generatedOn: string;
  selectable: boolean;
  selected: boolean;
  iconName?: string;
  iconType?: string;
  service: any;
  onPress?: () => void;
}

export interface EsignetMosipVCItemContentProps {
  context: any;
  credential: VerifiableCredential;
  generatedOn: string;
  selectable: boolean;
  selected: boolean;
  iconName?: string;
  iconType?: string;
  service: any;
  onPress?: () => void;
}
