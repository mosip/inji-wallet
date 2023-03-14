import React, { useRef, useState } from 'react';
import { t } from 'i18next';
import { BottomSheet, Icon, ListItem } from 'react-native-elements';
import { Theme } from '../components/ui/styleUtils';
import { Centered, Column, Row, Text } from '../components/ui';
import { WalletBinding } from '../screens/Home/MyVcs/WalletBinding';
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useKebabPopUp } from './KebabPopUpController';

export const KebabPopUp: React.FC<KebabPopUpProps> = (props) => {
  const { t } = useTranslation('HomeScreenKebabPopUp');
  const controller = useKebabPopUp(props);

  return (
    <Column>
      <Pressable onPress={controller.TOGGLE_KEBAB_POPUP}>
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
            {t('title')}
          </Text>
          <Icon
            name="close"
            onPress={controller.TOGGLE_KEBAB_POPUP}
            color={Theme.Colors.Details}
            size={25}
          />
        </Row>
        <Column>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>
                <Text size="small" style={Theme.TextStyles.bold}>
                  {t('UnpinCard')}
                </Text>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <WalletBinding
            label={t('offlineAuthenticationDisabled!')}
            Content={t('offlineAuthDisabledMessage')}
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
