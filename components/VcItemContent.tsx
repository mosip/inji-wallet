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

export const VcItemContent: React.FC<VcItemContentProps> = ({
  context,
  verifiableCredential,
  generatedOn,
  tag,
}) => {
  //Assigning the UIN and VID from the VC details to display the idtype label
  const uin = verifiableCredential?.credentialSubject.UIN;
  const vid = verifiableCredential?.credentialSubject.VID;
  const fullName = !verifiableCredential
    ? ''
    : getLocalizedField(verifiableCredential.credentialSubject.fullName);
  const { t } = useTranslation('VcDetails');

  return (
    <ImageBackground
      source={!verifiableCredential ? null : Theme.CloseCard}
      resizeMode="stretch"
      borderRadius={4}
      style={
        !verifiableCredential
          ? Theme.Styles.vertloadingContainer
          : Theme.Styles.backgroundImageContainer
      }>
      <Row
        style={
          !verifiableCredential
            ? Theme.Styles.loadingCardDetailsHeader
            : Theme.Styles.cardDetailsHeader
        }>
        <Column>
          <Text
            color={
              !verifiableCredential
                ? Theme.Colors.LoadingDetailsLabel
                : Theme.Colors.DetailsLabel
            }
            weight="bold"
            size="smaller">
            {t('idType')}
          </Text>
          <Text
            weight="bold"
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
        <View style={Theme.Styles.mosipLogoContainer}>
          <Image
            source={Theme.MosipLogo}
            style={Theme.Styles.logo}
            resizeMethod="auto"
          />
        </View>
      </Row>
      <Row
        crossAlign="center"
        margin="5 0 0 0"
        style={
          !verifiableCredential
            ? Theme.Styles.loadingCardDetailsContainer
            : Theme.Styles.cardDetailsContainer
        }>
        <Column
          style={
            !verifiableCredential
              ? Theme.Styles.loadingContainer
              : Theme.Styles.closeDetails
          }>
          <Image
            source={
              !verifiableCredential
                ? Theme.ProfileIcon
                : {
                    uri: context.credential.biometrics.face,
                  }
            }
            style={Theme.Styles.closeCardImage}
          />

          <Column
            margin="0 0 0 25"
            style={{
              alignItems: 'flex-start',
            }}>
            {getDetails(t('fullName'), fullName, verifiableCredential)}
            {!verifiableCredential
              ? getDetails(t('id'), uin || vid, verifiableCredential)
              : null}
            {uin ? getDetails(t('uin'), uin, verifiableCredential) : null}
            {vid ? getDetails(t('vid'), vid, verifiableCredential) : null}
            {getDetails(t('generatedOn'), generatedOn, verifiableCredential)}
            {getDetails(t('status'), t('valid'), verifiableCredential)}
          </Column>
        </Column>

        {!verifiableCredential && (
          <RotatingIcon name="sync" color={Theme.Colors.rotatingIcon} />
        )}
      </Row>
      <VcItemTags tag={tag} />
    </ImageBackground>
  );
};

interface VcItemContentProps {
  context: any;
  verifiableCredential: VerifiableCredential;
  generatedOn: string;
  tag: string;
}
