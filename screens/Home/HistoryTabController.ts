import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import {
  ActivityLogEvents,
  selectActivities,
  selectIsRefreshing,
} from '../../machines/activityLog';
import { GlobalContext } from '../../shared/GlobalContext';

export function useHistoryTab() {
  // const service = props.service as ActorRefFrom<typeof HistoryTabMachine>;
  const { appService } = useContext(GlobalContext);
  const activityLogService = appService.children.get('activityLog');

  return {
    activities: useSelector(activityLogService, selectActivities),

    isRefreshing: useSelector(activityLogService, selectIsRefreshing),

    REFRESH: () => activityLogService.send(ActivityLogEvents.REFRESH()),
  };
}
