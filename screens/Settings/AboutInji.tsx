import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Dimensions, Linking, Pressable, TouchableOpacity} from 'react-native';
import {Modal} from '../../components/ui/Modal';
import {Column, Row, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {Icon, ListItem} from 'react-native-elements';
import getAllConfigurations from '../../shared/commonprops/commonProps';
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
            style={{marginRight: 15}}
          />
          <ListItem.Content>
            <ListItem.Title style={{paddingTop: 3}}>
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
          <Row>
            <Text
              style={{
                ...Theme.TextStyles.semibold,
                paddingTop: 3,
                maxWidth: 110,
              }}>
              {t('appID')}
            </Text>
            <Text
              style={{
                ...Theme.TextStyles.semibold,
                paddingTop: 3,
              }}>
              : {appId}
            </Text>
          </Row>
          <CopyButton content={appId} />
        </Row>
        <Column padding="12" align="space-between">
          <Column>
            <Text
              testID="aboutDetails"
              style={{...Theme.TextStyles.aboutDetailes, paddingTop: 5}}>
              {t('aboutDetailes')}
            </Text>
            <Row
              align="space-between"
              crossAlign="center"
              style={{
                maxWidth: Dimensions.get('window').width * 0.94,
                minHeight: Dimensions.get('window').height * 0.1,
              }}>
              <Text
                style={{
                  ...Theme.TextStyles.aboutDetailes,
                  paddingTop: 7,
                  maxWidth: 150,
                }}>
                {t('forMoreDetailes')}
              </Text>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  aboutInjiUrl && Linking.openURL(aboutInjiUrl);
                }}>
                <Text
                  color={Theme.Colors.AddIdBtnBg}
                  style={{paddingTop: 3, maxWidth: 150}}
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
