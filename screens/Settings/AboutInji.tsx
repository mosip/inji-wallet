import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Linking, Pressable, TouchableOpacity} from 'react-native';
import {Modal} from '../../components/ui/Modal';
import {Column, Row, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {Icon, ListItem} from 'react-native-elements';
import getAllConfigurations from '../../shared/commonprops/commonProps';
import {getVersion} from 'react-native-device-info';
import {CopyButton} from '../../components/CopyButton';
import testIDProps from '../../shared/commonUtil';
import {__InjiVersion, __TuvaliVersion} from '../../shared/GlobalVariables';

export const AboutInji: React.FC<AboutInjiProps> = ({appId}) => {
  const {t} = useTranslation('AboutInji');

  const [showAboutInji, setShowAboutInji] = useState(false);
  const [aboutInjiUrl, setAboutInjiUrl] = useState('');

  useEffect(() => {
    getAllConfigurations().then(response => {
      setAboutInjiUrl(response.aboutInjiUrl);
    });
  }, []);

  return (
    <React.Fragment>
      <Pressable
        onPress={() => {
          setShowAboutInji(!showAboutInji);
        }}>
        <ListItem testID="aboutInji" topDivider bottomDivider>
          <Icon
            type={'feather'}
            name={'file'}
            color={Theme.Colors.Icon}
            size={25}
          />
          <ListItem.Content>
            <ListItem.Title
              {...testIDProps('aboutInji')}
              style={{paddingTop: 3}}>
              <Text weight="semibold" color={Theme.Colors.settingsLabel}>
                {t('aboutInji')}
              </Text>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </Pressable>
      <Modal
        testID="aboutInji"
        isVisible={showAboutInji}
        headerTitle={t('header')}
        headerElevation={2}
        headerRight={<Icon {...testIDProps('closeAboutInji')} name={''} />}
        onDismiss={() => {
          setShowAboutInji(!showAboutInji);
        }}>
        <Row testID="appID" style={Theme.Styles.primaryRow}>
          <Text style={{...Theme.TextStyles.semibold, paddingTop: 3}}>
            {t('appID')} : {appId}
          </Text>
          <CopyButton content={appId} />
        </Row>
        <Column fill padding="12" align="space-between">
          <Column>
            <Text
              testID="aboutDetails"
              style={{...Theme.TextStyles.aboutDetailes, paddingTop: 5}}>
              {t('aboutDetailes')}
            </Text>
            <Row crossAlign="center">
              <Text style={{...Theme.TextStyles.aboutDetailes, paddingTop: 7}}>
                {t('forMoreDetailes')}
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  aboutInjiUrl && Linking.openURL(aboutInjiUrl);
                }}>
                <Text
                  color={Theme.Colors.AddIdBtnBg}
                  style={{paddingTop: 3}}
                  weight="bold">
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
              style={{...Theme.TextStyles.bold, paddingTop: 3}}
              color={Theme.Colors.aboutVersion}>
              {t('version')}: {__InjiVersion.getValue()}
            </Text>
            {__TuvaliVersion.getpackageVersion() != 'unknown' && (
              <Text
                weight="semibold"
                style={{paddingTop: 3}}
                margin="32 0 5 0"
                align="center"
                size="small"
                color={Theme.Colors.aboutVersion}>
                {t('tuvaliVersion')}: {__TuvaliVersion.getValue()}
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
