import React, { useState } from 'react';
import { t } from 'i18next';
import { BottomSheet, Icon, ListItem } from 'react-native-elements';
import { Theme } from '../components/ui/styleUtils';
import { Centered, Column, Row, Text } from '../components/ui';
import { WalletBinding } from '../screens/Home/MyVcs/WalletBinding';
import { Pressable } from 'react-native';
import { useKebabPopUp } from './KebabPopUpController';

export const KebabPopUp: React.FC<KebabPopUpProps> = (props) => {
  const controller = useKebabPopUp(props);
  return (
    <Column>
      <Pressable onPress={() => controller.setVisible(true)}>
        <Icon
          name={props.iconName}
          type={props.iconType}
          color={Theme.Colors.GrayIcon}
        />
      </Pressable>
      <BottomSheet
        isVisible={controller.visible}
        containerStyle={Theme.KebabPopUpStyles.kebabPopUp}>
        <Row style={Theme.KebabPopUpStyles.kebabHeaderStyle}>
          <Centered></Centered>
          <Text
            weight="bold"
            style={{ ...Theme.TextStyles.base, flex: 1, alignSelf: 'center' }}>
            {t('More Options')}
          </Text>
          <Icon
            name="close"
            onPress={() => controller.setVisible(false)}
            color={Theme.Colors.Details}
            size={25}
          />
        </Row>
        <Column>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>
                <Pressable onPress={controller.PIN_CARD}>
                  <Text size="small" weight="bold">
                    {props.vcKey.split(':')[4] == 'true'
                      ? t('Unpin Card')
                      : t('Pin Card')}
                  </Text>
                </Pressable>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <WalletBinding
            label={t('Offline authentication disabled!')}
            Content={t(
              'Click here to enable the credentials to be used for offline authentication.'
            )}
            vcKey={props.vcKey}
          />
        </Column>
      </BottomSheet>
    </Column>
  );
};

interface KebabPopUpProps {
  iconName: string;
  iconType?: string;
  vcKey: string;
}
