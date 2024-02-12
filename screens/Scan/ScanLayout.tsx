import React from 'react';
import {useTranslation} from 'react-i18next';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SendVcScreen} from './SendVcScreen';
import {useScanLayout} from './ScanLayoutController';
import {ScanScreen} from './ScanScreen';
import {ProgressingModal} from '../../components/ProgressingModal';
import {SCAN_ROUTES} from '../../routes/routesConstants';
import {SharingSuccessModal} from './SuccessfullySharedModal';
import {Theme} from '../../components/ui/styleUtils';
import {Icon} from 'react-native-elements';
import {Loader} from '../../components/ui/Loader';
import {Text} from '../../components/ui';
import {I18nManager, View} from 'react-native';

const ScanStack = createNativeStackNavigator();

export const ScanLayout: React.FC = () => {
  const {t} = useTranslation('ScanScreen');
  const controller = useScanLayout();

  if (
    controller.statusOverlay != null &&
    !controller.isAccepted &&
    !controller.isInvalid
  ) {
    return (
      <Loader
        title={controller.statusOverlay?.title}
        hint={controller.statusOverlay?.hint}
        onCancel={controller.statusOverlay?.onButtonPress}
        onStayInProgress={controller.statusOverlay?.onStayInProgress}
        isHintVisible={
          controller.isStayInProgress ||
          controller.isBleError ||
          controller.isSendingVc
        }
        onRetry={controller.statusOverlay?.onRetry}
      />
    );
  }

  return (
    <React.Fragment>
      <ScanStack.Navigator initialRouteName="ScanScreen">
        {!controller.isDone && (
          <ScanStack.Screen
            name={SCAN_ROUTES.SendVcScreen}
            component={SendVcScreen}
            options={{
              title: t('sharingVc'),
              headerTitleAlign: 'center',
              headerTitle: props => (
                <View style={Theme.Styles.sendVcHeaderContainer}>
                  <Text style={Theme.Styles.scanLayoutHeaderTitle}>
                    {props.children}
                  </Text>
                </View>
              ),
              headerBackVisible: false,
              headerRight: () =>
                !I18nManager.isRTL && (
                  <Icon
                    name="close"
                    color={Theme.Colors.blackIcon}
                    onPress={controller.CANCEL}
                  />
                ),
              headerLeft: () =>
                I18nManager.isRTL && (
                  <Icon
                    name="close"
                    color={Theme.Colors.blackIcon}
                    onPress={controller.CANCEL}
                  />
                ),
            }}
          />
        )}
        <ScanStack.Screen
          name={SCAN_ROUTES.ScanScreen}
          component={ScanScreen}
          options={{
            title: t('MainLayout:share'),
            headerTitle: props => (
              <View style={Theme.Styles.scanLayoutHeaderContainer}>
                <Text style={Theme.Styles.scanLayoutHeaderTitle}>
                  {props.children}
                </Text>
              </View>
            ),
          }}
        />
      </ScanStack.Navigator>

      <SharingSuccessModal
        isVisible={controller.isAccepted}
        testId={'sharingSuccessModal'}
      />

      <ProgressingModal
        isVisible={controller.isDisconnected}
        title={t('RequestScreen:status.disconnected.title')}
        isHintVisible={true}
        hint={t('RequestScreen:status.disconnected.message')}
        onCancel={controller.DISMISS}
        onRetry={controller.onRetry}
        progress
      />
    </React.Fragment>
  );
};
