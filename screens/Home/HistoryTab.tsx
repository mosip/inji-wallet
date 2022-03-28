import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { RefreshControl } from 'react-native';
import { Centered, Column, Text } from '../../components/ui';
import { TextItem } from '../../components/ui/TextItem';
import { useHistoryTab } from './HistoryTabController';
import { HomeScreenTabProps } from './HomeScreen';
import { Icon } from 'react-native-elements';
import { ActivityLog } from '../../machines/activityLog';

const createLabel = (activity: ActivityLog) =>
  [
    activity.deviceName,
    formatDistanceToNow(activity.timestamp, { addSuffix: true }),
  ]
    .filter((label) => label.trim() !== '')
    .join(' · ');

export const HistoryTab: React.FC<HomeScreenTabProps> = (props) => {
  const controller = useHistoryTab(props);

  return (
    <Column fill style={{ display: props.isVisible ? 'flex' : 'none' }}>
      <Column
        scroll
        padding="32 0"
        refreshControl={
          <RefreshControl
            refreshing={controller.isRefreshing}
            onRefresh={controller.REFRESH}
          />
        }>
        {controller.activities.map((activity) => (
          <TextItem
            key={activity.timestamp}
            label={createLabel(activity)}
            text={`${activity.vcLabel} ${activity.action}`}
          />
        ))}
        {controller.activities.length === 0 && (
          <Centered fill>
            <Icon
              style={{ marginBottom: 20 }}
              size={40}
              name="sentiment-dissatisfied"
            />
            <Text align="center" weight="semibold" margin="0 0 4 0">
              No history available yet
            </Text>
          </Centered>
        )}
      </Column>
    </Column>
  );
};
