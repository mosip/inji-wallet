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
      <Pressable {...testIDProps('qrCodePressable')} onPress={toggleQrOverlay}>
        <View style={Theme.QrCodeStyles.QrView}>
          <Row>
            <QRCode
              {...testIDProps('qrCode')}
              size={90}
              value={props.qrCodeDetails}
              backgroundColor={Theme.Colors.QRCodeBackgroundColor}
            />
          </Row>
        </View>
        <Row
          testID="magnifierZoom"
          align="flex-end"
          margin="-35 0 0 67"
          style={Theme.QrCodeStyles.magnifierZoom}>
          {SvgImage.MagnifierZoom()}
        </Row>
      </Pressable>
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
