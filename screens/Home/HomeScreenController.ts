import { useInterpret, useSelector } from '@xstate/react';
import { useContext, useEffect, useRef } from 'react';
import { HomeRouteProps } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';
import {
  HomeScreenEvents,
  HomeScreenMachine,
  selectActiveTab,
  selectSelectedVc,
  selectTabRefs,
  selectTabsLoaded,
  selectViewingVc,
} from './HomeScreenMachine';
import { VcEvents } from '../../machines/vc';

export function useHomeScreen(props: HomeRouteProps) {
  const { appService } = useContext(GlobalContext);
  const machine = useRef(
    HomeScreenMachine.withContext({
      ...HomeScreenMachine.context,
      serviceRefs: appService.getSnapshot().context.serviceRefs,
    })
  );
  const service = useInterpret(machine.current);
  const vcService = appService.children.get('vc');

  useEffect(() => {
    if (props.route.params?.activeTab != null) {
      SELECT_TAB(props.route.params.activeTab);
    }
  }, [props.route.params, props.route.params?.activeTab]);

  return {
    service,

    activeTab: useSelector(service, selectActiveTab),
    selectedVc: useSelector(service, selectSelectedVc),
    tabRefs: useSelector(service, selectTabRefs),

    isViewingVc: useSelector(service, selectViewingVc),
    haveTabsLoaded: useSelector(service, selectTabsLoaded),

    SELECT_TAB,
    DISMISS_MODAL: () => service.send(HomeScreenEvents.DISMISS_MODAL()),
    REVOKE: () => {
      vcService.send(VcEvents.REFRESH_MY_VCS());
      service.send(HomeScreenEvents.DISMISS_MODAL());
    },
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
