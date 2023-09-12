import React from 'react';
import { Platform, Pressable, View, Image } from 'react-native';
import { Icon, ListItem, Switch } from 'react-native-elements';
import { Column, Row, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { MessageOverlay } from '../../components/MessageOverlay';

import { useSettingsScreen } from './SettingScreenController';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../../components/LanguageSelector';
import { ScrollView } from 'react-native-gesture-handler';
import { Modal } from '../../components/ui/Modal';
import { CREDENTIAL_REGISTRY_EDIT } from 'react-native-dotenv';
import { AboutInji } from './AboutInji';
import { EditableListItem } from '../../components/EditableListItem';
import { RequestRouteProps, RootRouteProps } from '../../routes';
import { ReceivedCards } from './ReceivedCards';
import testIDProps from '../../shared/commonUtil';

const LanguageSetting: React.FC = () => {
  const { t } = useTranslation('SettingScreen');

  return (
    <LanguageSelector
      triggerComponent={
        <ListItem testID="language">
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

export const SettingScreen: React.FC<
  SettingProps & RootRouteProps & RequestRouteProps
> = (props) => {
  const { t } = useTranslation('SettingScreen');
  const controller = useSettingsScreen(props);

  return (
    <React.Fragment>
      <Pressable onPress={controller.TOGGLE_SETTINGS}>
        {props.triggerComponent}
      </Pressable>
      <Modal
        testID="settingsScreen"
        isVisible={controller.isVisible}
        arrowLeft={<Icon name={''} />}
        headerTitle={t('header')}
        headerElevation={2}
        onDismiss={controller.TOGGLE_SETTINGS}>
        <ScrollView>
          <Column
            style={{ display: Platform.OS !== 'ios' ? 'flex' : 'none' }}
            backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
            <Text
              testID="injiAsVerifierApp"
              weight="semibold"
              margin="10"
              color={Theme.Colors.aboutVersion}>
              {t('injiAsVerifierApp')}
            </Text>
            <Row
              align="space-evenly"
              backgroundColor={Theme.Colors.whiteBackgroundColor}>
              <Pressable onPress={controller.RECEIVE_CARD}>
                <Column
                  testID="receiveCard"
                  style={Theme.Styles.receiveCardsContainer}>
                  <Image
                    source={Theme.ReceiveCardIcon}
                    style={{ alignSelf: 'center' }}
                  />
                  <Text margin="6" weight="semibold">
                    {t('receiveCard')}
                  </Text>
                </Column>
              </Pressable>

              <ReceivedCards />
            </Row>

            <Text
              weight="semibold"
              margin="10"
              color={Theme.Colors.aboutVersion}>
              {t('basicSettings')}
            </Text>
          </Column>
          <Column fill>
            <MessageOverlay
              isVisible={controller.alertMsg != ''}
              onBackdropPress={controller.hideAlert}
              title={controller.alertMsg}
            />

            <LanguageSetting />

            <ListItem
              {...testIDProps('bioUnlock')}
              topDivider
              disabled={!controller.canUseBiometrics}>
              <Icon
                type={'MaterialCommunityIcons'}
                name={'fingerprint'}
                color={Theme.Colors.Icon}
                size={25}
                style={{ marginRight: 15 }}
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

            <AboutInji appId={controller.appId} />

            {CREDENTIAL_REGISTRY_EDIT === 'true' && (
              <EditableListItem
                label={t('credentialRegistry')}
                value={controller.credentialRegistry}
                credentialRegistryResponse={
                  controller.credentialRegistryResponse
                }
                onCancel={controller.CANCEL}
                onEdit={controller.UPDATE_CREDENTIAL_REGISTRY}
                Icon="star"
                errorMessage={t('errorMessage')}
                progress={controller.isResetInjiProps}
              />
            )}

            <ListItem
              {...testIDProps('injiTourGuide')}
              topDivider
              bottomDivider
              onPress={() => controller.INJI_TOUR_GUIDE()}>
              <Icon
                type={'antdesign'}
                name={'book'}
                color={Theme.Colors.Icon}
                size={25}
                style={{ marginRight: 15 }}
              />
              <ListItem.Content>
                <ListItem.Title>
                  <Text weight="semibold" color={Theme.Colors.profileLabel}>
                    {t('injiTourGuide')}
                  </Text>
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>

            <ListItem {...testIDProps('logout')} onPress={controller.LOGOUT}>
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
  testID?: string;
  triggerComponent: React.ReactElement;
}
