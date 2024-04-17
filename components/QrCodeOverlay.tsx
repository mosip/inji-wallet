import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import {Icon, Overlay} from 'react-native-elements';
import {Centered, Column, Row, Text} from './ui';
import QRCode from 'react-native-qrcode-svg';
import {Theme} from './ui/styleUtils';
import {useTranslation} from 'react-i18next';
import testIDProps from '../shared/commonUtil';
import {SvgImage} from './ui/svg';
// @ts-ignore
import {generateQRData} from '@mosip/pixelpass';
import {VerifiableCredential} from '../machines/VerifiableCredential/VCMetaMachine/vc';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';
import {DEFAULT_ECL} from '../shared/constants';
import {VCMetadata} from '../shared/VCMetadata';

export const QrCodeOverlay: React.FC<QrCodeOverlayProps> = props => {
  const {t} = useTranslation('VcDetails');
  const [qrString, setQrString] = useState('');

  async function getQRData(): Promise<string> {
    let qrData: string;
    try {
      qrData = await RNSecureKeyStore.get(props.meta.id);
    } catch {
      let qrDataJSON = {
        verifiableCredential: props.verifiableCredential,
        meta: props.meta,
      };
      qrData = generateQRData(JSON.stringify(qrDataJSON));
      await RNSecureKeyStore.set(props.meta.id, qrData, {
        accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
      });
    }
    return qrData;
  }

  useEffect(() => {
    (async () => {
      const qrString = await getQRData();
      setQrString(qrString);
    })();
  }, [qrString]);
  const [isQrOverlayVisible, setIsQrOverlayVisible] = useState(false);
  const toggleQrOverlay = () => setIsQrOverlayVisible(!isQrOverlayVisible);
  return (
    qrString != '' && (
      <React.Fragment>
        <View testID="qrCodeView" style={Theme.QrCodeStyles.QrView}>
          <Pressable
            {...testIDProps('qrCodePressable')}
            accessible={false}
            onPress={toggleQrOverlay}>
            <QRCode
              {...testIDProps('qrCode')}
              size={72}
              value={qrString}
              backgroundColor={Theme.Colors.QRCodeBackgroundColor}
              ecl={DEFAULT_ECL}
            />
            <View
              testID="magnifierZoom"
              style={[Theme.QrCodeStyles.magnifierZoom]}>
              {SvgImage.MagnifierZoom()}
            </View>
          </Pressable>
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
              <QRCode
                {...testIDProps('qrCodeExpandedView')}
                size={300}
                value={qrString}
                backgroundColor={Theme.Colors.QRCodeBackgroundColor}
                ecl={DEFAULT_ECL}
              />
            </Centered>
          </Column>
        </Overlay>
      </React.Fragment>
    )
  );
};

interface QrCodeOverlayProps {
  verifiableCredential: VerifiableCredential;
  meta: VCMetadata;
}
