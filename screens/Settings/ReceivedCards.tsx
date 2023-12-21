import React from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable} from 'react-native';
import {Column, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {Image} from 'react-native';
import {useReceivedVcsTab} from '../Home/ReceivedVcsTabController';
import {ReceivedCardsModal} from './ReceivedCardsModal';
import testIDProps from '../../shared/commonUtil';
import {SvgImage} from '../../components/ui/svg';

export const ReceivedCards: React.FC = () => {
  const {t} = useTranslation('ReceivedVcsTab');
  const controller = useReceivedVcsTab();

  return (
    <React.Fragment>
      <Pressable
        {...testIDProps('receivedCardsPressableArea')}
        onPress={controller.TOGGLE_RECEIVED_CARDS}>
        <Column align="center" style={Theme.Styles.receiveCardsContainer}>
          {SvgImage.ReceivedCards()}
          <Text
            testID="receivedCards"
            margin="6"
            style={{paddingTop: 3}}
            weight="semibold">
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
