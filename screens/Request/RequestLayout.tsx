import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {HeaderBackButton} from '@react-navigation/elements';
import {RequestScreen} from './RequestScreen';
import {useRequestLayout} from './RequestLayoutController';
import {Message} from '../../components/Message';
import {ReceiveVcScreen} from './ReceiveVcScreen';
import {ReceivedCardsModal} from '../Settings/ReceivedCardsModal';
import {useReceivedVcsTab} from '../Home/ReceivedVcsTabController';
import {REQUEST_ROUTES} from '../../routes/routesConstants';
import {SquircleIconPopUpModal} from '../../components/ui/SquircleIconPopUpModal';
import {ProgressingModal} from '../../components/ProgressingModal';
import {BackupAndRestoreAllScreenBanner} from '../../components/BackupAndRestoreAllScreenBanner';
const RequestStack = createNativeStackNavigator();

export const RequestLayout: React.FC = () => {
  const {t} = useTranslation('RequestScreen');
  const controller = useRequestLayout();
  const receivedCardsController = useReceivedVcsTab();

  return (
    <React.Fragment>
      <BackupAndRestoreAllScreenBanner />
      <RequestStack.Navigator
        initialRouteName="RequestScreen"
        screenListeners={{
          state: () => {
            if (controller.IsSavingFailedInViewingVc || controller.isAccepted) {
              controller.RESET();
            }
          },
        }}
        screenOptions={{
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}>
        {!controller.isDone && (
          <RequestStack.Screen
            name={REQUEST_ROUTES.ReceiveVcScreen}
            component={ReceiveVcScreen}
            options={{
              title: t('incomingVc'),
              headerLeft: () => (
                <HeaderBackButton
                  onPress={() => {
                    controller.RESET();
                  }}
                />
              ),
            }}
          />
        )}
        <RequestStack.Screen
          name={REQUEST_ROUTES.RequestScreen}
          component={RequestScreen}
          options={{
            title: t('receiveCard').toUpperCase(),
          }}
        />
      </RequestStack.Navigator>

      <ReceivedCardsModal
        isVisible={controller.isNavigatingToReceivedCards}
        controller={receivedCardsController}
        onDismiss={controller.DISMISS}
      />
      {controller.isAccepted && (
        <SquircleIconPopUpModal
          message={t('status.accepted.message')}
          onBackdropPress={controller.DISMISS}
          testId={'vcAcceptedPopUp'}
        />
      )}

      {controller.isRejected && (
        <Message
          title={t('status.rejected.title')}
          message={t('status.rejected.message')}
          onBackdropPress={controller.DISMISS}
        />
      )}

      <ProgressingModal
        title={t('status.disconnected.title')}
        hint={t('status.disconnected.message')}
        isVisible={controller.isDisconnected}
        isHintVisible={true}
        progress={true}
        onCancel={controller.DISMISS}
        onRetry={controller.RESET}
      />

      <ProgressingModal
        title={t('status.bleError.title')}
        hint={t('status.bleError.message')}
        isVisible={controller.isBleError}
        isHintVisible={true}
        progress={true}
        onCancel={controller.DISMISS}
        onRetry={controller.RESET}
      />
    </React.Fragment>
  );
};
