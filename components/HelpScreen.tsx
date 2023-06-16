import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { Modal } from './ui/Modal';
import { ScrollView } from 'react-native-gesture-handler';
import { MainRouteProps } from '../routes/main';
import { Icon } from 'react-native-elements';
import { Column, Text } from './ui';
import { Theme } from './ui/styleUtils';

export const HelpScreen: React.FC<HelpScreenProps & MainRouteProps> = (
  props
) => {
  const { t } = useTranslation('HelpScreen');

  const [showHelpPage, setShowHelpPage] = useState(false);

  return (
    <React.Fragment>
      <Pressable
        onPress={() => {
          setShowHelpPage(!showHelpPage);
        }}>
        {props.triggerComponent}
      </Pressable>
      <Modal
        isVisible={showHelpPage}
        headerTitle={t('header')}
        headerElevation={2}
        onDismiss={() => {
          setShowHelpPage(!showHelpPage);
        }}>
        <ScrollView>
          <Column fill padding="10" align="space-between">
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('whatisIdDetails?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetailes}>{t('detailes')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('howToTurnOnOfflineAuthentication?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetailes}>{t('detailes')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('whatIsRevokeId?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetailes}>{t('detailes')}</Text>
            <Text margin="7" style={Theme.TextStyles.header}>
              {t('howToViewActivityLog?')}
            </Text>
            <Text style={Theme.TextStyles.helpDetailes}>{t('detailes')}</Text>
          </Column>
        </ScrollView>
      </Modal>
    </React.Fragment>
  );
};

interface HelpScreenProps {
  triggerComponent: React.ReactElement;
}
