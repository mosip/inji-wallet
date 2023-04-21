import React, { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import { getVersion } from 'react-native-device-info';
import { Icon, ListItem, Switch } from 'react-native-elements';
import { Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { MainRouteProps } from '../../routes/main';
import { EditableListItem } from '../../components/EditableListItem';
import { MessageOverlay } from '../../components/MessageOverlay';
import { Credits } from './Credits';
import { Revoke } from './Revoke';
import { Image } from 'react-native';
import { useSettingsScreen } from './SettingScreenController';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../components/LanguageSelector';
import i18next, { SUPPORTED_LANGUAGES } from '../../i18n';
import { ScrollView } from 'react-native-gesture-handler';
import { Modal } from '../../components/ui/Modal';
import getAllConfigurations from '../../shared/commonprops/commonProps';

const LanguageSetting: React.FC = () => {
  const { t } = useTranslation('SettingScreen');

  return (
    <LanguageSelector
      triggerComponent={
        <ListItem bottomDivider topDivider>
          <Icon
            name="globe"
            size={22}
            type="simple-line-icon"
            color={Theme.Colors.Icon}
            containerStyle={Theme.Styles.settingsIconBg}
          />
          <ListItem.Content>
            <ListItem.Title>
              <Text weight="semibold">{t('language')}</Text>
            </ListItem.Title>
          </ListItem.Content>
          <Icon
            name="chevron-right"
            size={21}
            color={Theme.Colors.profileLanguageValue}
            style={{ marginRight: 15 }}
          />
        </ListItem>
      }
    />
  );
};

let helpUrl = '';

let helpPage = getAllConfigurations().then((response) => {
  helpUrl = response.helpUrl;
});

export const SettingScreen: React.FC<SettingProps & MainRouteProps> = (
  props
) => {
  const { t } = useTranslation('SettingScreen');
  const controller = useSettingsScreen(props);

  return (
    <React.Fragment>
      <Pressable onPress={controller.TOGGLE_SETTINGS}>
        {props.triggerComponent}
      </Pressable>
      <Modal
        isVisible={controller.isVisible}
        arrowLeft={<Icon name={''} />}
        headerTitle={t('header')}
        headerElevation={2}
        onDismiss={controller.TOGGLE_SETTINGS}>
        <ScrollView>
          <Column fill backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
            <MessageOverlay
              isVisible={controller.alertMsg != ''}
              onBackdropPress={controller.hideAlert}
              title={controller.alertMsg}
            />

            <LanguageSetting />

            <ListItem
              topDivider
              bottomDivider
              disabled={!controller.canUseBiometrics}>
              <Image
                source={require('../../assets/biometric-unlock-icon.png')}
                style={{ marginLeft: 10, marginRight: 9 }}
              />
              <ListItem.Content>
                <ListItem.Title>
                  <Text weight="semibold" color={Theme.Colors.profileLabel}>
                    {t('bioUnlock')}
                  </Text>
                </ListItem.Title>
              </ListItem.Content>
              <Switch
                value={controller.isBiometricUnlockEnabled}
                onValueChange={controller.useBiometrics}
                color={Theme.Colors.profileValue}
              />
            </ListItem>

            <ListItem
              topDivider
              bottomDivider
              onPress={() => {
                Linking.openURL(helpUrl);
              }}>
              <Image
                source={require('../../assets/legal-notices-icon.png')}
                style={{ marginLeft: 10, marginRight: 9 }}
              />
              <ListItem.Content>
                <ListItem.Title>
                  <Text weight="semibold" color={Theme.Colors.profileLabel}>
                    {t('aboutInji')}
                  </Text>
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>

            <ListItem
              topDivider
              onPress={() => {
                Linking.openURL(helpUrl);
              }}>
              <Image
                source={require('../../assets/features-walkaround-icon.png')}
                style={{ marginLeft: 10, marginRight: 9 }}
              />
              <ListItem.Content>
                <ListItem.Title>
                  <Text weight="semibold" color={Theme.Colors.profileLabel}>
                    {t('injiTourGuide')}
                  </Text>
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>

            <ListItem topDivider onPress={controller.LOGOUT}>
              <Icon
                name="logout"
                type="fontawesome"
                size={22}
                color={Theme.Colors.Icon}
                containerStyle={Theme.Styles.settingsIconBg}
              />
              <ListItem.Content>
                <ListItem.Title>
                  <Text weight="semibold" color={Theme.Colors.profileLabel}>
                    {t('logout')}
                  </Text>
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
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
      </Modal>
    </React.Fragment>
  );
};

interface SettingProps {
  triggerComponent: React.ReactElement;
}
