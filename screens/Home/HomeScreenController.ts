import { useInterpret, useSelector } from '@xstate/react';
import { useContext, useEffect, useRef } from 'react';
import { selectVidLabel } from '../../machines/settings';
import { HomeRouteProps } from '../../routes/main';
import { GlobalContext } from '../../shared/GlobalContext';
import {
  HomeScreenEvents,
  HomeScreenMachine,
  selectActiveTab,
  selectSelectedVid,
  selectTabsLoaded,
  selectViewingVid,
} from './HomeScreenMachine';
import { ReceivedVidsTabEvents } from './ReceivedVidsTabMachine';

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

  const activeTab = useSelector(service, selectActiveTab);

  useEffect(() => {
    if (
      props.route.params?.activeTab != null &&
      props.route.params?.activeTab !== activeTab
    ) {
      SELECT_TAB(props.route.params.activeTab);
    }
    if (activeTab === 1) {
      service.children
        .get('receivedVids')
        .send(ReceivedVidsTabEvents.REFRESH());
    }
  }, [props.route.params?.activeTab]);

  return {
    service,

    activeTab,
    vidLabel: useSelector(settingsService, selectVidLabel),
    selectedVid: useSelector(service, selectSelectedVid),

    isViewingVid: useSelector(service, selectViewingVid),
    haveTabsLoaded: useSelector(service, selectTabsLoaded),

    SELECT_TAB,
    DISMISS_MODAL: () => service.send(HomeScreenEvents.DISMISS_MODAL()),
  };

  function SELECT_TAB(index: number) {
    const tabs = [
      HomeScreenEvents.SELECT_MY_VIDS,
      HomeScreenEvents.SELECT_RECEIVED_VIDS,
      HomeScreenEvents.SELECT_HISTORY,
    ];
    service.send(tabs[index]());
  }
}
