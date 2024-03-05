import React from 'react';
import {RefreshControl} from 'react-native';
import {Icon} from 'react-native-elements';
import {useTranslation} from 'react-i18next';
import {Centered, Column, Text} from '../../components/ui';
import {useHistoryTab} from './HistoryScreenController';
import {ActivityLogText} from '../../components/ActivityLogText';
import {MainRouteProps} from '../../routes/main';
import {Theme} from '../../components/ui/styleUtils';
import {BannerNotificationContainer} from '../../components/BannerNotificationContainer';

export const HistoryScreen: React.FC<MainRouteProps> = props => {
  const {t} = useTranslation('HistoryScreen');
  const controller = useHistoryTab();

  const activities = props.route.params?.vcKey
    ? controller.activities.filter(
        activity => activity._vcKey === props.route.params?.vcKey,
      )
    : controller.activities;

  return (
    <Column fill backgroundColor={Theme.Colors.whiteBackgroundColor}>
      <Column
        scroll
        padding="7 0"
        refreshControl={
          <RefreshControl
            refreshing={controller.isRefreshing}
            onRefresh={controller.REFRESH}
          />
        }>
        <BannerNotificationContainer />
        {activities.map(activity => (
          <ActivityLogText
            key={`${activity.timestamp}-${activity._vcKey}`}
            activity={activity}
          />
        ))}
        {activities.length === 0 && (
          <Centered fill>
            <Icon
              style={{marginBottom: 20}}
              size={40}
              name="sentiment-dissatisfied"
            />
            <Text
              testID="noHistory"
              align="center"
              style={{paddingTop: 3}}
              weight="semibold"
              margin="0 0 4 0">
              {t('noHistory')}
            </Text>
          </Centered>
        )}
      </Column>
    </Column>
  );
};
