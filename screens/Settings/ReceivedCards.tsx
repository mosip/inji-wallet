import React from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable} from 'react-native';
import {Column, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {Image} from 'react-native';
import {useReceivedVcsTab} from '../Home/ReceivedVcsTabController';
import {ReceivedCardsModal} from './ReceivedCardsModal';

export const ReceivedCards: React.FC = () => {
  const {t} = useTranslation('ReceivedVcsTab');
  const controller = useReceivedVcsTab();

  return (
    <React.Fragment>
      <Pressable onPress={controller.TOGGLE_RECEIVED_CARDS}>
        <Column
          testID="receivedCards"
          style={Theme.Styles.receiveCardsContainer}>
          <Image
            source={Theme.ReceivedCardsIcon}
            style={{marginLeft: 10, marginRight: 9}}
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
