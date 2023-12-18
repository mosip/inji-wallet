import {format, formatDistanceToNow, parse} from 'date-fns';
import React from 'react';
import * as DateFnsLocale from 'date-fns/locale';
import {useTranslation} from 'react-i18next';
import {Dimensions, Image, ImageBackground, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {CredentialSubject, VC} from '../../../types/VC/ExistingMosipVC/vc';
import {Button, Column, Row, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import {TextItem} from '../../ui/TextItem';
import VerifiedIcon from '../../VerifiedIcon';
import {getLocalizedField} from '../../../i18n';
import {CREDENTIAL_REGISTRY_EDIT} from 'react-native-dotenv';
import {QrCodeOverlay} from '../../QrCodeOverlay';
import {VCMetadata} from '../../../shared/VCMetadata';
import {
  VcIdType,
  VCSharingReason,
  VerifiableCredential,
  VerifiablePresentation,
} from '../../../types/VC/EsignetMosipVC/vc';
import {WalletBindingResponse} from '../../../shared/cryptoutil/cryptoUtil';
import {logoType} from '../../../machines/issuersMachine';
import {SvgImage} from '../../ui/svg';

const getIssuerLogo = (isOpenId4VCI: boolean, issuerLogo: logoType) => {
  if (isOpenId4VCI) {
    return (
      <Image
        src={issuerLogo?.url}
        alt={issuerLogo?.alt_text}
        style={Theme.Styles.issuerLogo}
      />
    );
  }
  return SvgImage.MosipLogo(Theme.Styles.vcDetailsLogo);
};

const getProfileImage = (
  props: ExistingMosipVCItemDetailsProps | EsignetMosipVCItemDetailsProps,
  verifiableCredential,
  isOpenId4VCI,
) => {
  if (isOpenId4VCI) {
    if (verifiableCredential?.credentialSubject.face) {
      return {uri: verifiableCredential?.credentialSubject.face};
    }
  } else {
    if (props.vc?.credential?.biometrics?.face) {
      return {uri: props.vc?.credential.biometrics.face};
    }
  }
  return Theme.cardFaceIcon;
};

export const MosipVCItemDetails: React.FC<
  ExistingMosipVCItemDetailsProps | EsignetMosipVCItemDetailsProps
> = props => {
  const {t, i18n} = useTranslation('VcDetails');

  let isOpenId4VCI = VCMetadata.fromVC(props.vc.vcMetadata).isFromOpenId4VCI();
  const issuerLogo = getIssuerLogo(
    isOpenId4VCI,
    props.vc?.verifiableCredential?.issuerLogo,
  );
  const verifiableCredential = isOpenId4VCI
    ? props.vc?.verifiableCredential.credential
    : props.vc?.verifiableCredential;

  //Assigning the UIN and VID from the VC details to display the idtype label
  const uin = verifiableCredential?.credentialSubject.UIN;
  const vid = verifiableCredential?.credentialSubject.VID;

  if (verifiableCredential == null) {
    return <Text align="center">Loading details...</Text>;
  }

  return (
    <Column margin="10 4 10 4">
      <ImageBackground
        imageStyle={{width: '100%'}}
        resizeMethod="scale"
        resizeMode="stretch"
        style={Theme.Styles.openCardBgContainer}
        source={Theme.OpenCard}>
        <Row align="space-between" padding="10" margin="0 10 0 8">
          <Column align="space-evenly" crossAlign="center">
            <Image
              source={getProfileImage(
                props,
                verifiableCredential,
                isOpenId4VCI,
              )}
              style={Theme.Styles.openCardImage}
            />

            <QrCodeOverlay qrCodeDetails={String(verifiableCredential)} />

            <Column margin="20 0 0 0">{issuerLogo}</Column>
          </Column>
          <Column align="space-evenly" padding="10">
            <Column>
              <Text
                testID="fullNameTitle"
                weight="regular"
                size="smaller"
                color={Theme.Colors.DetailsLabel}>
                {t('fullName')}
              </Text>
              <Text
                testID="fullNameValue"
                weight="semibold"
                style={{maxWidth: 190}}
                size="smaller"
                color={Theme.Colors.Details}>
                {getLocalizedField(
                  verifiableCredential?.credentialSubject.fullName,
                )}
              </Text>
            </Column>
            <Row>
              <Column>
                <Column margin="20 0 0 0">
                  <Text
                    testID="gender"
                    weight="regular"
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
                      verifiableCredential?.credentialSubject.gender,
                    )}
                  </Text>
                </Column>
                <Column margin="25 0 0 0">
                  <Text
                    testID="idType"
                    weight="regular"
                    size="smaller"
                    color={Theme.Colors.DetailsLabel}>
                    {t('idType')}
                  </Text>
                  <Text
                    testID="nationalCard"
                    weight="bold"
                    style={{minWidth: 65}}
                    size="smaller"
                    color={Theme.Colors.Details}>
                    {t('nationalCard')}
                  </Text>
                </Column>
                {uin ? (
                  <Column margin="25 0 0 0">
                    <Text
                      testID="uin"
                      weight="regular"
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
                  <Column margin="25 0 0 0">
                    <Text
                      testID="vid"
                      weight="regular"
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
                <Column margin="30 0 0 0">
                  <Text
                    testID="generatedOnTitle"
                    weight="regular"
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
              </Column>
              <Column margin="0 0 0 38">
                <Column margin="20 0 0 0">
                  <Text
                    testID="dateOfBirth"
                    style={{maxWidth: 121}}
                    weight="regular"
                    size="smaller"
                    color={Theme.Colors.DetailsLabel}>
                    {t('dateOfBirth')}
                  </Text>
                  <Text
                    testID="dateOfBirthValue"
                    weight="semibold"
                    size="smaller"
                    color={Theme.Colors.Details}>
                    {formattedDateOfBirth()}
                  </Text>
                </Column>
                <Column
                  style={{marginTop: Dimensions.get('window').height * 0.04}}>
                  <Text
                    testID="status"
                    weight="regular"
                    size="smaller"
                    color={Theme.Colors.DetailsLabel}>
                    {t('status')}
                  </Text>
                  <Row
                    style={{
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    {props.vc?.isVerified && <VerifiedIcon />}
                    <Text
                      testID="valid"
                      style={{maxWidth: 63}}
                      weight="semibold"
                      size="smaller"
                      color={Theme.Colors.Details}>
                      {t('valid')}
                    </Text>
                  </Row>
                </Column>
                <Column
                  style={{marginTop: Dimensions.get('window').height * 0.1}}>
                  <Text
                    testID="phoneNumber"
                    style={{maxWidth: 80}}
                    weight="regular"
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
                      verifiableCredential?.credentialSubject.phone,
                    )}
                  </Text>
                </Column>
              </Column>
            </Row>
          </Column>
        </Row>
        <View style={Theme.Styles.hrLine}></View>
        <Column padding="10">
          <Column fill style={Theme.Styles.labelPart}>
            <Text
              testID="emailId"
              weight="regular"
              size="smaller"
              color={Theme.Colors.DetailsLabel}>
              {t('email')}
            </Text>
            <Row>
              <Text
                testID="emailIdValue"
                style={
                  verifiableCredential?.credentialSubject.email.length > 25
                    ? {flex: 1}
                    : {flex: 0}
                }
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {getLocalizedField(
                  verifiableCredential?.credentialSubject.email,
                )}
              </Text>
            </Row>
          </Column>

          <Column style={Theme.Styles.labelPart}>
            <Text
              testID="address"
              weight="regular"
              size="smaller"
              color={Theme.Colors.DetailsLabel}>
              {t('address')}
            </Text>
            <Row>
              <Text
                testID="addressValue"
                style={{flex: 1}}
                weight="semibold"
                size="smaller"
                color={Theme.Colors.Details}>
                {getFullAddress(verifiableCredential?.credentialSubject)}
              </Text>
            </Row>
          </Column>
          {CREDENTIAL_REGISTRY_EDIT === 'true' && (
            <Column fill style={Theme.Styles.labelPart}>
              <Text
                testID="credentialRegistry"
                weight="regular"
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
          <Column style={Theme.Styles.openCardBgContainer} padding="10">
            <Column margin={'0 0 4 0'} crossAlign={'flex-start'}>
              <Icon
                name="shield-alert"
                color={Theme.Colors.Icon}
                size={Theme.ICON_LARGE_SIZE}
                type="material-community"
                containerStyle={{
                  marginEnd: 5,
                  bottom: 1,
                }}
              />
              <Text
                testID="offlineAuthDisabledHeader"
                style={{flex: 1}}
                weight="semibold"
                size="small"
                margin={'5 0 0 0'}
                color={Theme.Colors.statusLabel}>
                {t('offlineAuthDisabledHeader')}
              </Text>
            </Column>
            <Text
              testID="offlineAuthDisabledMessage"
              style={{flex: 1, lineHeight: 17}}
              weight="regular"
              size="small"
              margin={'3 0 0 0'}
              color={Theme.Colors.statusMessage}>
              {t('offlineAuthDisabledMessage')}
            </Text>

            <Button
              testID="enableVerification"
              title={t('enableVerification')}
              onPress={props.onBinding}
              type="gradient"
              styles={{width: '100%'}}
            />
          </Column>
        ) : (
          <Column style={Theme.Styles.openCardBgContainer} padding="10">
            <Row crossAlign="center">
              <Icon
                name="verified-user"
                color={Theme.Colors.VerifiedIcon}
                size={28}
                containerStyle={{marginStart: 4, bottom: 1}}
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

  function formattedDateOfBirth() {
    const dateOfBirth = verifiableCredential?.credentialSubject.dateOfBirth;
    const formatString =
      dateOfBirth.split('/').length === 1 ? 'yyyy' : 'yyyy/MM/dd';

    const parsedDate = parse(dateOfBirth, formatString, new Date());

    return format(parsedDate, 'MM/dd/yyyy');
  }
};

export interface ExistingMosipVCItemDetailsProps {
  vc: VC;
  isBindingPending: boolean;
  onBinding?: () => void;
  activeTab?: Number;
}

export interface EsignetMosipVCItemDetailsProps {
  vc: EsignetVC;
  isBindingPending: boolean;
  onBinding?: () => void;
  activeTab?: number;
}

export interface EsignetVC {
  id: string;
  idType: VcIdType;
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
