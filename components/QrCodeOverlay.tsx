import React, {useEffect, useRef, useState} from 'react';
import {Image, Pressable, View} from 'react-native';
import {Icon, Overlay} from 'react-native-elements';
import {Centered, Column, Row, Text, Button} from './ui';
import {Theme} from './ui/styleUtils';
import {useTranslation} from 'react-i18next';
import testIDProps from '../shared/commonUtil';
import {SvgImage} from './ui/svg';
import {NativeModules} from 'react-native';
import {VerifiableCredential} from '../machines/VerifiableCredential/VCMetaMachine/vc';
import {MAX_QR_DATA_LENGTH} from '../shared/constants';
import {VCMetadata} from '../shared/VCMetadata';
import {shareImageToAllSupportedApps} from '../shared/sharing/imageUtils';
import {ShareOptions} from 'react-native-share';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

export const QrCodeOverlay: React.FC<QrCodeOverlayProps> = props => {
  const {RNPixelpassModule} = NativeModules;
  const {t} = useTranslation('VcDetails');
  const [qrString, setQrString] = useState('');
  const base64ImageType = 'data:image/png;base64,';
  const {RNSecureKeystoreModule} = NativeModules;

  async function getQRData(): Promise<string> {
    let qrData: string;
    try {
      const keyData = await RNSecureKeystoreModule.getData(props.meta.id);
      if (keyData[1] && keyData.length > 0) {
        qrData = keyData[1];
      } else {
        throw new Error('No key data found');
      }
    } catch {
      const {credential} = props.verifiableCredential;
      qrData = await RNPixelpassModule.generateQRCodeWithinLimit(
        MAX_QR_DATA_LENGTH,
        JSON.stringify(credential),
        '',
      );
      await RNSecureKeystoreModule.storeData(props.meta.id, qrData);
    }
    return qrData;
  }

  function handleShareQRCodePress() {
    shareImage(qrString);
  }

  async function shareImage(base64String: string) {
    const options: ShareOptions = {
      url: base64String,
    };
    const shareStatus = await shareImageToAllSupportedApps(options);
    if (!shareStatus) {
      console.error('Error while sharing QR code::');
    }
  }

  useEffect(() => {
    (async () => {
      const qrData = await getQRData();
      setQrString(base64ImageType + qrData);
    })();
  }, []);
  const [isQrOverlayVisible, setIsQrOverlayVisible] = useState(false);

  const toggleQrOverlay = () => setIsQrOverlayVisible(!isQrOverlayVisible);
  return (
    <React.Fragment>
      <View testID="qrCodeView" style={Theme.QrCodeStyles.QrView}>
        {qrString != '' ? (
          <Pressable
            {...testIDProps('qrCodePressable')}
            accessible={false}
            onPress={toggleQrOverlay}>
            <Image
              testID="qrCode"
              source={{uri: qrString}}
              style={{width: 72, height: 72}}
            />
            <View
              testID="magnifierZoom"
              style={[Theme.QrCodeStyles.magnifierZoom]}>
              {SvgImage.MagnifierZoom()}
            </View>
          </Pressable>
        ) : (
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            width={72}
            height={72}
            style={{borderRadius: 5, marginTop: 5}}
          />
        )}
      </View>

      <Overlay
        isVisible={isQrOverlayVisible}
        onBackdropPress={toggleQrOverlay}
        overlayStyle={{padding: 1, borderRadius: 21}}>
        <Column style={Theme.QrCodeStyles.expandedQrCode}>
          <Row pY={20} style={Theme.QrCodeStyles.QrCodeHeader}>
            <Text
              testID="qrCodeHeader"
              align="center"
              style={Theme.TextStyles.header}
              weight="bold">
              {t('qrCodeHeader')}
            </Text>
            <Icon
              {...testIDProps('qrCodeCloseIcon')}
              name="close"
              onPress={toggleQrOverlay}
              color={Theme.Colors.Details}
              size={32}
            />
          </Row>
          <Centered testID="qrCodeDetails" pY={30}>
            <Image
              testID="qrCodeExpandedView"
              source={{uri: qrString}}
              style={{width: 300, height: 300}}
            />
            <Button
              testID="share"
              styles={Theme.QrCodeStyles.shareQrCodeButton}
              title={t('shareQRCode')}
              type="gradient"
              icon={
                <Icon
                  name="share-variant-outline"
                  type="material-community"
                  size={24}
                  color="white"
                />
              }
              onPress={handleShareQRCodePress}
            />
          </Centered>
        </Column>
      </Overlay>
    </React.Fragment>
  );
};

interface QrCodeOverlayProps {
  verifiableCredential: VerifiableCredential;
  meta: VCMetadata;
}
