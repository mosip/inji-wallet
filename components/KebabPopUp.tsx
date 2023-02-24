import React, { useRef, useState } from 'react';
import { t } from 'i18next';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { BottomSheet, Icon, ListItem } from 'react-native-elements';
import { Theme } from '../components/ui/styleUtils';
import { Button } from '../components/ui/Button';
import { Column, Row, Text } from '../components/ui';

export const KebabPopUpMenu: React.FC<KebabPopUpMenuProps> = (props) => {
  const [visible, setVisible] = useState(false);

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
            {t('More Options')}
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
        <Column>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>
                <Text size="small" style={Theme.TextStyles.bold}>
                  {t('Unpin Card')}
                </Text>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>
                <Text size="small" style={Theme.TextStyles.bold}>
                  {t('offlineAuthenticationDisabled!')}
                </Text>
              </ListItem.Title>
              <Text
                weight="bold"
                color={Theme.Colors.profileValue}
                size="smaller">
                {t(
                  'Click here to enable the credentials to be used for offline authentication.'
                )}
              </Text>
            </ListItem.Content>
          </ListItem>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>
                <Text size="small" style={Theme.TextStyles.bold}>
                  {t('View Activity Log')}
                </Text>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>
                <Text size="small" style={Theme.TextStyles.bold}>
                  {t('Remove from Wallet')}
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
                  {t('Revoke ID')}
                </Text>
              </ListItem.Title>
              <Text
                weight="bold"
                color={Theme.Colors.profileValue}
                size="smaller">
                {t('Revoke the virtual ID for this profile')}
              </Text>
            </ListItem.Content>
          </ListItem>
        </Column>
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
