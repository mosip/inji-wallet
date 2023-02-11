import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { getVersion } from 'react-native-device-info';
import { Icon, ListItem, Switch } from 'react-native-elements';
import { Column, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { MainRouteProps } from '../../routes/main';
import { EditableListItem } from '../../components/EditableListItem';
import { MessageOverlay } from '../../components/MessageOverlay';
import { Credits } from './Credits';
import { Revoke } from './Revoke';
import { useProfileScreen } from './SettingScreenController';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../components/LanguageSelector';
import i18next, { SUPPORTED_LANGUAGES } from '../../i18n';
import { ScrollView } from 'react-native-gesture-handler';
import { Modal } from '../../components/ui/Modal';

const LanguageSetting: React.FC = () => {
  const { t } = useTranslation('SettingScreen');

  return (
    <LanguageSelector
      triggerComponent={
        <ListItem bottomDivider>
          <Icon
            name="globe"
            size={22}
            type="simple-line-icon"
            color={Theme.Colors.Icon}
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

export const SettingScreen: React.FC<SettingProps & MainRouteProps> = (
  props
) => {
  const { t } = useTranslation('SettingScreen');
  const controller = useProfileScreen(props);

  const [isContentVisible, setIsContentVisible] = useState(false);
  const toggleContent = () => setIsContentVisible(!isContentVisible);

  return (
    <React.Fragment>
      <Pressable onPress={toggleContent}>{props.triggerComponent}</Pressable>
      <Modal
        isVisible={isContentVisible}
        arrowLeft={<Icon name={''} />}
        headerTitle={t('header')}
        headerElevation={2}
        onDismiss={toggleContent}>
        <ScrollView>
          <Column fill backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
            <MessageOverlay
              isVisible={controller.alertMsg != ''}
              onBackdropPress={controller.hideAlert}
              title={controller.alertMsg}
            />
            <EditableListItem
              label={t('profile')}
              value={controller.name}
              onEdit={controller.UPDATE_NAME}
              Icon="user"
              IconType="ant-design"
            />
            <EditableListItem
              label={t('vcLabel')}
              value={controller.vcLabel.singular}
              onEdit={controller.UPDATE_VC_LABEL}
              Icon="star"
              IconType="simple-line-icon"
            />
            <LanguageSetting />

            <ListItem bottomDivider disabled={!controller.canUseBiometrics}>
              <Icon name="fingerprint" size={22} color={Theme.Colors.Icon} />
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
            <ListItem onPress={controller.LOGOUT}>
              <Icon
                name="logout"
                type="fontawesome"
                size={22}
                color={Theme.Colors.Icon}
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
