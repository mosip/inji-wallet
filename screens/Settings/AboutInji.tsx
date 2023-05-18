import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TouchableOpacity } from 'react-native';
import { Modal } from '../../components/ui/Modal';
import { Column, Row, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { Icon, ListItem } from 'react-native-elements';
import { Image } from 'react-native';
import { Linking } from 'react-native';
import getAllConfigurations from '../../shared/commonprops/commonProps';

export const AboutInji: React.FC<AboutInjiProps> = (props) => {
  const { t } = useTranslation('AboutInji');
  let aboutInjiUrl = '';

  const helpLink = getAllConfigurations().then((response) => {
    aboutInjiUrl = response.aboutInjiUrl;
  });

  const [showAboutInji, setShowAboutInji] = useState(false);

  return (
    <React.Fragment>
      <Pressable
        onPress={() => {
          setShowAboutInji(!showAboutInji);
        }}>
        <ListItem topDivider bottomDivider>
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
      </Pressable>
      <Modal
        isVisible={showAboutInji}
        headerTitle={t('header')}
        headerElevation={2}
        headerRight={<Icon name={''} />}
        onDismiss={() => {
          setShowAboutInji(!showAboutInji);
        }}>
        <Column fill padding="12" align="space-between">
          <Column>
            <Text style={Theme.TextStyles.aboutDetailes}>
              {t('aboutDetailes')}
            </Text>
            <Row crossAlign="center">
              <Text style={Theme.TextStyles.aboutDetailes}>
                {t('forMoreDetailes')}
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => Linking.openURL(aboutInjiUrl)}>
                <Text color={Theme.Colors.AddIdBtnBg} weight="bold">
                  {t('clickHere')}
                </Text>
              </TouchableOpacity>
            </Row>
          </Column>

          <Column
            padding="18"
            align="space-between"
            crossAlign="center"
            style={Theme.Styles.versionContainer}>
            <Text
              style={Theme.TextStyles.bold}
              color={Theme.Colors.aboutVersion}>
              {t('version')}
            </Text>
            <Text
              style={Theme.TextStyles.bold}
              color={Theme.Colors.aboutVersion}>
              {t('tuvaliVersion')}
            </Text>
          </Column>
        </Column>
      </Modal>
    </React.Fragment>
  );
};

interface AboutInjiProps {
  isVisible?: boolean;
}
