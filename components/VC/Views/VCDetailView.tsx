import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, ImageBackground, NativeModules, View} from 'react-native';
import {
  Credential,
  CredentialWrapper,
  VerifiableCredential,
  VerifiableCredentialData,
  WalletBindingResponse,
} from '../../../machines/VerifiableCredential/VCMetaMachine/vc';
import {Button, Column, Row, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import {QrCodeOverlay} from '../../QrCodeOverlay';
import {SvgImage} from '../../ui/svg';
import {isActivationNeeded} from '../../../shared/openId4VCI/Utils';
import {
  BOTTOM_SECTION_FIELDS_WITH_DETAILED_ADDRESS_FIELDS,
  DETAIL_VIEW_BOTTOM_SECTION_FIELDS,
  KEY_TYPE_FIELD,
  fieldItemIterator,
  getBackgroundColour,
  getBackgroundImage,
  getTextColor,
} from '../common/VCUtils';
import {ProfileIcon} from '../../ProfileIcon';
import {VCFormat} from '../../../shared/VCFormat';
import {VCItemField} from '../common/VCItemField';

const getProfileImage = (face: any) => {
  if (face) {
    return (
      <Image source={{uri: face}} style={Theme.Styles.detailedViewImage} />
    );
  }
  return (
    <ProfileIcon
      profileIconContainerStyles={Theme.Styles.openCardProfileIconContainer}
      profileIconSize={40}
    />
  );
};

export const VCDetailView: React.FC<VCItemDetailsProps> = props => {
  const {t} = useTranslation('VcDetails');
  const logo = props.verifiableCredentialData.issuerLogo;
  const face = props.verifiableCredentialData.face;
  //TODO: give whole crdentialWrapper as props
  const verifiableCredential = props.credential;

  const shouldShowHrLine = verifiableCredential => {
    let availableFieldNames: string[] = [];
    if (props.verifiableCredentialData.vcMetadata.format === VCFormat.ldp_vc) {
      availableFieldNames = Object.keys(
        verifiableCredential?.credentialSubject,
      );
    } else if (
      props.verifiableCredentialData.vcMetadata.format === VCFormat.mso_mdoc
    ) {
      const namespaces = verifiableCredential['issuerSigned']['nameSpaces'];
      Object.keys(namespaces).forEach(namespace => {
        (namespaces[namespace] as Array<Object>).forEach(element => {
          availableFieldNames.push(
            `${namespace}~${element['elementIdentifier']}`,
          );
        });
      });
    }
    for (const fieldName of availableFieldNames) {
      if (
        BOTTOM_SECTION_FIELDS_WITH_DETAILED_ADDRESS_FIELDS.includes(fieldName)
      ) {
        return true;
      }
    }

    return false;
  };

  return (
    <>
      <Column scroll>
        <Column fill>
          <Column
            padding="10 10 3 10"
            backgroundColor={Theme.Colors.DetailedViewBackground}>
            <ImageBackground
              imageStyle={Theme.Styles.vcDetailBg}
              resizeMethod="scale"
              resizeMode="stretch"
              style={[
                Theme.Styles.openCardBgContainer,
                getBackgroundColour(props.wellknown),
              ]}
              source={getBackgroundImage(props.wellknown, Theme.OpenCard)}>
              <Row padding="14 14 0 14" margin="0 0 0 0">
                <Column crossAlign="center">
                  {getProfileImage(face)}
                  <QrCodeOverlay
                    verifiableCredential={props.credentialWrapper as unknown as VerifiableCredential}
                    meta={props.verifiableCredentialData.vcMetadata}
                  />
                  <Column
                    width={80}
                    height={59}
                    crossAlign="center"
                    margin="12 0 0 0">
                    <Image
                      src={logo?.url}
                      alt={logo?.alt_text}
                      style={Theme.Styles.issuerLogo}
                      resizeMethod="scale"
                      resizeMode="contain"
                    />
                  </Column>
                </Column>
                <Column
                  align="space-evenly"
                  margin={'0 0 0 24'}
                  style={{flex: 1}}>
                  {fieldItemIterator(
                    props.fields,
                    verifiableCredential,
                    props.wellknown,
                    props,
                  )}
                </Column>
              </Row>
              {shouldShowHrLine(verifiableCredential) && (
                <>
                  <View
                    style={[
                      Theme.Styles.hrLine,
                      {
                        borderBottomColor: getTextColor(
                          props.wellknown,
                          Theme.Styles.hrLine.borderBottomColor,
                        ),
                      },
                    ]}></View>
                  <Column padding="0 14 14 14">
                    {/* TODO: verifiableCredential to hold parsed JSON data */}
                    {fieldItemIterator(
                      DETAIL_VIEW_BOTTOM_SECTION_FIELDS,
                      verifiableCredential,
                      props.wellknown,
                      props,
                    )}
                    <VCItemField
                      key={'keyTypeVcDetailView'}
                      fieldName={KEY_TYPE_FIELD}
                      fieldValue={props.keyType}
                      verifiableCredential={verifiableCredential}
                      testID={'keyTypeVcDetailView'}
                    />
                  </Column>
                </>
              )}
            </ImageBackground>
          </Column>
        </Column>
      </Column>
      {props.vcHasImage && (
        <View
          style={{
            position: 'relative',
            backgroundColor: Theme.Colors.DetailedViewBackground,
          }}>
          {props.activeTab !== 1 &&
            (!props.walletBindingResponse &&
            isActivationNeeded(props.verifiableCredentialData?.issuer) ? (
              <Column
                padding="10"
                style={Theme.Styles.detailedViewActivationPopupContainer}>
                <Row>
                  <Column crossAlign="flex-start" margin={'2 0 0 10'}>
                    {SvgImage.WalletUnActivatedLargeIcon()}
                  </Column>
                  <Column crossAlign="flex-start" margin={'5 18 13 8'}>
                    <Text
                      testID="offlineAuthDisabledHeader"
                      style={{
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 14,
                      }}
                      color={Theme.Colors.statusLabel}
                      margin={'0 18 0 0'}>
                      {t('offlineAuthDisabledHeader')}
                    </Text>
                    <Text
                      testID="offlineAuthDisabledMessage"
                      style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 12,
                      }}
                      color={Theme.Colors.statusMessage}
                      margin={'0 18 0 0'}>
                      {t('offlineAuthDisabledMessage')}
                    </Text>
                  </Column>
                </Row>

                <Button
                  testID="enableVerification"
                  title={t('enableVerification')}
                  onPress={props.onBinding}
                  type="gradient"
                  size="Large"
                  disabled={
                    !props.verifiableCredentialData.vcMetadata.isVerified
                  }
                />
              </Column>
            ) : (
              <Column
                style={Theme.Styles.detailedViewActivationPopupContainer}
                padding="10">
                <Row>
                  <Column crossAlign="flex-start" margin={'2 0 0 10'}>
                    {SvgImage.WalletActivatedLargeIcon()}
                  </Column>
                  <Column crossAlign="flex-start" margin={'5 18 13 8'}>
                    <Text
                      testID="profileAuthenticated"
                      color={Theme.Colors.statusLabel}
                      style={{
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 14,
                      }}
                      margin={'0 18 0 0'}>
                      {isActivationNeeded(
                        props.verifiableCredentialData?.issuer,
                      )
                        ? t('profileAuthenticated')
                        : t('credentialActivated')}
                    </Text>
                  </Column>
                </Row>
              </Column>
            ))}
        </View>
      )}
    </>
  );
};

export interface VCItemDetailsProps {
  fields: any[];
  wellknown: any;
  credential: VerifiableCredential | Credential;
  verifiableCredentialData: VerifiableCredentialData;
  walletBindingResponse?: WalletBindingResponse;
  credentialWrapper?: CredentialWrapper;
  onBinding?: () => void;
  activeTab?: Number;
  vcHasImage: boolean;
  keyType: string;
}
