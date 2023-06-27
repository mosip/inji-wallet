import React, { useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { Switch, Icon } from 'react-native-elements';
import { Pressable, Platform } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Centered, Button, Column, Row, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { Image } from 'react-native';
import { Modal } from '../../components/ui/Modal';
import { useRequestScreen } from '../Request/RequestScreenController';

export const ReceiveCard: React.FC = () => {
  const { t } = useTranslation('RequestScreen');
  const controller = useRequestScreen();

  const [showReceiveCard, setShowReceiveCard] = useState(false);

  return (
    <React.Fragment>
      <Pressable
        onPress={() => {
          setShowReceiveCard(!showReceiveCard);
        }}>
        <Column style={Theme.Styles.receiveCardsContainer}>
          <Image
            source={Theme.ReceiveCardIcon}
            style={{ marginLeft: 10, marginRight: 9 }}
          />
          <Text margin="6" weight="semibold">
            {t('receiveCard')}
          </Text>
        </Column>
      </Pressable>
      <Modal
        isVisible={showReceiveCard}
        arrowLeft={<Icon name={''} />}
        headerTitle={t('receiveCard')}
        headerElevation={2}
        onDismiss={() => setShowReceiveCard(!showReceiveCard)}>
        <Column
          fill
          padding="24"
          backgroundColor={Theme.Colors.lightGreyBackgroundColor}></Column>
      </Modal>
    </React.Fragment>
  );
};
