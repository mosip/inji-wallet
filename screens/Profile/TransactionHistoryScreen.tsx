import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl } from 'react-native';
import { Overlay } from 'react-native-elements';
import { TransactionHistoryItem } from '../../components/TransactionHistoryItem';

import { Button, Column, Row, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { useTransactionHistoryScreen } from './TransactionHistoryScreenController';

export const TransactionHistoryScreen: React.FC = () => {
  const { t } = useTranslation('ProfileLayout');
  const controller = useTransactionHistoryScreen();

  return (
    <React.Fragment>
      <Column backgroundColor={Colors.Grey6} fill>
        <Row margin="8">
          <Column>
            <Text color={Colors.Grey}>
              {t('transactionHistoryScreen.showingRecords', {
                numRecords: controller.transactionHistory.length,
              })}
            </Text>
          </Column>
          <Button
            title={t('transactionHistoryScreen.filterButton')}
            onPress={controller.SHOW_FILTERS}
          />
        </Row>
        <Column fill>
          <FlatList
            data={controller.transactionHistory}
            keyExtractor={(item) => item.eventId}
            renderItem={({ item }) => <TransactionHistoryItem data={item} />}
            refreshControl={
              <RefreshControl
                refreshing={controller.isLoading}
                onRefresh={controller.REFRESH}
              />
            }
          />
        </Column>
      </Column>
      <Overlay
        isVisible={controller.isShowingFilters}
        onBackdropPress={controller.CANCEL}>
        <Text>TODO: Filters Modal</Text>
        {/* FILTERS */}
      </Overlay>
    </React.Fragment>
  );
};
