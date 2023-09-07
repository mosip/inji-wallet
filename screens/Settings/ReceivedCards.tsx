import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl } from 'react-native';
import { Pressable } from 'react-native';
import { Centered, Column, Text } from '../../components/ui';
import { Icon } from 'react-native-elements';
import { Theme } from '../../components/ui/styleUtils';
import { Image } from 'react-native';
import { Modal } from '../../components/ui/Modal';
import { useReceivedVcsTab } from '../Home/ReceivedVcsTabController';
import { VcItem } from '../../components/VcItem';
import { ViewVcModal } from '../Home/ViewVcModal';
import { ReceivedCardsModal } from './ReceivedCardsModal';

export const ReceivedCards: React.FC = () => {
  const { t } = useTranslation('ReceivedVcsTab');
  const controller = useReceivedVcsTab();

  return (
    <React.Fragment>
      <Pressable onPress={controller.TOGGLE_RECEIVED_CARDS}>
        <Column style={Theme.Styles.receiveCardsContainer}>
          <Image
            source={Theme.ReceivedCardsIcon}
            style={{ marginLeft: 10, marginRight: 9 }}
          />
          <Text margin="6" weight="semibold">
            {t('receivedCards')}
          </Text>
        </Column>
      </Pressable>
      <ReceivedCardsModal
        isVisible={controller.isVisible}
        controller={controller}
        onDismiss={controller.TOGGLE_RECEIVED_CARDS}
      />
    </React.Fragment>
  );
};
