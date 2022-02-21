import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { Image } from 'react-native';
import { ListItem } from 'react-native-elements';
import { VID, VIDCredential } from '../types/vid';
import { Column, Row, Text } from './ui';
import { Colors } from './ui/styleUtils';
import { TextItem } from './ui/TextItem';

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
            <ListItem.Subtitle>
              <Text>Photo</Text>
            </ListItem.Subtitle>
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
      <TextItem
        divider
        label="Full name"
        text={props.vid?.credential.fullName}
      />
      <TextItem divider label="Gender" text={props.vid?.credential.gender} />
      <TextItem
        divider
        label="Date of birth"
        text={props.vid?.credential.dateOfBirth}
      />
      <TextItem
        divider
        label="Phone number"
        text={props.vid?.credential.phone}
      />
      <TextItem divider label="Email" text={props.vid?.credential.email} />
      <TextItem
        divider
        label="Address"
        text={getFullAddress(props.vid?.credential)}
      />
      {props.vid?.reason?.length > 0 && (
        <Text margin="24 24 16 24" weight="semibold">
          Reason(s) for sharing
        </Text>
      )}
      {props.vid?.reason?.map((reason, index) => {
        <TextItem
          key={index}
          divider
          label={formatDistanceToNow(reason.timestamp, { addSuffix: true })}
          text={reason.message}
        />;
      })}
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
