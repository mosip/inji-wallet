import React, { useRef, useState } from 'react';
import { t } from 'i18next';
import { Pressable } from 'react-native';
import { BottomSheet, Icon, ListItem } from 'react-native-elements';
import { Theme } from '../components/ui/styleUtils';
import { Button } from '../components/ui/Button';
import { Column, Row, Text } from '../components/ui';
import { useTranslation } from 'react-i18next';

export const KebabPopUpMenu: React.FC<KebabPopUpMenuProps> = (props) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation('HomeScreenKebabPopUp');

  return (
    <Column>
      <Pressable
        onPress={() => {
          setVisible(true);
        }}>
        <Icon
          name={props.iconName}
          type={props.iconType ? props.iconType : null}
          color={Theme.Colors.GrayIcon}
        />
      </Pressable>
      <BottomSheet
        isVisible={visible}
        containerStyle={Theme.MessageOverlayStyles.kebabPopUp}>
        <Row style={Theme.MessageOverlayStyles.kebabHeaderStyle}>
          <Text weight="bold" style={Theme.TextStyles.base}>
            {t('title')}
          </Text>
          <Icon
            name="close"
            onPress={() => {
              setVisible(false);
            }}
            color={Theme.Colors.Details}
            size={25}
          />
        </Row>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>
              <Text size="small" style={Theme.TextStyles.bold}>
                {t('UnpinCard')}
              </Text>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>
              <Text size="small" style={Theme.TextStyles.bold}>
                {true
                  ? t('offlineAuthenticationDisabled!')
                  : t('profileAuthenticated')}
              </Text>
            </ListItem.Title>
            <Text
              weight="bold"
              color={Theme.Colors.profileValue}
              size="smaller">
              {true ? t('offlineAuthDisabledMessage') : null}
            </Text>
          </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>
              <Text size="small" style={Theme.TextStyles.bold}>
                {t('ViewActivityLog')}
              </Text>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>
              <Text size="small" style={Theme.TextStyles.bold}>
                {t('RemoveFromWallet')}
              </Text>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>
              <Text
                color={Theme.Colors.errorMessage}
                size="small"
                style={Theme.TextStyles.bold}>
                {t('RevokeID')}
              </Text>
            </ListItem.Title>
            <Text
              weight="bold"
              color={Theme.Colors.profileValue}
              size="smaller">
              {t('RevokeMessage')}
            </Text>
          </ListItem.Content>
        </ListItem>
      </BottomSheet>
    </Column>
  );
};

interface KebabPopUpMenuProps {
  iconName: string;
  iconType?: string;
  isBindingPending: boolean;
  onBinding?: () => void;
}
