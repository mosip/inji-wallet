import React, {useState} from 'react';
import Markdown from 'react-native-simple-markdown';
import {useTranslation} from 'react-i18next';
import {I18nManager, SafeAreaView, View} from 'react-native';
import {Divider, Icon, ListItem, Overlay} from 'react-native-elements';

import {Button, Text, Row} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import appMetaData from '../../AppMetaData.md';
import {__InjiVersion, __TuvaliVersion} from '../../shared/GlobalVariables';

export const AppMetaData: React.FC<AppMetaDataProps> = props => {
  const {t} = useTranslation('AppMetaData');
  const [isViewing, setIsViewing] = useState(false);

  const markdownStyles = {
    text: {
      fontSize: 18,
    },
    view: {
      flex: 1,
    },
  };

  return (
    <ListItem bottomDivider onPress={() => setIsViewing(true)}>
      <Icon
        name="filetext1"
        type="antdesign"
        size={20}
        style={Theme.Styles.profileIconBg}
        color={Theme.Colors.Icon}
      />
      <ListItem.Content>
        <ListItem.Title>
          <Text color={props.color}>{props.label}</Text>
        </ListItem.Title>
      </ListItem.Content>
      <Overlay
        overlayStyle={{padding: 24}}
        isVisible={isViewing}
        onBackdropPress={() => setIsViewing(false)}>
        <SafeAreaView>
          <View style={Theme.AppMetaDataStyles.view}>
            <Row align="center" crossAlign="center" margin="0 0 10 0">
              <View style={Theme.AppMetaDataStyles.buttonContainer}>
                <Button
                  type="clear"
                  icon={
                    <Icon
                      name={
                        I18nManager.isRTL ? 'chevron-right' : 'chevron-left'
                      }
                      color={Theme.Colors.Icon}
                    />
                  }
                  title=""
                  onPress={() => setIsViewing(false)}
                />
              </View>
              <Text style={Theme.AppMetaDataStyles.header}>
                {t('header').toUpperCase()}
              </Text>
            </Row>
            <Divider />
            <View style={Theme.AppMetaDataStyles.contentView}>
              <Markdown styles={markdownStyles}>{appMetaData}</Markdown>
              <View style={Theme.FooterStyles.bottom}>
                <Text
                  weight="semibold"
                  margin="5 0 0 0"
                  align="center"
                  size="small"
                  color={Theme.Colors.version}>
                  {t('version')}: {__InjiVersion.getValue()}
                </Text>
                {__TuvaliVersion.getpackageVersion() != 'unknown' && (
                  <Text
                    weight="semibold"
                    margin="32 0 5 0"
                    align="center"
                    size="small"
                    color={Theme.Colors.version}>
                    {t('Tuvali-version')}: {__TuvaliVersion.getValue()}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Overlay>
    </ListItem>
  );
};

interface AppMetaDataProps {
  label: string;
  color?: string;
}
