import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import * as DateFnsLocale from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { VC, CredentialSubject } from '../types/vc';
import { Button, Column, Row, Text } from './ui';
import { Theme } from './ui/styleUtils';
import { TextItem } from './ui/TextItem';
import { VcItemTags } from './VcItemTags';
import VerifiedIcon from './VerifiedIcon';
import { getLocalizedField } from '../i18n';
import { CREDENTIAL_REGISTRY_EDIT } from 'react-native-dotenv';
import { QrCodeOverlay } from './QrCodeOverlay';

export const VcDetails: React.FC<VcDetailsProps> = (props) => {
  const { t, i18n } = useTranslation('VcDetails');

  //Assigning the UIN and VID from the VC details to display the idtype label
  const uin = props.vc?.verifiableCredential.credentialSubject.UIN;
  const vid = props.vc?.verifiableCredential.credentialSubject.VID;

  if (props.vc?.verifiableCredential == null) {
    return <Text align="center">Loading details...</Text>;
  }

  return (
    <Column margin="10">
      <ImageBackground
        borderRadius={10}
        style={Theme.Styles.openCardBgContainer}
        source={Theme.OpenCard}>
        <Row align="space-between">
          <Column align="space-evenly" crossAlign="center">
            <Image
              source={
                props.vc?.credential.biometrics?.face
                  ? { uri: props.vc?.credential.biometrics.face }
                  : Theme.ProfileIcon
              }
              style={Theme.Styles.openCardImage}
            />

            <QrCodeOverlay qrCodeDetailes={String(props.vc.credential)} />
            <Column margin="20 0 0 0">
              <Image source={Theme.MosipLogo} style={Theme.Styles.logo} />
            </Column>
          </Column>
          <Column align="space-evenly">
            <Column>
              <Text
                testID="fullNameTitle"
                weight="bold"
                size="smaller"
                color={Theme.Colors.DetailsLabel}>
                {t('fullName')}
              </Text>
              <Text
                testID="fullNameValue"
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {getLocalizedField(
                  props.vc?.verifiableCredential.credentialSubject.fullName
                )}
              </Text>
            </Column>
            <Row>
              <Column>
                <Column>
                  <Text
                    testID="idType"
                    weight="bold"
                    size="smaller"
                    color={Theme.Colors.DetailsLabel}>
                    {t('idType')}
                  </Text>
                  <Text
                    testID="nationalCard"
                    weight="bold"
                    size="smaller"
                    color={Theme.Colors.Details}>
                    {t('nationalCard')}
                  </Text>
                </Column>
                {uin ? (
                  <Column margin="20 0 0 0">
                    <Text
                      testID="uin"
                      weight="bold"
                      size="smaller"
                      color={Theme.Colors.DetailsLabel}>
                      {t('uin')}
                    </Text>
                    <Text
                      testID="uinNumber"
                      weight="semibold"
                      size="smaller"
                      color={Theme.Colors.Details}>
                      {uin}
                    </Text>
                  </Column>
                ) : null}

                {vid ? (
                  <Column margin="20 0 0 0">
                    <Text
                      testID="vid"
                      weight="bold"
                      size="smaller"
                      color={Theme.Colors.DetailsLabel}>
                      {t('vid')}
                    </Text>
                    <Text
                      testID="vidNumber"
                      weight="semibold"
                      size="smaller"
                      color={Theme.Colors.Details}>
                      {vid}
                    </Text>
                  </Column>
                ) : null}
                <Column margin="20 0 0 0">
                  <Text
                    testID="dateOfBirth"
                    weight="bold"
                    size="smaller"
                    color={Theme.Colors.DetailsLabel}>
                    {t('dateOfBirth')}
                  </Text>
                  <Text
                    testID="dateOfBirthValue"
                    weight="semibold"
                    size="smaller"
                    color={Theme.Colors.Details}>
                    {new Date(
                      getLocalizedField(
                        props.vc?.verifiableCredential.credentialSubject
                          .dateOfBirth
                      )
                    ).toLocaleDateString()}
                  </Text>
                </Column>
              </Column>
              <Column margin="0 0 0 40">
                <Column>
                  <Text
                    testID="gender"
                    weight="bold"
                    size="smaller"
                    color={Theme.Colors.DetailsLabel}>
                    {t('gender')}
                  </Text>
                  <Text
                    testID="genderValue"
                    weight="semibold"
                    size="smaller"
                    color={Theme.Colors.Details}>
                    {getLocalizedField(
                      props.vc?.verifiableCredential.credentialSubject.gender
                    )}
                  </Text>
                </Column>
                <Column margin="20 0 0 0">
                  <Text
                    testID="generatedOnTitle"
                    weight="bold"
                    size="smaller"
                    color={Theme.Colors.DetailsLabel}>
                    {t('generatedOn')}
                  </Text>
                  <Text
                    testID="generatedOnValue"
                    weight="semibold"
                    size="smaller"
                    color={Theme.Colors.Details}>
                    {new Date(props.vc?.generatedOn).toLocaleDateString()}
                  </Text>
                </Column>
                <Column margin="20 0 0 0">
                  <Text
                    testID="status"
                    weight="bold"
                    size="smaller"
                    color={Theme.Colors.DetailsLabel}>
                    {t('status')}
                  </Text>
                  <Row>
                    <Text
                      testID="valid"
                      weight="semibold"
                      size="smaller"
                      color={Theme.Colors.Details}>
                      {t('valid')}
                    </Text>
                    {props.vc?.isVerified && <VerifiedIcon />}
                  </Row>
                </Column>
                <Column margin="20 0 0 0">
                  <Text
                    testID="phoneNumber"
                    weight="bold"
                    size="smaller"
                    color={Theme.Colors.DetailsLabel}>
                    {t('phoneNumber')}
                  </Text>
                  <Text
                    testID="phoneNumberValue"
                    weight="semibold"
                    size="smaller"
                    color={Theme.Colors.Details}>
                    {getLocalizedField(
                      props.vc?.verifiableCredential.credentialSubject.phone
                    )}
                  </Text>
                </Column>
              </Column>
            </Row>
          </Column>
        </Row>
        <View style={Theme.Styles.hrLine}></View>
        <Column>
          <Column fill style={Theme.Styles.labelPart}>
            <Text
              testID="emailId"
              weight="bold"
              size="smaller"
              color={Theme.Colors.DetailsLabel}>
              {t('email')}
            </Text>
            <Row>
              <Text
                testID="emailIdValue"
                style={
                  props.vc?.verifiableCredential.credentialSubject.email
                    .length > 25
                    ? { flex: 1 }
                    : { flex: 0 }
                }
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {getLocalizedField(
                  props.vc?.verifiableCredential.credentialSubject.email
                )}
              </Text>
            </Row>
          </Column>

          <Column style={Theme.Styles.labelPart}>
            <Text
              testID="address"
              weight="bold"
              size="smaller"
              color={Theme.Colors.DetailsLabel}>
              {t('address')}
            </Text>
            <Row>
              <Text
                testID="addressValue"
                style={{ flex: 1 }}
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {getFullAddress(
                  props.vc?.verifiableCredential.credentialSubject
                )}
              </Text>
            </Row>
          </Column>
          {CREDENTIAL_REGISTRY_EDIT === 'true' && (
            <Column fill style={Theme.Styles.labelPart}>
              <Text
                testID="credentialRegistry"
                weight="bold"
                size="smaller"
                color={Theme.Colors.DetailsLabel}>
                {t('credentialRegistry')}
              </Text>
              <Text
                testID="credentialRegistryValue"
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {props.vc?.credentialRegistry}
              </Text>
            </Column>
          )}
        </Column>
        <VcItemTags tag={props.vc?.tag} />
      </ImageBackground>

      {props.vc?.reason?.length > 0 && (
        <Text
          testID="reasonForSharingTitle"
          margin="24 24 16 24"
          weight="semibold">
          {t('reasonForSharing')}
        </Text>
      )}

      {props.vc?.reason?.map((reason, index) => (
        <TextItem
          testID="reason"
          key={index}
          divider
          label={formatDistanceToNow(reason.timestamp, {
            addSuffix: true,
            locale: DateFnsLocale[i18n.language],
          })}
          text={reason.message}
        />
      ))}

      {props.activeTab !== 1 ? (
        props.isBindingPending ? (
          <Column style={Theme.Styles.openCardBgContainer}>
            <Row margin={'0 0 5 0'} crossAlign={'center'}>
              <Icon
                name="shield-alert"
                color={Theme.Colors.Icon}
                size={30}
                type="material-community"
              />
              <Text
                testID="offlineAuthDisabledHeader"
                style={{ flex: 1 }}
                weight="semibold"
                size="small"
                margin={'0 0 5 0'}
                color={Theme.Colors.statusLabel}>
                {t('offlineAuthDisabledHeader')}
              </Text>
            </Row>
            <Text
              testID="offlineAuthDisabledMessage"
              style={{ flex: 1 }}
              weight="regular"
              size="small"
              margin={'0 0 5 0'}
              color={Theme.Colors.statusLabel}>
              {t('offlineAuthDisabledMessage')}
            </Text>

            <Button
              testID="enableVerification"
              title={t('enableVerification')}
              onPress={props.onBinding}
              type="radius"
            />
          </Column>
        ) : (
          <Column style={Theme.Styles.openCardBgContainer}>
            <Row crossAlign="center">
              <Icon
                name="verified-user"
                color={Theme.Colors.VerifiedIcon}
                size={28}
                containerStyle={{ marginStart: 4, bottom: 1 }}
              />
              <Text
                testID="profileAuthenticated"
                numLines={1}
                color={Theme.Colors.statusLabel}
                weight="bold"
                size="smaller"
                margin="10 10 10 10"
                children={t('profileAuthenticated')}></Text>
            </Row>
          </Column>
        )
      ) : (
        <></>
      )}
    </Column>
  );
};

interface VcDetailsProps {
  vc: VC;
  isBindingPending: boolean;
  onBinding?: () => void;
  activeTab?: Number;
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
