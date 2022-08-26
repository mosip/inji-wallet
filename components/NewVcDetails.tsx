import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import * as DateFnsLocale from '../lib/date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { VC, CredentialSubject } from '../types/vc';
import { Column, Row, Text } from './ui';
import { Theme } from './ui/styleUtils';
import { TextItem } from './ui/TextItem';
import { useReceiveVcModal } from '../screens/Request/ReceiveVcModalController';

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

export const NewVcDetails: React.FC<VcDetailsProps> = (props) => {
  const { t, i18n } = useTranslation('VcDetails');
  const controller = useReceiveVcModal();

  return (
    <ImageBackground
      style={{
        width: '100%',
        height: '100%',
      }}
      source={Theme.OpenCard}>
      <Row style={Theme.Styles.successTag}>
        <Icon
          name="check-circle"
          color={Theme.Colors.checkCircleIcon}
          size={40}
        />
        <Text margin="0 10" color={Theme.Colors.whiteText}>
          {controller.vcLabel.singular} Received
        </Text>
      </Row>

      <Column>
        <Column style={Theme.Styles.closeDetailsHeader}>
          <Column>
            <Text
              weight="bold"
              size="smaller"
              color={Theme.Colors.DetailsLabel}>
              {t('fullName')}
            </Text>
            <Text weight="bold" size="smaller" color={Theme.Colors.Details}>
              {getLocalizedField(
                props.vc?.verifiableCredential.credentialSubject.fullName
              )}
            </Text>
          </Column>
          <Image source={Theme.MosipLogo} style={Theme.Styles.logo} />
        </Column>

        <Row style={Theme.Styles.openDetailsContainer}>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Subtitle>{t('photo')}</ListItem.Subtitle>
              <ListItem.Content>
                <Image
                  source={
                    props.vc?.credential.biometrics?.face
                      ? { uri: props.vc?.credential.biometrics.face }
                      : Theme.ProfileIcon
                  }
                  style={Theme.Styles.openCardImage}
                />
              </ListItem.Content>
            </ListItem.Content>
          </ListItem>

          <Column style={Theme.Styles.details}>
            <Column style={Theme.Styles.labelPart}>
              <Column
                fill
                padding="12 16"
                margin="0 16 0 0"
                style={Theme.Styles.labelPart}>
                <Text
                  size="smaller"
                  color={Theme.Colors.DetailsLabel}
                  style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {props.vc?.idType}
                </Text>
                <Text
                  weight="semibold"
                  size="smaller"
                  color={Theme.Colors.Details}>
                  {props.vc?.id}
                </Text>
              </Column>
              <Column
                fill
                padding="12 16"
                margin="0 16 0 0"
                style={Theme.Styles.labelPart}>
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
              <Column fill padding="12 16" style={Theme.Styles.labelPart}>
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
                    color={Theme.Colors.Details}>
                    {t('valid')}
                  </Text>
                  {props.vc?.isVerified && <VerifiedIcon />}
                </Row>
              </Column>
            </Column>

            <Column
              fill
              padding="12 16"
              margin="0 16 0 0"
              style={Theme.Styles.labelPart}>
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

            <Column
              fill
              padding="12 16"
              margin="0 16 0 0"
              style={Theme.Styles.labelPart}>
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

            <Column
              fill
              padding="12 16"
              margin="0 16 0 0"
              style={Theme.Styles.labelPart}>
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

            <Column
              fill
              padding="12 16"
              margin="0 16 0 0"
              style={Theme.Styles.labelPart}>
              <Text
                weight="bold"
                size="smaller"
                color={Theme.Colors.DetailsLabel}>
                {t('email')}
              </Text>
              <Text
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {getLocalizedField(
                  props.vc?.verifiableCredential.credentialSubject.email
                )}
              </Text>
            </Column>

            <Column
              fill
              padding="12 16"
              margin="0 16 0 0"
              style={Theme.Styles.labelPart}>
              <Text
                weight="bold"
                size="smaller"
                color={Theme.Colors.DetailsLabel}>
                {t('address')}
              </Text>
              <Text
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {getFullAddress(
                  props.vc?.verifiableCredential.credentialSubject
                )}
              </Text>
            </Column>

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
        </Row>
      </Column>
    </ImageBackground>
  );
};

interface VcDetailsProps {
  vc: VC;
}

interface LocalizedField {
  language: string;
  value: string;
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
