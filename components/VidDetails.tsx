import React from 'react';
import { Image } from 'react-native';
import { ListItem } from 'react-native-elements';
import { VID, VIDCredential } from '../types/vid';
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
            {props.vid?.uin}
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
                source={{ uri: props.vid?.credential.biometrics.face }}
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
          <ListItem.Title>{props.vid?.credential.fullName}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Subtitle>Gender</ListItem.Subtitle>
          <ListItem.Title>
            {getLocalizedField(props.vid?.credential.gender)}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Subtitle>Date of birth</ListItem.Subtitle>
          <ListItem.Title>{props.vid?.credential.dateOfBirth}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Subtitle>Phone number</ListItem.Subtitle>
          <ListItem.Title>{props.vid?.credential.phone}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Subtitle>Email</ListItem.Subtitle>
          <ListItem.Title>{props.vid?.credential.email}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Subtitle>Address</ListItem.Subtitle>
          <ListItem.Title>
            {getFullAddress(props.vid?.credential)}
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
  vid: VID;
}

interface LocalizedField {
  language: string;
  value: string;
}

function getFullAddress(credential: VIDCredential) {
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
  return (
    fields.map((field) => getLocalizedField(credential[field])).join(', ') +
    ', ' +
    credential.postalCode
  );
}

function getLocalizedField(rawField: string) {
  try {
    const locales: LocalizedField[] = JSON.parse(rawField);
    // TODO: language switching
    return locales.find((locale) => locale.language === 'eng').value;
  } catch (e) {
    return '';
  }
}
