import React from 'react';
import { StyleSheet } from 'react-native';
import { Tab } from 'react-native-elements';
import { Column, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { HomeRouteProps } from '../../routes/main';
import { HistoryTab } from './HistoryTab';
import { MyVidsTab } from './MyVidsTab';
import { ReceivedVidsTab } from './ReceivedVidsTab';
import { ViewVidModal } from './ViewVidModal';
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
          {TabItem(`My\n${controller.vidLabel.plural}`)}
          {TabItem(`Received\n${controller.vidLabel.plural}`)}
          {TabItem('History')}
        </Tab>
        {controller.haveTabsLoaded && (
          <Column fill>
            <MyVidsTab
              isVisible={controller.activeTab === 0}
              service={controller.service.children.get('myVidsTab')}
            />
            <ReceivedVidsTab
              isVisible={controller.activeTab === 1}
              service={controller.service.children.get('receivedVidsTab')}
            />
            <HistoryTab
              isVisible={controller.activeTab === 2}
              service={controller.service.children.get('historyTab')}
            />
          </Column>
        )}
      </Column>
      {controller.selectedVid && (
        <ViewVidModal
          isVisible={controller.isViewingVid}
          onDismiss={controller.DISMISS_MODAL}
          vidItemActor={controller.selectedVid}
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
