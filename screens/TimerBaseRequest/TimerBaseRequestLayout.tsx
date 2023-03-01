import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { useRequestLayout } from './TimerBaseRequestLayoutController';
import { Message } from '../../components/Message';
import { LanguageSelector } from '../../components/LanguageSelector';
import { Theme } from '../../components/ui/styleUtils';
import { I18nManager, Platform } from 'react-native';
import { TimerBaseReceiveVcScreen } from './TimerBaseReceiveVcScreen';
import { TimerBaseRequestScreen } from './TimerBaseRequestScreen';

const RequestStack = createNativeStackNavigator();

export const TimerBaseRequestLayout: React.FC = () => {
  const { t } = useTranslation('RequestScreen');
  const controller = useRequestLayout();

  return (
    <React.Fragment>
      <RequestStack.Navigator
        initialRouteName="TimerBaseRequestScreen"
        screenOptions={{
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerRight: () =>
            I18nManager.isRTL && Platform.OS !== 'ios' ? null : (
              <LanguageSelector
                triggerComponent={
                  <Icon name="language" color={Theme.Colors.Icon} />
                }
              />
            ),
          headerLeft: () =>
            I18nManager.isRTL && Platform.OS !== 'ios' ? (
              <LanguageSelector
                triggerComponent={
                  <Icon name="language" color={Theme.Colors.Icon} />
                }
              />
            ) : null,
        }}>
        {!controller.isDone && (
          <RequestStack.Screen
            name="TimerBaseReceiveVcScreen"
            component={TimerBaseReceiveVcScreen}
            options={{
              title: t('incomingVc', {
                vcLabel: controller.vcLabel.singular,
              }),
            }}
          />
        )}
        <RequestStack.Screen
          name="TimerBaseRequestScreen"
          component={TimerBaseRequestScreen}
          options={{
            title: t('timerequest').toUpperCase(),
          }}
        />
      </RequestStack.Navigator>

      {controller.isAccepted && (
        <Message
          title={t('status.accepted.title')}
          message={t('status.accepted.message', {
            vcLabel: controller.vcLabel.singular,
            sender: controller.senderInfo.deviceName,
          })}
          onBackdropPress={controller.DISMISS}
        />
      )}

      {controller.isRejected && (
        <Message
          title={t('status.rejected.title')}
          message={t('status.rejected.message', {
            vcLabel: controller.vcLabel.singular,
            sender: controller.senderInfo.deviceName,
          })}
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
    </React.Fragment>
  );
};
