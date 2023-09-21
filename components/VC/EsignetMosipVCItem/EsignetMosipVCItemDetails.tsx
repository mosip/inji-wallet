import React from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Column, Row, Text} from '../../ui';
import {Image, ImageBackground, View} from 'react-native';
import {Theme} from '../../ui/styleUtils';
import {QrCodeOverlay} from '../../QrCodeOverlay';
import {getLocalizedField} from '../../../i18n';
import VerifiedIcon from '../../VerifiedIcon';
import {CREDENTIAL_REGISTRY_EDIT} from 'react-native-dotenv';
import {TextItem} from '../../ui/TextItem';
import {format, formatDistanceToNow, parse} from 'date-fns';
import DateFnsLocale from 'date-fns/locale';
import {Icon} from 'react-native-elements';
import {WalletBindingResponse} from '../../../shared/cryptoutil/cryptoUtil';
import {
  CredentialSubject,
  VCSharingReason,
  VcIdType,
  VerifiableCredential,
  VerifiablePresentation,
} from './vc';

export const EsignetMosipVCItemDetails: React.FC<
  EsignetMosipVCItemDetailsProps
> = props => {
  const {t, i18n} = useTranslation('VcDetails');

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
                props.vc?.verifiableCredential.credential.credentialSubject
                  ?.face
                  ? {
                      uri: props.vc?.verifiableCredential.credential
                        .credentialSubject.face,
                    }
                  : Theme.ProfileIcon
              }
              style={Theme.Styles.openCardImage}
            />

            <QrCodeOverlay
              qrCodeDetailes={String(props.vc.verifiableCredential)}
            />
            <Column margin="20 0 0 0">
              <Image source={Theme.MosipLogo} style={Theme.Styles.logo} />
            </Column>
          </Column>
          <Column align="space-evenly">
            <Column>
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
                  props.vc?.verifiableCredential.credential.credentialSubject
                    .fullName,
                )}
              </Text>
            </Column>
            <Row>
              <Column>
                <Column>
                  <Text
                    weight="bold"
                    size="smaller"
                    color={Theme.Colors.DetailsLabel}>
                    {t('idType')}
                  </Text>
                  <Text
                    weight="bold"
                    size="smaller"
                    color={Theme.Colors.Details}>
                    {t('nationalCard')}
                  </Text>
                </Column>
                {props.vc?.verifiableCredential.credential.id ? (
                  <Column margin="20 0 0 0">
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
                      {props.vc?.verifiableCredential.credential.id}
                    </Text>
                  </Column>
                ) : null}
                <Column margin="20 0 0 0">
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
                    {format(
                      parse(
                        getLocalizedField(
                          props.vc?.verifiableCredential.credential
                            .credentialSubject.dateOfBirth,
                        ),
                        'yyyy/MM/dd',
                        new Date(),
                      ),
                      'yyy/MM/dd',
                    )}
                  </Text>
                </Column>
              </Column>
              <Column margin="0 0 0 40">
                <Column>
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
                      props.vc?.verifiableCredential.credential
                        .credentialSubject.gender,
                    )}
                  </Text>
                </Column>
                <Column margin="20 0 0 0">
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
                <Column margin="20 0 0 0">
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
                <Column margin="20 0 0 0">
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
                      props.vc?.verifiableCredential.credential
                        .credentialSubject.phone,
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
              weight="bold"
              size="smaller"
              color={Theme.Colors.DetailsLabel}>
              {t('email')}
            </Text>
            <Row>
              <Text
                style={
                  props.vc?.verifiableCredential.credential.credentialSubject
                    .email.length > 25
                    ? {flex: 1}
                    : {flex: 0}
                }
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {getLocalizedField(
                  props.vc?.verifiableCredential.credential.credentialSubject
                    .email,
                )}
              </Text>
            </Row>
          </Column>

          <Column style={Theme.Styles.labelPart}>
            <Text
              weight="bold"
              size="smaller"
              color={Theme.Colors.DetailsLabel}>
              {t('address')}
            </Text>
            <Row>
              <Text
                style={{flex: 1}}
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {getFullAddress(
                  props.vc?.verifiableCredential.credential.credentialSubject,
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
                style={{flex: 1}}
                weight="semibold"
                size="small"
                margin={'0 0 5 0'}
                color={Theme.Colors.statusLabel}>
                {t('offlineAuthDisabledHeader')}
              </Text>
            </Row>
            <Text
              style={{flex: 1}}
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
                containerStyle={{marginStart: 4, bottom: 1}}
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

export interface EsignetMosipVCItemDetailsProps {
  vc: VC;
  isBindingPending: boolean;
  onBinding?: () => void;
  activeTab?: number;
}

export interface VC {
  id: string;
  idType: VcIdType;
  tag: string;
  verifiableCredential: VerifiableCredential;
  verifiablePresentation?: VerifiablePresentation;
  generatedOn: Date;
  requestId: string;
  isVerified: boolean;
  lastVerifiedOn: number;
  locked: boolean;
  reason?: VCSharingReason[];
  shouldVerifyPresence?: boolean;
  walletBindingResponse?: WalletBindingResponse;
  credentialRegistry: string;
  isPinned?: boolean;
  hashedId: string;
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
    .map(field => getLocalizedField(credential[field]))
    .concat(credential.postalCode)
    .filter(Boolean)
    .join(', ');
}
