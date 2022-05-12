import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { VC, CredentialSubject } from '../types/vc';
import { Column, Row, Text } from './ui';
import { Colors } from './ui/styleUtils';
import { TextItem } from './ui/TextItem';

const VerifiedIcon: React.FC = () => {
  return (
    <Icon
      name="check-circle"
      color={Colors.Green}
      size={14}
      containerStyle={{ marginStart: 4, bottom: 1 }}
    />
  );
};

export const VcDetails: React.FC<VcDetailsProps> = (props) => {
  const { t } = useTranslation('VcDetails');

  return (
    <Column>
      <Row padding="16 24">
        <Column fill elevation={1} padding="12 16" margin="0 16 0 0">
          <Text size="smaller" color={Colors.Grey}>
            {t('generatedOn')}
          </Text>
          <Text weight="bold" size="smaller">
            {new Date(props.vc?.generatedOn).toLocaleDateString()}
          </Text>
        </Column>
        <Column fill elevation={1} padding="12 16" margin="0 16 0 0">
          <Text
            size="smaller"
            color={Colors.Grey}
            style={{ textTransform: 'uppercase' }}>
            {props.vc?.idType}
          </Text>
          <Text weight="bold" size="smaller">
            {props.vc?.id}
          </Text>
        </Column>
        <Column fill elevation={1} padding="12 16">
          <Text size="smaller" color={Colors.Grey}>
            {t('status')}
          </Text>
          <Row>
            <Text weight="bold" size="smaller">
              {t('valid')}
            </Text>
            {props.vc?.isVerified && <VerifiedIcon />}
          </Row>
        </Column>
      </Row>

      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Subtitle>{t('photo')}</ListItem.Subtitle>
          <ListItem.Content>
            <Image
              source={
                props.vc?.credential.biometrics?.face
                  ? { uri: props.vc?.credential.biometrics.face }
                  : require('../assets/placeholder-photo.png')
              }
              style={{
                width: 110,
                height: 110,
                resizeMode: 'cover',
                marginTop: 8,
              }}
            />
          </ListItem.Content>
        </ListItem.Content>
      </ListItem>

      <TextItem
        divider
        label={t('fullName')}
        text={props.vc?.verifiableCredential.credentialSubject.fullName}
      />

      <TextItem
        divider
        label={t('gender')}
        text={getLocalizedField(
          props.vc?.verifiableCredential.credentialSubject.gender
        )}
      />

      <TextItem
        divider
        label={t('dateOfBirth')}
        text={props.vc?.verifiableCredential.credentialSubject.dateOfBirth}
      />

      <TextItem
        divider
        label={t('phoneNumber')}
        text={props.vc?.verifiableCredential.credentialSubject.phone}
      />

      <TextItem
        divider
        label={t('email')}
        text={props.vc?.verifiableCredential.credentialSubject.email}
      />

      <TextItem
        divider
        label={t('address')}
        text={getFullAddress(props.vc?.verifiableCredential.credentialSubject)}
      />

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
            // locale: DateFnsLocale[i18n.language],
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
  try {
    const locales: LocalizedField[] =
      typeof rawField === 'string' ? JSON.parse(rawField) : rawField;
    return locales.find((locale) => locale.language === 'eng').value.trim();
  } catch (e) {
    return '';
  }
}
