import React, {useEffect} from 'react';
import {Icon, Tab} from 'react-native-elements';
import {Button, Column, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {HomeRouteProps} from '../../routes/main';
import {MyVcsTab} from './MyVcsTab';
import {ReceivedVcsTab} from './ReceivedVcsTab';
import {ViewVcModal} from './ViewVcModal';
import {useHomeScreen} from './HomeScreenController';
import {TabRef} from './HomeScreenMachine';
import {useTranslation} from 'react-i18next';
import {ActorRefFrom} from 'xstate';
import {vcItemMachine} from '../../machines/vcItem';
import {isOpenId4VCIEnabled} from '../../shared/openId4VCI/Utils';
import LinearGradient from 'react-native-linear-gradient';
import {EsignetMosipVCItemMachine} from '../../machines/VCItemMachine/EsignetMosipVCItem/EsignetMosipVCItemMachine';

export const HomeScreen: React.FC<HomeRouteProps> = props => {
  const {t} = useTranslation('HomeScreen');
  const controller = useHomeScreen(props);

  useEffect(() => {
    if (controller.IssuersService) {
      navigateToIssuers();
    }
  }, [controller.IssuersService]);

  const navigateToIssuers = () => {
    props.navigation.navigate('IssuersScreen', {
      service: controller.IssuersService,
    });
  };

  const DownloadFABIcon: React.FC = () => {
    const plusIcon = (
      <Icon
        name={'plus'}
        type={'entypo'}
        size={36}
        color={Theme.Colors.whiteText}
      />
    );
    return (
      <LinearGradient
        colors={Theme.Colors.gradientBtn}
        style={Theme.Styles.downloadFabIcon}>
        <Button
          testID="downloadIcon"
          icon={plusIcon}
          onPress={() => {
            controller.GOTO_ISSUERS();
          }}
          type={'clearAddIdBtnBg'}
          fill
        />
      </LinearGradient>
    );
  };

  return (
    <React.Fragment>
      <Column fill backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
        {controller.haveTabsLoaded && (
          <Column fill>
            <MyVcsTab
              isVisible={controller.activeTab === 0}
              service={controller.tabRefs.myVcs}
              vcItemActor={controller.selectedVc}
            />
            <ReceivedVcsTab
              isVisible={controller.activeTab === 1}
              service={controller.tabRefs.receivedVcs}
              vcItemActor={controller.selectedVc}
            />
          </Column>
        )}
      </Column>
      {isOpenId4VCIEnabled() && <DownloadFABIcon />}
      {controller.selectedVc && (
        <ViewVcModal
          isVisible={controller.isViewingVc}
          onDismiss={controller.DISMISS_MODAL}
          vcItemActor={controller.selectedVc}
          onRevokeDelete={() => {
            controller.REVOKE();
          }}
          activeTab={controller.activeTab}
        />
      )}
    </React.Fragment>
  );
};

function TabItem(title: string) {
  return (
    <Tab.Item
      containerStyle={Theme.Styles.tabContainer}
      title={
        <Text align="center" color={Theme.Colors.TabItemText}>
          {title}
        </Text>
      }
    />
  );
}

export interface HomeScreenTabProps {
  isVisible: boolean;
  service: TabRef;
  vcItemActor:
    | ActorRefFrom<typeof vcItemMachine>
    | ActorRefFrom<typeof EsignetMosipVCItemMachine>;
}
