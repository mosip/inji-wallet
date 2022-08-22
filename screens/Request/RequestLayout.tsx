import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from 'react-native-elements';
import { useTranslation } from 'react-i18next';

import { RequestScreen } from './RequestScreen';
import { useRequestLayout } from './RequestLayoutController';
import { MessageOverlay } from '../../components/MessageOverlay';
import { ReceiveVcScreen } from './ReceiveVcScreen';
import { LanguageSelector } from '../../components/LanguageSelector';
import { Colors } from '../../components/ui/styleUtils';

const RequestStack = createNativeStackNavigator();

export const RequestLayout: React.FC = () => {
  const { t } = useTranslation('RequestScreen');
  const controller = useRequestLayout();

  return (
    <React.Fragment>
      <RequestStack.Navigator
        initialRouteName="RequestScreen"
        screenOptions={{
          headerTitleAlign: 'center',
          headerRight: () => (
            <LanguageSelector
              triggerComponent={<Icon name="language" color={Colors.Orange} />}
            />
          ),
        }}>
        {!controller.isDone && (
          <RequestStack.Screen
            name="ReceiveVcScreen"
            component={ReceiveVcScreen}
            options={{
              title: t('incomingVc', {
                vcLabel: controller.vcLabel.singular,
              }),
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

      <MessageOverlay
        isVisible={controller.isAccepted}
        title={t('status.accepted.title')}
        message={t('status.accepted.message', {
          vcLabel: controller.vcLabel.singular,
          sender: controller.senderInfo.deviceName,
        })}
        onBackdropPress={controller.DISMISS}
      />

      <MessageOverlay
        isVisible={controller.isRejected}
        title={t('status.rejected.title')}
        message={t('status.rejected.message', {
          vcLabel: controller.vcLabel.singular,
          sender: controller.senderInfo.deviceName,
        })}
        onBackdropPress={controller.DISMISS}
      />

      <MessageOverlay
        isVisible={controller.isDisconnected}
        title={t('status.disconnected.title')}
        message={t('status.disconnected.message')}
        onBackdropPress={controller.DISMISS}
      />
    </React.Fragment>
  );
};
