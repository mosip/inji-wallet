import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { RequestScreen } from './RequestScreen';
import { useRequestLayout } from './RequestLayoutController';
import { Message } from '../../components/Message';
import { ReceiveVcScreen } from './ReceiveVcScreen';
import { MessageOverlay } from '../../components/MessageOverlay';

const RequestStack = createNativeStackNavigator();

export const RequestLayout: React.FC = () => {
  const { t } = useTranslation('RequestScreen');
  const controller = useRequestLayout();

  return (
    <React.Fragment>
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
            name="ReceiveVcScreen"
            component={ReceiveVcScreen}
            options={{
              title: t('incomingVc'),
            }}
          />
        )}
        <RequestStack.Screen
          name="RequestScreen"
          component={RequestScreen}
          options={{
            title: t('request').toUpperCase(),
          }}
        />
      </RequestStack.Navigator>

      {controller.isAccepted && (
        <Message
          title={t('status.accepted.title')}
          message={t('status.accepted.message')}
          onBackdropPress={controller.DISMISS}
        />
      )}

      {controller.isRejected && (
        <Message
          title={t('status.rejected.title')}
          message={t('status.rejected.message')}
          onBackdropPress={controller.DISMISS}
        />
      )}

      {controller.isDisconnected && (
        <Message
          title={t('status.disconnected.title')}
          message={t('status.disconnected.message')}
          onBackdropPress={controller.DISMISS}
        />
      )}

      {controller.isBleError && (
        <MessageOverlay
          isVisible={controller.isBleError}
          title={t('status.bleError.title')}
          message={t('status.bleError.message')}
          hint={
            controller.bleError.code &&
            t('status.bleError.hint', {
              code: controller.bleError.code,
            })
          }
          onBackdropPress={controller.DISMISS}
        />
      )}
    </React.Fragment>
  );
};
