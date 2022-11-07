import React from 'react';
import { StyleSheet } from 'react-native';

import {
  MOSIPServiceHistoryItem,
  MOSIPServiceHistoryItemEventStatus,
} from '../screens/Profile/TransactionHistoryScreenController';
import { Column, Row, Text } from './ui';
import { Colors } from './ui/styleUtils';

export const TransactionHistoryItem: React.FC<TransactionHistoryItemProps> = (
  props
) => {
  const { data } = props;

  return (
    <Column style={styles.container}>
      <Row margin={[0, 0, 8, 0]}>
        <Column fill margin={[0, 8, 0, 0]}>
          <Text size="small" weight="semibold" numLines={1}>
            {data.eventId}
          </Text>
          <Text size="smaller" color={Colors.Grey}>
            {new Date(data.timeStamp).toLocaleString()}
          </Text>
        </Column>
        <Column crossAlign="flex-end">
          <Text
            size="smaller"
            weight="semibold"
            style={[statusStyles.base, statusStyles[data.eventStatus]]}>
            {data.eventStatus}
          </Text>
        </Column>
      </Row>
      <Text size="small">{data.description.trim()}</Text>
    </Column>
  );
};

interface TransactionHistoryItemProps {
  data: MOSIPServiceHistoryItem;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

const statusStyles = StyleSheet.create({
  base: {
    borderRadius: 100,
    color: Colors.White,
    backgroundColor: Colors.Grey,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  [MOSIPServiceHistoryItemEventStatus.Failed]: {
    backgroundColor: Colors.Red,
  },

  [MOSIPServiceHistoryItemEventStatus.InProgress]: {
    backgroundColor: Colors.Orange,
  },

  [MOSIPServiceHistoryItemEventStatus.Success]: {
    backgroundColor: Colors.Green,
  },
});
