import React, {useTransition} from 'react';
import {Pressable} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import {Row} from '../../components/ui';
import testIDProps from '../../shared/commonUtil';
import {Theme} from '../../components/ui/styleUtils';
import {Text} from '../../components/ui';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  SETTINGS_ROUTES,
  SettingsStackParamList,
} from '../../routes/routesConstants';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';

type SettingsNavigation = NavigationProp<SettingsStackParamList>;

export const SettingsKeyManagementScreen: React.FC<
  SettingsKeyManagementScreenProps
> = props => {
  const navigation = useNavigation<SettingsNavigation>();
  const {t} = useTranslation('SetupKey');
  return (
    <React.Fragment>
      <Pressable
        accessible={false}
        {...testIDProps('keyManagement')}
        onPress={() => {
          props.controller.SET_KEY_MANAGEMENT_EXPLORED();
          navigation.navigate(SETTINGS_ROUTES.KeyManagement, {
            controller: props.controller,
          });
        }}>
        <ListItem topDivider bottomDivider>
          <Icon name="vpn-key" color={Theme.Colors.Icon} />
          <ListItem.Content>
            <ListItem.Title
              accessible={false}
              {...testIDProps('keyManagementText')}>
              <Row>
                <Text
                  testID="keyManagementText"
                  weight="semibold"
                  color={Theme.Colors.settingsLabel}
                  style={Theme.KeyManagementScreenStyle.textStyle}>
                  {t('header')}
                </Text>
                {!props.controller.isKeyManagementExplored && (
                  <LinearGradient
                    colors={Theme.Colors.GradientColors}
                    start={Theme.LinearGradientDirection.start}
                    end={Theme.LinearGradientDirection.end}
                    style={{
                      justifyContent: 'center',
                      height: 20,
                      marginTop: 10,
                    }}>
                    <Text
                      testID="newLabel"
                      style={Theme.Styles.newLabel}
                      color={Theme.Colors.whiteText}>
                      {t('NEW')}
                    </Text>
                  </LinearGradient>
                )}
              </Row>
            </ListItem.Title>
          </ListItem.Content>
          <Icon
            name="chevron-right"
            size={21}
            {...testIDProps('keyManagementChevronRight')}
            color={Theme.Colors.chevronRightColor}
            style={Theme.KeyManagementScreenStyle.iconStyle}
          />
        </ListItem>
      </Pressable>
    </React.Fragment>
  );
};

export interface SettingsKeyManagementScreenProps {
  controller: any;
}
