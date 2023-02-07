import React from 'react';
import { RefreshControl } from 'react-native';
import { Icon } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { Centered, Column, Text } from '../../components/ui';
import { useHistoryTab } from './HistoryScreenController';
import { ActivityLogText } from '../../components/ActivityLogText';
import { MainRouteProps } from '../../routes/main';
import { Theme } from '../../components/ui/styleUtils';

export const HistoryScreen: React.FC<MainRouteProps> = (props) => {
  const { t } = useTranslation('HistoryTab');
  const controller = useHistoryTab();

  return (
    <Column fill backgroundColor={Theme.Colors.whiteBackgroundColor}>
      <Column
        scroll
        padding="18 0"
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
