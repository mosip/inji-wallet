import { useInterpret, useSelector } from '@xstate/react';
import { useContext, useEffect, useRef } from 'react';
import { selectVcLabel } from '../../machines/settings';
import { HomeRouteProps } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';
import {
  HomeScreenEvents,
  HomeScreenMachine,
  selectActiveTab,
  selectSelectedVc,
  selectTabsLoaded,
  selectViewingVc,
} from './HomeScreenMachine';

export function useHomeScreen(props: HomeRouteProps) {
  const { appService } = useContext(GlobalContext);
  const machine = useRef(
    HomeScreenMachine.withContext({
      ...HomeScreenMachine.context,
      serviceRefs: appService.getSnapshot().context.serviceRefs,
    })
  );
  const service = useInterpret(machine.current);
  const settingsService = appService.children.get('settings');

  useEffect(() => {
    if (props.route.params?.activeTab != null) {
      SELECT_TAB(props.route.params.activeTab);
    }
  }, [props.route.params, props.route.params?.activeTab]);

  return {
    service,

    activeTab: useSelector(service, selectActiveTab),
    vcLabel: useSelector(settingsService, selectVcLabel),
    selectedVc: useSelector(service, selectSelectedVc),

    isViewingVc: useSelector(service, selectViewingVc),
    haveTabsLoaded: useSelector(service, selectTabsLoaded),

    SELECT_TAB,
    DISMISS_MODAL: () => service.send(HomeScreenEvents.DISMISS_MODAL()),
  };

  function SELECT_TAB(index: number) {
    const tabs = [
      HomeScreenEvents.SELECT_MY_VCS,
      HomeScreenEvents.SELECT_RECEIVED_VCS,
      HomeScreenEvents.SELECT_HISTORY,
    ];
    service.send(tabs[index]());
  }
}
