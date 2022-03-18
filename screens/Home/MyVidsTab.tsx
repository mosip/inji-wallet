import React from 'react';
import { Button, Column, Text, Centered } from '../../components/ui';
import { VidItem } from '../../components/VidItem';
import { Icon } from 'react-native-elements';
import { Colors } from '../../components/ui/styleUtils';
import { RefreshControl } from 'react-native';
import { useMyVidsTab } from './MyVidsTabController';
import { HomeScreenTabProps } from './HomeScreen';
import { AddVidModal } from './MyVids/AddVidModal';
import { DownloadingVidModal } from './MyVids/DownloadingVidModal';
import { OnboardingOverlay } from './OnboardingOverlay';
import { MessageOverlay } from '../../components/MessageOverlay';

export const MyVidsTab: React.FC<HomeScreenTabProps> = (props) => {
  const controller = useMyVidsTab(props);
  
  return (
    <React.Fragment>
      <Column fill style={{ display: props.isVisible ? 'flex' : 'none' }}>
        <Column fill padding="32 24">
          {controller.vidKeys.length > 0 && (
            <React.Fragment>
              <Column
                scroll
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
              </Column>
              <Column elevation={2} margin="0 2">
                <Button
                  type="clear"
                  disabled={controller.isRefreshingVids}
                  title={`Add ${controller.vidLabel.singular}`}
                  onPress={controller.ADD_VID}
                />
              </Column>
            </React.Fragment>
          )}
          {controller.vidKeys.length === 0 && (
            <React.Fragment>
              <Centered fill>
                <Text weight="semibold" margin="0 0 8 0">
                  Generate your {controller.vidLabel.plural}
                </Text>
                <Text color={Colors.Grey} align="center">
                  Tap on "Add {controller.vidLabel.singular}" below to{'\n'}
                  download your {controller.vidLabel.singular}
                </Text>
                <Icon
                  name="arrow-downward"
                  containerStyle={{ marginTop: 20 }}
                  color={Colors.Orange}
                />
              </Centered>
              <Button
                disabled={controller.isRefreshingVids}
                title={`Add ${controller.vidLabel.singular}`}
                onPress={controller.ADD_VID}
              />
            </React.Fragment>
          )}
        </Column>
      </Column>

      {controller.AddVidModalService && (
        <AddVidModal service={controller.AddVidModalService} />
      )}
      {controller.isRequestSuccessful && (
        <DownloadingVidModal
          isVisible={controller.isRequestSuccessful}
          onDismiss={controller.DISMISS}
        />
      )}

      <OnboardingOverlay
        isVisible={controller.isOnboarding}
        onDone={controller.ONBOARDING_DONE}
        onAddVid={controller.ADD_VID}
      />
    </React.Fragment>
  );
};
