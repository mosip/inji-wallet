import React from 'react';
import { Platform, View } from 'react-native';
import { getVersion } from 'react-native-device-info';
import { Icon, ListItem, Switch } from 'react-native-elements';
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
import { isBLEEnabled } from '../../lib/smartshare';
import { ScrollView } from 'react-native-gesture-handler';

const LanguageSetting: React.FC = () => {
  const { t } = useTranslation('ProfileScreen');
  return (
    <LanguageSelector
      triggerComponent={
        <ListItem bottomDivider>
          <Icon
            name="language"
            size={20}
            color={Theme.Colors.Icon}
            style={Theme.Styles.profileIconBg}
          />
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
  const dependencies = require('../../package-lock.json').dependencies;
  let packageVersion, packageCommitId;

  Object.keys(dependencies).forEach((dependencyName) => {
    const dependencyData = dependencies[dependencyName];

    if (dependencyName == 'react-native-openid4vp-ble') {
      packageVersion = dependencyData.from
        ? dependencyData.from.split('#')[1]
        : 'unknown';
      if (packageVersion != 'unknown') {
        packageCommitId = dependencyData.version.split('#')[1].substring(0, 7);
      }
    }
  });

  const controller = useProfileScreen(props);
  return (
    <ScrollView>
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
          Icon="user"
        />
        {/* Intentionally hidden using {display='none'} - Refer mosip/inji/issue#607 */}
        <EditableListItem
          label={t('vcLabel')}
          value={controller.vcLabel.singular}
          onEdit={controller.UPDATE_VC_LABEL}
          Icon="star"
          display="none"
        />
        <LanguageSetting />
        <Revoke label={t('revokeLabel')} Icon="rotate-left" />

        <ListItem bottomDivider disabled={!controller.canUseBiometrics}>
          <Icon
            name="fingerprint"
            type="fontawesome"
            size={20}
            style={Theme.Styles.profileIconBg}
            color={Theme.Colors.Icon}
          />
          <ListItem.Content>
            <ListItem.Title>
              <Text color={Theme.Colors.profileLabel}>{t('bioUnlock')}</Text>
            </ListItem.Title>
          </ListItem.Content>
          <Switch
            value={controller.isBiometricUnlockEnabled}
            onValueChange={controller.useBiometrics}
            trackColor={{
              false: Theme.Colors.switchTrackFalse,
              true:
                Platform.OS == 'ios'
                  ? Theme.Colors.switchHead
                  : Theme.Colors.switchTrackTrue,
            }}
            color={Theme.Colors.switchHead}
          />
        </ListItem>
        {/* Intentionally hidden using {display:'none'} - Refer mosip/inji/issue#607 */}
        <ListItem bottomDivider disabled style={{ display: 'none' }}>
          <Icon
            name="unlock"
            size={20}
            type="antdesign"
            style={Theme.Styles.profileIconBg}
            color={Theme.Colors.Icon}
          />
          <ListItem.Content>
            <ListItem.Title>
              <Text color={Theme.Colors.profileAuthFactorUnlock}>
                {t('authFactorUnlock')}
              </Text>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <Credits label={t('credits')} color={Theme.Colors.profileLabel} />
        <ListItem bottomDivider onPress={controller.LOGOUT}>
          <Icon
            name="logout"
            type="fontawesome"
            size={20}
            style={Theme.Styles.profileIconBg}
            color={Theme.Colors.Icon}
          />
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
          {isBLEEnabled ? t('useBle') : t('useGoogleNearby')}
        </Text>
        <Text
          weight="semibold"
          margin="32 0 0 0"
          align="center"
          size="smaller"
          color={Theme.Colors.profileVersion}>
          {t('version')}: {getVersion()}
        </Text>
        {packageVersion != 'unknown' && (
          <Text
            weight="semibold"
            margin="32 0 0 0"
            align="center"
            size="smaller"
            color={Theme.Colors.profileVersion}>
            {t('tuvali-version')}: {packageVersion + '-' + packageCommitId}
          </Text>
        )}
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
    </ScrollView>
  );
};
