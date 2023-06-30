import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-native-simple-markdown';
import appMetaData from '../../AppMetaData.md';

import { Pressable, TouchableOpacity } from 'react-native';
import { Modal } from '../../components/ui/Modal';
import { Column, Row, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { Icon, ListItem } from 'react-native-elements';
import { Image } from 'react-native';
import { Linking } from 'react-native';
import getAllConfigurations from '../../shared/commonprops/commonProps';
import { getVersion } from 'react-native-device-info';

export const AboutInji: React.FC<AboutInjiProps> = (props) => {
  const { t } = useTranslation('AboutInji');
  let aboutInjiUrl = '';

  const helpLink = getAllConfigurations().then((response) => {
    aboutInjiUrl = response.aboutInjiUrl;
  });

  const [showAboutInji, setShowAboutInji] = useState(false);

  const dependencies = require('../../package-lock.json').dependencies;
  let packageVersion, packageCommitId;

  Object.keys(dependencies).forEach((dependencyName) => {
    const dependencyData = dependencies[dependencyName];

    if (dependencyName == 'react-native-tuvali') {
      packageVersion = dependencyData.from
        ? dependencyData.from.split('#')[1]
        : 'unknown';
      if (packageVersion != 'unknown') {
        packageCommitId = dependencyData.version.split('#')[1].substring(0, 7);
      }
    }
  });

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
            pY={25}
            align="space-between"
            crossAlign="center"
            style={Theme.Styles.versionContainer}>
            <Text
              style={Theme.TextStyles.bold}
              color={Theme.Colors.aboutVersion}>
              {t('version')}: {getVersion()}
            </Text>
            {packageVersion != 'unknown' && (
              <Text
                weight="semibold"
                margin="32 0 5 0"
                align="center"
                size="small"
                color={Theme.Colors.version}>
                {t('tuvaliVersion')}: {packageVersion + '-' + packageCommitId}
              </Text>
            )}
          </Column>
        </Column>
      </Modal>
    </React.Fragment>
  );
};

interface AboutInjiProps {
  isVisible?: boolean;
}
