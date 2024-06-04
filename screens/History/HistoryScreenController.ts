import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {
  ActivityLogEvents,
  selectActivities,
  selectIsRefreshing,
  selectWellknownIssuerMap,
} from '../../machines/activityLog';
import {GlobalContext} from '../../shared/GlobalContext';

export function useHistoryTab() {
  const {appService} = useContext(GlobalContext);
  const activityLogService = appService.children.get('activityLog')!!;
  const wellknownIssuerMap = useSelector(
    activityLogService,
    selectWellknownIssuerMap,
  );

  return {
    activities: useSelector(activityLogService, selectActivities),

    isRefreshing: useSelector(activityLogService, selectIsRefreshing),

    getWellKnownIssuerMap: (issuerName: string) => {
      return wellknownIssuerMap[issuerName] ?? null;
    },

    REFRESH: () => activityLogService.send(ActivityLogEvents.REFRESH()),
  };
}
