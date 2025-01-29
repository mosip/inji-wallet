import React from 'react';
import {useState, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  ImageBackground,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import {Modal} from 'react-native';
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
import Share from 'react-native-share';
import {SvgUri} from 'react-native-svg'; // Import SvgUri for SVG images
import RNFS from 'react-native-fs';

const getProfileImage = (face: any) => {
  if (face) {
    return (
      <Image source={{uri: face}} style={Theme.Styles.detailedViewImage} />
    );
  }
  return (
    <ProfileIcon
      profileIconContainerStyles={Theme.Styles.openCardProfileIconContainer}
      profileIconSize={60}
    />
  );
};

export const VCDetailView: React.FC<VCItemDetailsProps> = props => {
  const {t} = useTranslation('VcDetails');
  const logo = props.verifiableCredentialData.issuerLogo;
  const verifiableCredential = props.credential;
  const publicUrl = props.credential?.credentialSubject['public_verify_url'];
  const qrCodeData = props.credential?.credentialSubject['qr_code'];
  const verifiablePresentation = '/assets/ID.png';
  const linkedinUrl =
    'https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(data.certificate_name)}&organizationId=${data.org_linkedin_code}&issueYear=${issued_year}&issueMonth=${issued_month}&certUrl=${encodeURIComponent(data.public_verify_url)}&certId=${data.credential_id}';
  const whatsappUrl = 'https://whatsapp.com';
  const [isModalVisible, setModalVisible] = useState(false);
  const [isQRCodeModalVisible, setQRCodeModalVisible] = useState(false);
  const addtolinkedin =
    'https://www.linkedin.com/profile/add/?startTask=CERTIFICATION_NAME&name=Marriage%20Certificate%20&organizationName=None&issueYear=2024&issueMonth=12&certUrl=https%3A//app.credissuer.com/credentials/verify/f011ff0a9eba94b0a235b6121c31aa407996a957f62f3737d534fd6e2261c04d&certId=F46189BC29D1';
  const postonlinkedin =
    'https://www.linkedin.com/feed/?shareActive=true&mini=true&shareUrl=https%3A%2F%2Fconnect.mosip.io&text=Hey+I%E2%80%99m+at+MOSIP+Connect+from+11th+to+13th+March%2C+2025.+Let%E2%80%99s+connect%21%0A%0AKnow+more+about+it+here+-+https%3A%2F%2Fconnect.mosip.io%0A%0A%23MOSIPConnect+%23OpenSource+%23DigitalIdentity+%23IdentityForAll';
  const shareonx =
    'https://x.com/intent/tweet?text=Crossing+another+milestone+on+my+professional+journey%21+%F0%9F%8F%85+My+credential+from+is+now+live+and+verified+on+Verix.%0A%0ASee+it+here%3A+https%3A%2F%2Fwww.verix.io%2Fcredential%2Fd66c224e-c216-468e-a3b6-9d693a44913f.%0A%0A%23VerixVerification';
  const [isImageExpanded, setIsImageExpanded] = useState(false); // State for expanded image
  const face = props.credential?.credentialSubject.face;
  const name = props.credential?.credentialSubject.recipientName;

  const handleImagePress = () => {
    setIsImageExpanded(!isImageExpanded); // Toggle the expanded state
  };

  const handleSaveAndShare = async () => {
    try {
      const fileName = `qr_code_image.${
        qrCodeData.endsWith('.svg') ? 'svg' : 'png'
      }`;
      const filePath = `${RNFS.ExternalDirectoryPath}/${fileName}`;

      // Save the file (SVG or PNG)
      if (qrCodeData.endsWith('.svg')) {
        // For SVG, you need to save the raw SVG data
        await RNFS.writeFile(filePath, qrCodeData, 'utf8');
      } else {
        // For PNG or other images, download and save the image
        const downloadResult = await RNFS.downloadFile({
          fromUrl: qrCodeData,
          toFile: filePath,
        }).promise;

        if (downloadResult.statusCode === 200) {
          console.log('File saved successfully');
        }
      }

      // Share the saved image
      const shareOptions = {
        title: 'Share QR Code Image',
        url: `file://${filePath}`,
        type: qrCodeData.endsWith('.svg') ? 'image/svg+xml' : 'image/png',
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error saving and sharing QR Code:', error);
    }
  };

  // Render QR Code (SVG or PNG)
  const renderQRCode = (qrCodeData: string) => {
    if (qrCodeData.endsWith('.svg')) {
      // If SVG, render using SvgUri
      return (
        <SvgUri
          uri={qrCodeData}
          width="250"
          height="250"
          style={{borderRadius: 10}}
        />
      );
    } else {
      // If PNG or another format, render using Image
      return (
        <Image
          source={{uri: qrCodeData}}
          style={{width: 250, height: 250, borderRadius: 10}}
        />
      );
    }
  };

  console.log('>>>>>>>>>>>>>>>>>>>>>>>QRCODE>>>>>>>>>>>>>>>>>>>>>', qrCodeData);
  console.log(
    '>>>>>>>>>>>>>>>>>>>>>>>publicUrl>>>>>>>>>>>>>>>>>>>>>',
    publicUrl,
  );

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
                  source={require('../../../assets/view.png')}
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
                  <TouchableOpacity onPress={handleImagePress}>
                    {getProfileImage(face)}
                  </TouchableOpacity>

                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Modal
                      animationType="fade"
                      transparent={true}
                      visible={isImageExpanded}
                      onRequestClose={() => setIsImageExpanded(false)}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.2)', // Dark overlay
                        }}>
                        <TouchableOpacity
                          style={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            zIndex: 1,
                          }}
                          onPress={() => setIsImageExpanded(false)} // Close modal
                        >
                          <Image
                            source={require('../../../assets/close.png')}
                            style={{width: 50, height: 50}}
                          />
                        </TouchableOpacity>
                        {name && (
                          <Text
                            style={{
                              marginTop: 20,
                              fontSize: 18,
                              color: '#fff',
                              fontWeight: 'bold',
                            }}>
                            {name}
                          </Text>
                        )}

                        {face ? (
                          <Image
                            source={{uri: face}}
                            style={{
                              width: 300,
                              height: 300,
                              borderRadius: 10,
                              resizeMode: 'contain',
                            }}
                          />
                        ) : (
                          <ProfileIcon
                            profileIconContainerStyles={
                              Theme.Styles.openCardProfileIconContainer
                            }
                            profileIconSize={100}
                          />
                        )}
                      </View>
                    </Modal>
                  </View>

                  <View style={{height: 20}} />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {/* Button to show QR Code Modal */}
                    <TouchableOpacity
                      onPress={() => setQRCodeModalVisible(true)}>
                      <Image
                        source={{uri: qrCodeData}} // Replace with your image path
                        style={{
                          width: 90, // Adjust the width of the image
                          height: 90, // Adjust the height of the image
                          borderRadius: 10,
                        }}
                      />
                      <View
                        testID="magnifierZoom"
                        style={[Theme.QrCodeStyles.magnifierZoom]}>
                        {SvgImage.MagnifierZoom()}
                      </View>
                    </TouchableOpacity>

                    {/* QR Code Modal */}
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={isQRCodeModalVisible}
                      onRequestClose={() => setQRCodeModalVisible(false)}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                        }}>
                        <View
                          style={{
                            width: 250,
                            padding: 20,
                            backgroundColor: 'white',
                            borderRadius: 10,
                            alignItems: 'center',
                          }}>
                          {/* Close Button */}
                          <TouchableOpacity
                            onPress={() => setQRCodeModalVisible(false)}
                            style={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                            }}>
                            <Image
                              source={require('../../../assets/close.png')}
                              style={{
                                width: 26,
                                height: 26,
                                tintColor: null, // Ensure no tint color is applied
                              }}
                            />
                          </TouchableOpacity>

                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: 'bold',
                              color: 'black',
                              marginBottom: 5, // Add some space between the text and the line
                              marginRight: 10,
                            }}>
                            QR Code
                          </Text>
                          {/* Horizontal Line */}
                          <View
                            style={{
                              height: 0.5,
                              backgroundColor: 'black',
                              width: '100%',
                            }}
                          />
                          <Image
                            source={{uri: qrCodeData}} // This can be a local image or a URL
                            style={{
                              width: 250, // Adjust the size of the image
                              height: 250, // Adjust the size of the image
                              borderRadius: 10, // Optional: Rounded corners
                            }}
                          />

                          <TouchableOpacity
                            onPress={handleSaveAndShare}
                            style={{marginTop: 20}}>
                            <View
                              style={{
                                backgroundColor: '#2A2DA4',
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{color: 'white', fontWeight: 'bold'}}>
                                Share
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  </View>

                  <Column
                    width={80}
                    height={100}
                    crossAlign="center"
                    margin="12 0 0 0"
                    style={{justifyContent: 'space-between'}}>
                    {console.log('Logo Object:', logo)}
                    {console.log('Logo URL:', logo?.url)}
                    {console.log('Logo Alt Text:', logo?.alt_text)}
                    {console.log('Issuer Logo Style:', Theme.Styles.issuerLogo)}
                    {console.log('Image Resize Method:', 'scale')}
                    {console.log('Image Resize Mode:', 'contain')}

                    <Image
                      src={logo?.url}
                      alt={logo?.alt_text}
                      style={[Theme.Styles.issuerLogo, {marginTop: 10}]} // Added marginTop for spacing
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
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                      <Image
                        source={require('../../../assets/share.png')} // replace with your actual image path
                        style={{width: 30, height: 30}} // adjust size as needed
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    {/* Modal for pop-up */}
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={isModalVisible}
                      onRequestClose={() => setModalVisible(false)}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'flex-end', // Align the modal at the bottom
                          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                        }}>
                        <View
                          style={{
                            width: '100%',
                            padding: 20,
                            backgroundColor: 'white',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={{
                              position: 'absolute',
                              top: 10,
                              right: 20,
                              borderRadius: 20, // Rounded corners for a button-like appearance
                              padding: 10, // Adds padding around the image
                              alignItems: 'center', // Centers the image inside the button
                              justifyContent: 'center', // Centers the image vertically inside the button
                            }}>
                            <Image
                              source={require('../../../assets/close.png')} // Replace with your image path
                              style={{
                                width: 26, // Adjust the width of the image
                                height: 26, // Adjust the height of the image
                              }}
                            />
                          </TouchableOpacity>

                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: 'bold',
                              color: 'black',
                              marginBottom: 25,
                              marginRight: 200, // Space below title
                              marginTop: 15,
                            }}>
                            Share Options
                          </Text>

                          {/* Horizontal Line */}
                          <View
                            style={{
                              height: 0.2,
                              backgroundColor: '#D3D3D3', // Light gray color for the line
                              marginBottom: 20,
                              width: '100%',
                            }}
                          />
                          {/* Add on linkedin */}
                          <TouchableOpacity
                            onPress={() =>
                              console.log('Redirecting to LinkedIn')
                            }>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 20,
                              }}>
                              <Image
                                source={require('../../../assets/linkedIn.png')} // Replace with your LinkedIn image path
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 10, // Adds space between image and text
                                }}
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  if (addtolinkedin) {
                                    Linking.openURL(addtolinkedin);
                                  }
                                }}>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginRight: 200,
                                  }}>
                                  Add to LinkedIn
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </TouchableOpacity>

                          {/* Horizontal Line */}
                          <View
                            style={{
                              height: 0.5,
                              backgroundColor: '#D3D3D3', // Light gray color for the line
                              marginBottom: 20,
                              width: '100%',
                            }}
                          />

                          {/* post on linkedin */}
                          <TouchableOpacity
                            onPress={() =>
                              console.log('Redirecting to linkedin')
                            }>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 20,
                              }}>
                              <Image
                                source={require('../../../assets/linkedIn.png')} // Replace with your Twitter/X image path
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginBottom: 5,
                                  marginRight: 10,
                                }}
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  if (postonlinkedin) {
                                    Linking.openURL(postonlinkedin);
                                  }
                                }}>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginRight: 200,
                                  }}>
                                  Post on LinkedIn
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </TouchableOpacity>
                          {/* Horizontal Line */}
                          <View
                            style={{
                              height: 0.5,
                              backgroundColor: '#D3D3D3', // Light gray color for the line
                              marginBottom: 20,
                              width: '100%',
                            }}
                          />

                          {/* X Redirect */}
                          <TouchableOpacity
                            onPress={() => console.log('Redirecting to X')}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Image
                                source={require('../../../assets/twitter.png')} // Replace with your Twitter/X image path
                                style={{
                                  width: 30,
                                  height: 30,
                                  marginBottom: 5,
                                  marginRight: 10,
                                }}
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  if (shareonx) {
                                    Linking.openURL(shareonx);
                                  }
                                }}>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    marginRight: 230,
                                  }}>
                                  Share on X
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  </View>
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
