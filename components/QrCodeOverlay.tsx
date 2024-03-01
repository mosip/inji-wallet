import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import {Icon, Overlay} from 'react-native-elements';
import {Centered, Column, Row, Text} from './ui';
import QRCode from 'react-native-qrcode-svg';
import {Theme} from './ui/styleUtils';
import {useTranslation} from 'react-i18next';
import testIDProps from '../shared/commonUtil';
import {SvgImage} from './ui/svg';

export const QrCodeOverlay: React.FC<QrCodeOverlayProps> = props => {
  const {t} = useTranslation('VcDetails');

  const [isQrOverlayVisible, setIsQrOverlayVisible] = useState(false);

  const toggleQrOverlay = () => setIsQrOverlayVisible(!isQrOverlayVisible);
  return (
    <React.Fragment>
      <View testID="qrCodeView" style={Theme.QrCodeStyles.QrView}>
        <Pressable
          {...testIDProps('qrCodePressable')}
          accessible={false}
          onPress={toggleQrOverlay}>
          <QRCode
            {...testIDProps('qrCode')}
            size={72}
            value={props.qrCodeDetails}
            backgroundColor={Theme.Colors.QRCodeBackgroundColor}
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
              value={props.qrCodeDetails}
              backgroundColor={Theme.Colors.QRCodeBackgroundColor}
            />
          </Centered>
        </Column>
      </Overlay>
    </React.Fragment>
  );
};

interface QrCodeOverlayProps {
  qrCodeDetails: string;
}
