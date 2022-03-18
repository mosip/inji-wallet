import React from 'react';
import { Image } from 'react-native';
import { ListItem } from 'react-native-elements';
import { VC, CredentialSubject } from '../types/vc';
import { Column, Row, Text } from './ui';
import { Colors } from './ui/styleUtils';

export const VidDetails: React.FC<VidDetailsProps> = (props) => {
  return (
    <Column>
      <Row padding="16 24">
        <Column fill elevation={1} padding="12 16" margin="0 16 0 0">
          <Text size="smaller" color={Colors.Grey}>
            Generated
          </Text>
          <Text weight="bold" size="smaller">
            {new Date(props.vid?.generatedOn).toLocaleDateString()}
          </Text>
        </Column>
        <Column fill elevation={1} padding="12 16" margin="0 16 0 0">
          <Text size="smaller" color={Colors.Grey}>
            UIN
          </Text>
          <Text weight="bold" size="smaller">
            {props.vid?.id}
          </Text>
        </Column>
        <Column fill elevation={1} padding="12 16" margin="">
          <Text size="smaller" color={Colors.Grey}>
            Status
          </Text>
          <Text weight="bold" size="smaller">
            Valid
          </Text>
        </Column>
      </Row>
      {props.vid?.credential.biometrics && (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Subtitle>Photo</ListItem.Subtitle>
            <ListItem.Content>
              <Image 
                source = { props.vid?.credential.biometrics?.face ?  { uri: props.vid?.credential.biometrics.face } : require('../assets/placeholder-photo.png')} 
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
      )}
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Subtitle>Full name</ListItem.Subtitle>
          <ListItem.Title>
            {props.vid?.verifiableCredential.credentialSubject.fullName}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Subtitle>Gender</ListItem.Subtitle>
          <ListItem.Title>
            {getLocalizedField(
              props.vid?.verifiableCredential.credentialSubject.gender
            )}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Subtitle>Date of birth</ListItem.Subtitle>
          <ListItem.Title>
            {props.vid?.verifiableCredential.credentialSubject.dateOfBirth}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Subtitle>Phone number</ListItem.Subtitle>
          <ListItem.Title>
            {props.vid?.verifiableCredential.credentialSubject.phone}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Subtitle>Email</ListItem.Subtitle>
          <ListItem.Title>
            {props.vid?.verifiableCredential.credentialSubject.email}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Subtitle>Address</ListItem.Subtitle>
          <ListItem.Title>
            {getFullAddress(props.vid?.verifiableCredential.credentialSubject)}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      {Boolean(props.vid?.reason) && (
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Subtitle>Reason for sharing</ListItem.Subtitle>
            <ListItem.Title>{props.vid?.reason}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      )}
    </Column>
  );
};

interface VidDetailsProps {
  vid: VC;
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
  ];
  return fields
    .map((field) => getLocalizedField(credential[field]))
    .concat(credential.postalCode)
    .filter(Boolean)
    .join(', ');
}

function getLocalizedField(rawField: string) {
  try {
    const locales: LocalizedField[] = JSON.parse(rawField);
    // TODO: language switching
    return locales.find((locale) => locale.language === 'eng').value.trim();
  } catch (e) {
    return '';
  }
}
