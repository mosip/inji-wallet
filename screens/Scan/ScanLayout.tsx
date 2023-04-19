import React from 'react';
import { useTranslation } from 'react-i18next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from 'react-native-elements';

import { Theme } from '../../components/ui/styleUtils';
import { SendVcScreen } from './SendVcScreen';
import { useScanLayout } from './ScanLayoutController';
import { ScanScreen } from './ScanScreen';
import { I18nManager, Platform } from 'react-native';
import { ProgressingModal } from '../../components/ProgressingModal';
import { MessageOverlay } from '../../components/MessageOverlay';

const ScanStack = createNativeStackNavigator();

export const ScanLayout: React.FC = () => {
  const { t } = useTranslation('ScanScreen');
  const controller = useScanLayout();

  return (
    <React.Fragment>
      <ScanStack.Navigator
        initialRouteName="ScanScreen"
        screenOptions={{
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
          <ScanStack.Screen
            name="SendVcScreen"
            component={SendVcScreen}
            options={{
              title: t('requester', {
                vcLabel: controller.vcLabel.singular,
              }),
              headerBackVisible: false,
            }}
          />
        )}
        <ScanStack.Screen
          name="ScanScreen"
          component={ScanScreen}
          options={{
            headerTitleStyle: { fontSize: 30, fontFamily: 'Inter_600SemiBold' },
            title: t('MainLayout:scan'),
          }}
        />
      </ScanStack.Navigator>

      <ProgressingModal
        isVisible={controller.statusOverlay != null}
        title={controller.statusOverlay?.title}
        timeoutHint={controller.statusOverlay?.hint}
        isVisible={controller.statusOverlay != null}
        title={controller.statusOverlay?.title}
        timeoutHint={controller.statusOverlay?.hint}
        label={controller.statusOverlay?.message}
        onCancel={controller.statusOverlay?.onCancel}
        progress={controller.statusOverlay?.progress}
        onBackdropPress={controller.statusOverlay?.onBackdropPress}
        requester={controller.statusOverlay?.requester}
      />

      {controller.isDisconnected && (
        <MessageOverlay
          isVisible={controller.isDisconnected}
          title={t('RequestScreen:status.disconnected.title')}
          message={t('RequestScreen:status.disconnected.message')}
          onBackdropPress={controller.DISMISS}
        />
      )}
    </React.Fragment>
  );
};
