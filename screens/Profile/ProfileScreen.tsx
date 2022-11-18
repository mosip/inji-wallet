import React from 'react';
import { ListItem, Switch } from 'react-native-elements';
import { useTranslation } from 'react-i18next';

import i18next, { SUPPORTED_LANGUAGES } from '../../i18n';
import { Column, Text } from '../../components/ui';
<<<<<<< HEAD
import { Theme } from '../../components/ui/styleUtils';
import { MainRouteProps } from '../../routes/main';
=======
import { Colors } from '../../components/ui/styleUtils';
>>>>>>> parent of 3953be2 (Revert "feat: add transaction history")
import { EditableListItem } from '../../components/EditableListItem';
import { MessageOverlay } from '../../components/MessageOverlay';
import {
  ProfileScreenProps,
  useProfileScreen,
} from './ProfileScreenController';
import { LanguageSelector } from '../../components/LanguageSelector';

export const ProfileScreen: React.FC<ProfileScreenProps> = (props) => {
  const { t } = useTranslation('ProfileLayout');
  const controller = useProfileScreen(props);

  return (
    <React.Fragment>
      <Column fill padding="24 0" backgroundColor={Colors.LightGrey}>
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

        <ListItem
          bottomDivider
          onPress={() => props.navigation.navigate('RevokeScreen')}>
          <ListItem.Content>
            <ListItem.Title>
              <Text>{t('revokeScreen.title')}</Text>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>

        <ListItem bottomDivider disabled={!controller.canUseBiometrics}>
          <ListItem.Content>
            <ListItem.Title>
              <Text>{t('bioUnlock')}</Text>
            </ListItem.Title>
          </ListItem.Content>
          <Switch
            value={controller.isBiometricUnlockEnabled}
            onValueChange={controller.useBiometrics}
            color={Colors.Orange}
          />
        </ListItem>

        <ListItem
          bottomDivider
          onPress={() => props.navigation.navigate('TransactionHistoryScreen')}>
          <ListItem.Content>
            <ListItem.Title>
              <Text>{t('transactionHistoryScreen.title')}</Text>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>

        <ListItem bottomDivider disabled>
          <ListItem.Content>
            <ListItem.Title>
              <Text color={Colors.Grey}>{t('authFactorUnlock')}</Text>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>

        <ListItem
          bottomDivider
          onPress={() => props.navigation.navigate('CreditsScreen')}>
          <ListItem.Content>
            <ListItem.Title>
              <Text>{t('creditsScreen.title')}</Text>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>

        <ListItem bottomDivider onPress={controller.LOGOUT}>
          <ListItem.Content>
            <ListItem.Title>
              <Text>{t('logout')}</Text>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </Column>

      <MessageOverlay
        isVisible={controller.alertMsg != ''}
        onBackdropPress={controller.hideAlert}
        title={controller.alertMsg}
      />
    </React.Fragment>
  );
};

const LanguageSetting: React.FC = () => {
  const { t } = useTranslation('ProfileLayout');

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
<<<<<<< HEAD

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
        Version: {getVersion()}
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
=======
>>>>>>> parent of 3953be2 (Revert "feat: add transaction history")
