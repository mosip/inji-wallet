import React from 'react';
import { StyleSheet } from 'react-native';
import { Tab } from 'react-native-elements';
import { Column, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { HomeRouteProps } from '../../routes/main';
import { HistoryTab } from './HistoryTab';
import { MyVcsTab } from './MyVcsTab';
import { ReceivedVcsTab } from './ReceivedVcsTab';
import { ViewVcModal } from './ViewVcModal';
import { ActorRefFrom } from 'xstate';
import { useHomeScreen } from './HomeScreenController';

const styles = StyleSheet.create({
  tabIndicator: {
    backgroundColor: Colors.Orange,
  },
  tabContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  tabView: {
    flex: 1,
  },
});

export const HomeScreen: React.FC<HomeRouteProps> = (props) => {
  const controller = useHomeScreen(props);

  return (
    <React.Fragment>
      <Column fill backgroundColor={Colors.LightGrey}>
        <Tab
          value={controller.activeTab}
          onChange={controller.SELECT_TAB}
          indicatorStyle={styles.tabIndicator}>
          {TabItem(`My\n${controller.VCLabel.plural}`)}
          {TabItem(`Received\n${controller.VCLabel.plural}`)}
          {TabItem('History')}
        </Tab>
        {controller.haveTabsLoaded && (
          <Column fill>
            <MyVcsTab
              isVisible={controller.activeTab === 0}
              service={controller.service.children.get('MyVcsTab')}
            />
            <ReceivedVcsTab
              isVisible={controller.activeTab === 1}
              service={controller.service.children.get('receivedVcsTab')}
            />
            <HistoryTab
              isVisible={controller.activeTab === 2}
              service={controller.service.children.get('historyTab')}
            />
          </Column>
        )}
      </Column>
      {controller.selectedVc && (
        <ViewVcModal
          isVisible={controller.isViewingVc}
          onDismiss={controller.DISMISS_MODAL}
          vcItemActor={controller.selectedVc}
        />
      )}
    </React.Fragment>
  );
};

function TabItem(title: string) {
  return (
    <Tab.Item
      containerStyle={styles.tabContainer}
      title={
        <Text align="center" color={Colors.Orange}>
          {title}
        </Text>
      }
    />
  );
}

export interface HomeScreenTabProps {
  isVisible: boolean;
  service: ActorRefFrom<any>;
}
