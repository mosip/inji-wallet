import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl } from 'react-native';
import { Icon, Overlay } from 'react-native-elements';
import { TransactionHistoryItem } from '../../components/TransactionHistoryItem';

import { Column, Row, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { useTransactionHistoryScreen } from './TransactionHistoryScreenController';

export const TransactionHistoryScreen: React.FC = () => {
  const controller = useTransactionHistoryScreen();

  const numRecords = controller.transactionHistory.length;

  return (
    <React.Fragment>
      <Column backgroundColor={Colors.Grey6} fill>
        <Row margin="16">
          <Column fill align="center">
            <StatusText
              isLoading={controller.isLoading}
              numRecords={numRecords}
            />
          </Column>
          <Column>
            <Icon
              name="filter"
              color={numRecords > 0 ? Colors.Orange : Colors.Grey}
              onPress={() => numRecords > 0 && controller.SHOW_FILTERS()}
            />
          </Column>
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

const StatusText: React.FC<{ isLoading: boolean; numRecords: number }> = (
  props
) => {
  const { t } = useTranslation('ProfileLayout');
  const { isLoading, numRecords } = props;

  return isLoading ? (
    <Text color={Colors.Grey} size="small">
      {t('transactionHistoryScreen.fetchingRecords')}
    </Text>
  ) : (
    <Text color={Colors.Grey} size="small">
      {numRecords > 0
        ? t('transactionHistoryScreen.showingRecords', {
            numRecords,
          })
        : t('transactionHistoryScreen.noRecords')}
    </Text>
  );
};
