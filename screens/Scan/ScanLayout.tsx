import React from 'react';
import { useTranslation } from 'react-i18next';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from 'react-native-elements';

import { Theme } from '../../components/ui/styleUtils';
import { SendVcScreen } from './SendVcScreen';
import { useScanLayout } from './ScanLayoutController';
import { LanguageSelector } from '../../components/LanguageSelector';
import { ScanScreen } from './ScanScreen';
import { I18nManager, Platform } from 'react-native';
import { Message } from '../../components/Message';
import { InProgress } from '../../components/InProgress';

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
            component={ScanScreen}
            options={{
              title: t('sharingVc', {
                vcLabel: controller.vcLabel.singular,
              }),
            }}
          />
        )}
        <ScanStack.Screen
          name="ScanScreen"
          component={SendVcScreen}
          options={{
            headerTitleStyle: { fontSize: 30, fontFamily: 'Inter_600SemiBold' },
            title: t('MainLayout:scan'),
          }}
        />
      </ScanStack.Navigator>

      <InProgress
        title={controller.statusOverlay?.hint}
        isVisible={controller.statusOverlay != null}
        label={controller.statusOverlay?.message}
        onCancel={controller.statusOverlay?.onCancel}
      />

      {controller.isDisconnected && (
        <Message
          title={t('RequestScreen:status.disconnected.title')}
          message={t('RequestScreen:status.disconnected.message')}
          onBackdropPress={controller.DISMISS}
        />
      )}
    </React.Fragment>
  );
};
