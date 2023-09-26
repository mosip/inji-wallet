import React from 'react';
import {useTranslation} from 'react-i18next';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SendVcScreen} from './SendVcScreen';
import {useScanLayout} from './ScanLayoutController';
import {ScanScreen} from './ScanScreen';
import {ProgressingModal} from '../../components/ProgressingModal';
import {MessageOverlay} from '../../components/MessageOverlay';
import {SCAN_ROUTES} from '../../routes/routesConstants';
import {SharingSuccessModal} from './SuccessfullySharedModal';

const ScanStack = createNativeStackNavigator();

export const ScanLayout: React.FC = () => {
  const {t} = useTranslation('ScanScreen');
  const controller = useScanLayout();

  return (
    <React.Fragment>
      <ScanStack.Navigator initialRouteName="ScanScreen">
        {!controller.isDone && (
          <ScanStack.Screen
            name={SCAN_ROUTES.SendVcScreen}
            component={SendVcScreen}
            options={{
              title: t('sharingVc'),
              headerBackVisible: false,
            }}
          />
        )}
        <ScanStack.Screen
          name={SCAN_ROUTES.ScanScreen}
          component={ScanScreen}
          options={{
            headerTitleStyle: {fontSize: 30, fontFamily: 'Inter_600SemiBold'},
            title: t('MainLayout:scan'),
          }}
        />
      </ScanStack.Navigator>

      <ProgressingModal
        isVisible={controller.statusOverlay != null}
        title={controller.statusOverlay?.title}
        hint={controller.statusOverlay?.hint}
        onCancel={controller.statusOverlay?.onButtonPress}
        onStayInProgress={controller.statusOverlay?.onStayInProgress}
        isHintVisible={controller.isStayInProgress}
        isBleErrorVisible={controller.isBleError}
        onRetry={controller.statusOverlay?.onRetry}
        progress={controller.statusOverlay?.progress}
        requester={controller.statusOverlay?.requester}
      />

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
