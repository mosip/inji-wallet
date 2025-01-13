import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  Credential,
  CredentialWrapper,
  VerifiableCredential,
  VerifiableCredentialData,
  WalletBindingResponse,
} from '../../../machines/VerifiableCredential/VCMetaMachine/vc';
import {Button, Column, Row, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
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
  const face = props.credential?.credentialSubject.face;
  const verifiableCredential = props.credential;
  const publicUrl = props.credential?.credentialSubject['public_verify_url'];
  const qrCodeData = props.credential?.credentialSubject['qr_Code'];
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
            <View
              style={{
                position: 'absolute',
                top: 30,
                left: '90%',
                transform: [{translateX: -20}],
                zIndex: 1,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (publicUrl) {
                    Linking.openURL(publicUrl);
                  }
                }}>
                <Image
                  source={require('../../../assets/share.png')}
                  style={{width: 40, height: 40}}
                  resizeMethod="scale"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
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
                  {qrCodeData ? (
                    <View style={{marginTop: 10}}>
                      <QRCode
                        value={qrCodeData}
                        size={60} // Adjust size as needed
                        backgroundColor="white"
                        color="black"
                      />
                    </View>
                  ) : null}
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
                  style={{flex: 1}}
                  ref={ref => {
                    console.log('Column ref:', ref); // Log ref of Column
                  }}>
                  {console.log('Props fields:', props.fields)}
                  {console.log('Verifiable Credential:', verifiableCredential)}
                  {console.log('Well-known props:', props.wellknown)}
                  {console.log('Props object:', props)}
                  {fieldItemIterator(
                    props.fields,
                    verifiableCredential,
                    props.wellknown,
                    props,
                  )}
                </Column>
              </Row>
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
                  {shouldShowHrLine(verifiableCredential) &&
                    fieldItemIterator(
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
            </ImageBackground>
          </Column>
        </Column>
      </Column>
    </>
  );
};
export interface VCItemDetailsProps {
  fields: any[];
  wellknown: any;
  credential: VerifiableCredential | Credential;
  verifiableCredentialData: VerifiableCredentialData;
  walletBindingResponse?: WalletBindingResponse;
  credentialWrapper: CredentialWrapper;
  onBinding?: () => void;
  activeTab?: Number;
  vcHasImage: boolean;
  keyType: string;
}
