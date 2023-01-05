import React from 'react';
import { View } from 'react-native';
import { getVersion } from 'react-native-device-info';
import { ListItem, Switch } from 'react-native-elements';
import { Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { MainRouteProps } from '../../routes/main';
import { EditableListItem } from '../../components/EditableListItem';
import { MessageOverlay } from '../../components/MessageOverlay';
import { Credits } from './Credits';
import { Revoke } from './Revoke';
import { useProfileScreen } from './ProfileScreenController';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../components/LanguageSelector';
import i18next, { SUPPORTED_LANGUAGES } from '../../i18n';
import { USE_BLE_SHARE } from 'react-native-dotenv';

const LanguageSetting: React.FC = () => {
  const { t } = useTranslation('ProfileScreen');

  return (
    <LanguageSelector
      triggerComponent={
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>
              <Text>{t('language')}</Text>
            </ListItem.Title>
          </ListItem.Content>
          <Text margin="0 12 0 0" color={Theme.Colors.profileLanguageValue}>
            {SUPPORTED_LANGUAGES[i18next.language]}
          </Text>
        </ListItem>
      }
    />
  );
};

export const ProfileScreen: React.FC<MainRouteProps> = (props) => {
  const { t } = useTranslation('ProfileScreen');
  const controller = useProfileScreen(props);
  return (
    <Column
      fill
      padding="24 0"
      backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
      <MessageOverlay
        isVisible={controller.alertMsg != ''}
        onBackdropPress={controller.hideAlert}
        title={controller.alertMsg}
      />
      <EditableListItem
        label={t('name')}
        value={controller.name}
        onEdit={controller.UPDATE_NAME}
      />
      <EditableListItem
        label={t('vcLabel')}
        value={controller.vcLabel.singular}
        onEdit={controller.UPDATE_VC_LABEL}
      />
      <LanguageSetting />
      <Revoke label={t('revokeLabel')} />
      <ListItem bottomDivider disabled={!controller.canUseBiometrics}>
        <ListItem.Content>
          <ListItem.Title>
            <Text color={Theme.Colors.profileLabel}>{t('bioUnlock')}</Text>
          </ListItem.Title>
        </ListItem.Content>
        <Switch
          value={controller.isBiometricUnlockEnabled}
          onValueChange={controller.useBiometrics}
          color={Theme.Colors.profileValue}
        />
      </ListItem>
      <ListItem bottomDivider disabled>
        <ListItem.Content>
          <ListItem.Title>
            <Text color={Theme.Colors.profileAuthFactorUnlock}>
              {t('authFactorUnlock')}
            </Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>
            <Text color={Theme.Colors.profileLabel}>
              {USE_BLE_SHARE === 'true' ? t('useBle') : t('useGoogleNearby')}
            </Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <Credits label={t('credits')} color={Theme.Colors.profileLabel} />
      <ListItem bottomDivider onPress={controller.LOGOUT}>
        <ListItem.Content>
          <ListItem.Title>
            <Text color={Theme.Colors.profileLabel}>{t('logout')}</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <Text
        weight="semibold"
        margin="32 0 0 0"
        align="center"
        size="smaller"
        color={Theme.Colors.profileVersion}>
        {t('version')}: {getVersion()}
      </Text>
      {controller.backendInfo.application.name !== '' ? (
        <View>
          <Text
            weight="semibold"
            align="center"
            size="smaller"
            color={Theme.Colors.profileValue}>
            {controller.backendInfo.application.name}:{' '}
            {controller.backendInfo.application.version}
          </Text>
          <Text
            weight="semibold"
            align="center"
            size="smaller"
            color={Theme.Colors.profileValue}>
            MOSIP: {controller.backendInfo.config['mosip.host']}
          </Text>
        </View>
      ) : null}
    </Column>
  );
};
