import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {
  ActivityLogEvents,
  selectActivities,
  selectIsRefreshing,
  selectWellknownIssuerMap,
} from '../../machines/activityLog';
import {GlobalContext} from '../../shared/GlobalContext';
import {API_CACHED_STORAGE_KEYS} from '../../shared/constants';

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
      const wellknownIssuerMapElement = wellknownIssuerMap[issuerName];
      console.log('Cache key ', Object.keys(wellknownIssuerMap));
      console.log('Cache key map', wellknownIssuerMap);
      console.log('Cache key map', JSON.stringify(wellknownIssuerMap, null, 2));
      return wellknownIssuerMapElement ?? null;
    },

    REFRESH: () => activityLogService.send(ActivityLogEvents.REFRESH()),
  };
}
