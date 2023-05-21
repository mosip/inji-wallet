import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable } from 'react-native';
import { Icon, ListItem, Overlay } from 'react-native-elements';
import { Column } from './ui';
import QRCode from 'react-native-qrcode-svg';
import { Theme } from './ui/styleUtils';

export const QrCodeOverlay: React.FC<QrCodeOverlayProps> = (props) => {
  const [isQrOverlayVisible, setIsQrOverlayVisible] = useState(false);

  const toggleQrOverlay = () => setIsQrOverlayVisible(!isQrOverlayVisible);
  return (
    <React.Fragment>
      <Pressable onPress={toggleQrOverlay}>
        <Column margin="20 0 0 0">
          <QRCode
            size={90}
            value={props.qrCodeDetailes}
            backgroundColor={Theme.Colors.QRCodeBackgroundColor}
          />
        </Column>
      </Pressable>
      <Overlay
        isVisible={isQrOverlayVisible}
        onBackdropPress={toggleQrOverlay}
        overlayStyle={{ padding: 1 }}>
        <Column width={Dimensions.get('window').width * 0.8}>
          <QRCode
            size={300}
            value={props.qrCodeDetailes}
            backgroundColor={Theme.Colors.QRCodeBackgroundColor}
          />
        </Column>
      </Overlay>
    </React.Fragment>
  );
};

interface QrCodeOverlayProps {
  qrCodeDetailes: string;
}
