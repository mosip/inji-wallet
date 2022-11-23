import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import * as DateFnsLocale from '../lib/date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground } from 'react-native';
import { Icon } from 'react-native-elements';
import { VC, CredentialSubject, LocalizedField } from '../types/vc';
import { Column, Row, Text } from './ui';
import { Theme } from './ui/styleUtils';
import { TextItem } from './ui/TextItem';
import { VcItemTags } from './VcItemTags';

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

export const VcDetails: React.FC<VcDetailsProps> = (props) => {
  const { t, i18n } = useTranslation('VcDetails');

  //Assigning the UIN and VID from the VC details to display the idtype label
  const uin = props.vc?.verifiableCredential.credentialSubject.UIN;
  const vid = props.vc?.verifiableCredential.credentialSubject.VID;

  if (props.vc?.verifiableCredential == null) {
    return <Text align="center">Loading details...</Text>;
  }

  return (
    <Column>
      <ImageBackground
        borderRadius={10}
        style={Theme.Styles.openCardBgContainer}
        source={Theme.OpenCard}>
        <Row style={Theme.Styles.openDetailsHeader}>
          <Column margin={'0 0 0 10'}>
            <Text
              weight="bold"
              size="smaller"
              color={Theme.Colors.DetailsLabel}
              align="left">
              {t('idType')}
            </Text>
            <Text weight="bold" size="smaller" color={Theme.Colors.Details}>
              {t('nationalCard')}
            </Text>
          </Column>
          <Image source={Theme.MosipLogo} style={Theme.Styles.logo} />
        </Row>

        <Row style={Theme.Styles.openDetailsContainer}>
          <Image
            source={
              props.vc?.credential.biometrics?.face
                ? { uri: props.vc?.credential.biometrics.face }
                : Theme.ProfileIcon
            }
            style={Theme.Styles.openCardImage}
          />

          <Column style={Theme.Styles.labelPartContainer}>
            <Column fill>
              <Text
                weight="bold"
                size="smaller"
                align="left"
                color={Theme.Colors.DetailsLabel}>
                {t('fullName')}
              </Text>
              <Text
                weight="semibold"
                size="smaller"
                align="left"
                color={Theme.Colors.Details}>
                {getLocalizedField(
                  props.vc?.verifiableCredential.credentialSubject.fullName
                )}
              </Text>
            </Column>

            {uin ? (
              <Column fill style={Theme.Styles.labelPart}>
                <Text
                  weight="bold"
                  size="smaller"
                  color={Theme.Colors.DetailsLabel}>
                  {t('uin')}
                </Text>
                <Text
                  weight="semibold"
                  size="smaller"
                  color={Theme.Colors.Details}>
                  {uin}
                </Text>
              </Column>
            ) : null}

            {vid ? (
              <Column fill style={Theme.Styles.labelPart}>
                <Text
                  weight="bold"
                  size="smaller"
                  color={Theme.Colors.DetailsLabel}>
                  {t('vid')}
                </Text>
                <Text
                  weight="semibold"
                  size="smaller"
                  color={Theme.Colors.Details}>
                  {vid}
                </Text>
              </Column>
            ) : null}

            <Column fill style={Theme.Styles.labelPart}>
              <Text
                weight="bold"
                size="smaller"
                color={Theme.Colors.DetailsLabel}>
                {t('generatedOn')}
              </Text>
              <Text
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {new Date(props.vc?.generatedOn).toLocaleDateString()}
              </Text>
            </Column>

            <Column fill style={Theme.Styles.labelPart}>
              <Text
                weight="bold"
                size="smaller"
                color={Theme.Colors.DetailsLabel}>
                {t('status')}
              </Text>
              <Row>
                <Text
                  weight="semibold"
                  size="smaller"
                  align="left"
                  color={Theme.Colors.Details}>
                  {t('valid')}
                </Text>
                {props.vc?.isVerified && <VerifiedIcon />}
              </Row>
            </Column>

            <Column fill style={Theme.Styles.labelPart}>
              <Text
                weight="bold"
                size="smaller"
                color={Theme.Colors.DetailsLabel}>
                {t('gender')}
              </Text>
              <Text
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {getLocalizedField(
                  props.vc?.verifiableCredential.credentialSubject.gender
                )}
              </Text>
            </Column>

            <Column fill style={Theme.Styles.labelPart}>
              <Text
                weight="bold"
                size="smaller"
                color={Theme.Colors.DetailsLabel}>
                {t('dateOfBirth')}
              </Text>
              <Text
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {new Date(
                  getLocalizedField(
                    props.vc?.verifiableCredential.credentialSubject.dateOfBirth
                  )
                ).toLocaleDateString()}
              </Text>
            </Column>

            <Column fill style={Theme.Styles.labelPart}>
              <Text
                weight="bold"
                size="smaller"
                color={Theme.Colors.DetailsLabel}>
                {t('phoneNumber')}
              </Text>
              <Text
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {getLocalizedField(
                  props.vc?.verifiableCredential.credentialSubject.phone
                )}
              </Text>
            </Column>

            <Column fill style={Theme.Styles.labelPart}>
              <Text
                weight="bold"
                size="smaller"
                color={Theme.Colors.DetailsLabel}>
                {t('email')}
              </Text>
              <Row>
                <Text
                  style={
                    props.vc?.verifiableCredential.credentialSubject.email
                      .length > 25
                      ? { flex: 1 }
                      : { flex: 0 }
                  }
                  weight="semibold"
                  size="smaller"
                  color={Theme.Colors.Details}
                  align="left">
                  {getLocalizedField(
                    props.vc?.verifiableCredential.credentialSubject.email
                  )}
                </Text>
              </Row>
            </Column>

            <Column fill style={Theme.Styles.labelPart}>
              <Text
                weight="bold"
                size="smaller"
                color={Theme.Colors.DetailsLabel}>
                {t('address')}
              </Text>
              <Row>
                <Text
                  style={{ flex: 1 }}
                  weight="semibold"
                  size="smaller"
                  color={Theme.Colors.Details}
                  align="left">
                  {getFullAddress(
                    props.vc?.verifiableCredential.credentialSubject
                  )}
                </Text>
              </Row>
            </Column>
          </Column>
        </Row>
        <VcItemTags tag={props.vc?.tag} />
      </ImageBackground>
      {props.vc?.reason?.length > 0 && (
        <Text margin="24 24 16 24" weight="semibold">
          {t('reasonForSharing')}
        </Text>
      )}
      {props.vc?.reason?.map((reason, index) => (
        <TextItem
          key={index}
          divider
          label={formatDistanceToNow(reason.timestamp, {
            addSuffix: true,
            locale: DateFnsLocale[i18n.language],
          })}
          text={reason.message}
        />
      ))}
    </Column>
  );
};

interface VcDetailsProps {
  vc: VC;
}

function getFullAddress(credential: CredentialSubject) {
  if (!credential) {
    return '';
  }

  const fields = [
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'city',
    'province',
    'region',
  ];

  return fields
    .map((field) => getLocalizedField(credential[field]))
    .concat(credential.postalCode)
    .filter(Boolean)
    .join(', ');
}

function getLocalizedField(rawField: string | LocalizedField[]) {
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
