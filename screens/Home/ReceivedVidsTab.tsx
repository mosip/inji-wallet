import React from 'react';
import { RefreshControl } from 'react-native';
import { Icon } from 'react-native-elements';
import { Centered, Column, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
import { VidItem } from '../../components/VidItem';
import { HomeScreenTabProps } from './HomeScreen';
import { useReceivedVidsTab } from './ReceivedVidsTabController';

export const ReceivedVidsTab: React.FC<HomeScreenTabProps> = (props) => {
  const controller = useReceivedVidsTab(props);

  return (
    <Column fill style={{ display: props.isVisible ? 'flex' : 'none' }}>
      <Column
        scroll
        padding="32 24"
        refreshControl={
          <RefreshControl
            refreshing={controller.isRefreshingVids}
            onRefresh={controller.REFRESH}
          />
        }>
        {controller.vidKeys.map((vidKey) => (
          <VidItem
            key={vidKey}
            vidKey={vidKey}
            margin="0 2 8 2"
            onPress={controller.VIEW_VID}
          />
        ))}
        {controller.vidKeys.length === 0 && (
          <React.Fragment>
            <Centered fill>
              <Icon
                style={{ marginBottom: 20 }}
                size={40}
                name="sentiment-dissatisfied"
              />
              <Text align="center" weight="semibold" margin="0 0 4 0">
                No {controller.vidLabel.plural} available yet
              </Text>
              <Text align="center" color={Colors.Grey}>
                Tap on Request below to receive {controller.vidLabel.singular}
              </Text>
            </Centered>
          </React.Fragment>
        )}
      </Column>
    </Column>
  );
};
