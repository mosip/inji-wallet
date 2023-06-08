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
              color={Theme.Colors.DetailsLabel}>
              {t('idType')}
            </Text>
            <Text weight="bold" size="smaller" color={Theme.Colors.Details}>
              {t('nationalCard')}
            </Text>
          </Column>
          <View style={Theme.Styles.mosipLogoContainer}>
            <Image source={Theme.MosipLogo} style={Theme.Styles.logo} />
          </View>
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
                color={Theme.Colors.DetailsLabel}>
                {t('fullName')}
              </Text>
              <Text
                weight="semibold"
                size="smaller"
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
                  color={Theme.Colors.Details}>
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
                  weight="bold"
                  size="smaller"
                  color={Theme.Colors.DetailsLabel}>
                  {t('credentialRegistry')}
                </Text>
                <Text
                  weight="semibold"
                  size="smaller"
                  color={Theme.Colors.Details}>
                  {props.vc?.credentialRegistry}
                </Text>
              </Column>
            )}
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
                style={{ flex: 1 }}
                weight="semibold"
                size="small"
                margin={'0 0 5 0'}
                color={Theme.Colors.statusLabel}>
                {t('offlineAuthDisabledHeader')}
              </Text>
            </Row>
            <Text
              style={{ flex: 1 }}
              weight="regular"
              size="small"
              margin={'0 0 5 0'}
              color={Theme.Colors.statusLabel}>
              {t('offlineAuthDisabledMessage')}
            </Text>

            <Button
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
