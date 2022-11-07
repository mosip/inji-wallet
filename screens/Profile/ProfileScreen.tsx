import React from 'react';
import { ListItem, Switch } from 'react-native-elements';
import { useTranslation } from 'react-i18next';

import i18next, { SUPPORTED_LANGUAGES } from '../../i18n';
import { Column, Text } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
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
          <Text margin="0 12 0 0" color={Colors.Grey}>
            {SUPPORTED_LANGUAGES[i18next.language]}
          </Text>
        </ListItem>
      }
    />
  );
};
