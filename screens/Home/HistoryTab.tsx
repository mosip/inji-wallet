import React from 'react';
import { RefreshControl } from 'react-native';
import { Icon } from 'react-native-elements';
import { useTranslation } from 'react-i18next';

import { Centered, Column, Text } from '../../components/ui';
import { useHistoryTab } from './HistoryTabController';
import { HomeScreenTabProps } from './HomeScreen';
import { ActivityLogText } from '../../components/ActivityLogText';

export const HistoryTab: React.FC<HomeScreenTabProps> = (props) => {
  const { t } = useTranslation('HistoryTab');
  const controller = useHistoryTab();

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
          <ActivityLogText
            key={`${activity.timestamp}-${activity._vcKey}`}
            activity={activity}
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
              {t('noHistory')}
            </Text>
          </Centered>
        )}
      </Column>
    </Column>
  );
};
