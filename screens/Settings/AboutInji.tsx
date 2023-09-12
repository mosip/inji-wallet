import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Linking, Pressable, TouchableOpacity } from 'react-native';
import { Modal } from '../../components/ui/Modal';
import { Column, Row, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { Icon, ListItem } from 'react-native-elements';
import getAllConfigurations from '../../shared/commonprops/commonProps';
import { getVersion } from 'react-native-device-info';
import { CopyButton } from '../../components/CopyButton';

export const AboutInji: React.FC<AboutInjiProps> = ({ appId }) => {
  const { t } = useTranslation('AboutInji');

  const [showAboutInji, setShowAboutInji] = useState(false);
  const [aboutInjiUrl, setAboutInjiUrl] = useState('');

  useEffect(() => {
    getAllConfigurations().then((response) => {
      setAboutInjiUrl(response.aboutInjiUrl);
    });
  }, []);

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
          <Icon
            type={'feather'}
            name={'file'}
            color={Theme.Colors.Icon}
            size={25}
            style={{ marginRight: 15 }}
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
        <Row style={Theme.Styles.primaryRow}>
          <Text style={Theme.TextStyles.semibold}>
            {t('appID')} : {appId}
          </Text>
          <CopyButton content={appId} />
        </Row>
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
                onPress={() => {
                  aboutInjiUrl && Linking.openURL(aboutInjiUrl);
                }}>
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
                color={Theme.Colors.aboutVersion}>
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
  appId?: string;
}
