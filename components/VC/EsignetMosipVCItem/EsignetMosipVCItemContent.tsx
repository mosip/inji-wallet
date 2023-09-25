import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, ImageBackground} from 'react-native';
import {CheckBox, Icon} from 'react-native-elements';
import {Column, Row, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import VerifiedIcon from '../../VerifiedIcon';
import {getLocalizedField} from '../../../i18n';
import {
  Credential,
  VerifiableCredential,
} from '../../../types/VC/EsignetMosipVC/vc';
import testIDProps from '../../../shared/commonUtil';

const getDetails = (arg1: string, arg2: string, credential: Credential) => {
  if (arg1 === 'Status') {
    return (
      <Column>
        <Text
          testID="status"
          weight="bold"
          size="smaller"
          color={
            !credential
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
          {!credential ? null : <VerifiedIcon />}
          <Text
            testID="valid"
            numLines={1}
            color={Theme.Colors.Details}
            weight="semibold"
            size="smaller"
            style={
              !credential
                ? Theme.Styles.loadingTitle
                : Theme.Styles.detailsValue
            }>
            {!credential ? '' : arg2}
          </Text>
        </Row>
      </Column>
    );
  } else {
    return (
      <Column>
        <Text
          color={
            !credential
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
            !credential ? Theme.Styles.loadingTitle : Theme.Styles.subtitle
          }>
          {!credential ? '' : arg2}
        </Text>
      </Column>
    );
  }
};

function getIdNumber(id: string) {
  if (id) {
    return '*'.repeat(id.length - 4) + id.slice(-4);
  }
}

export const EsignetMosipVCItemContent: React.FC<
  EsignetMosipVCItemContentProps
> = props => {
  //Assigning the UIN and VID from the VC details to display the idtype label
  const vid = props.credential?.credential?.credentialSubject.VID;
  const fullName = !props.credential?.credential
    ? ''
    : getLocalizedField(
        props.credential?.credential.credentialSubject.fullName,
      );
  const {t} = useTranslation('VcDetails');
  const isvalid = !props.credential?.credential ? '' : t('valid');
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
      source={!props.credential?.credential ? null : Theme.CloseCard}
      resizeMode="stretch"
      style={
        !props.credential?.credential
          ? Theme.Styles.vertloadingContainer
          : Theme.Styles.backgroundImageContainer
      }>
      <Column>
        <Row align="space-between">
          <Row margin="5 0 0 5">
            <ImageBackground
              imageStyle={Theme.Styles.faceImage}
              source={
                !props.credential?.credential
                  ? Theme.ProfileIcon
                  : {uri: props.credential.credential.credentialSubject.face}
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
                    !props.credential?.credential
                      ? Theme.Colors.LoadingDetailsLabel
                      : Theme.Colors.DetailsLabel
                  }>
                  {t('fullName')}
                </Text>
                <Text
                  testID="fullNameValue"
                  weight="semibold"
                  style={
                    !props.credential?.credential
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
                    !props.credential?.credential
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
                    !props.credential?.credential
                      ? Theme.Styles.loadingTitle
                      : Theme.Styles.detailsValue
                  }>
                  {t('nationalCard')}
                </Text>
              </Column>
            </Column>
          </Row>

          <Column>
            {props.credential?.credential ? selectableOrCheck : null}
          </Column>
        </Row>

        <Row
          align="space-between"
          margin="9 10 0 7"
          style={
            !props.credential?.credential ? Theme.Styles.loadingContainer : null
          }>
          <Column>
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
            {!props.credential?.credential
              ? getDetails(t('id'), vid, props.credential?.credential)
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
                !props.credential?.credential
                  ? Theme.Colors.LoadingDetailsLabel
                  : Theme.Colors.DetailsLabel
              }>
              {t('generatedOn')}
            </Text>
            <Text
              testID="generatedOnValue"
              weight="semibold"
              style={
                !props.credential?.credential
                  ? Theme.Styles.loadingTitle
                  : Theme.Styles.subtitle
              }>
              {props.generatedOn}
            </Text>
          </Column>
          <Column margin="0 35 0 0">
            {props.credential?.credential
              ? getDetails(t('status'), isvalid, props.credential?.credential)
              : null}
          </Column>
          <Column
            testID="logo"
            style={{
              display: props.credential?.credential ? 'flex' : 'none',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              src={props.credential?.issuerLogo}
              style={Theme.Styles.issuerLogo}
              resizeMethod="scale"
              resizeMode="contain"
            />
          </Column>
        </Row>
      </Column>
    </ImageBackground>
  );
};

interface EsignetMosipVCItemContentProps {
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
