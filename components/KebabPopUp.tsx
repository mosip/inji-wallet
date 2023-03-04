import React, { useRef, useState } from 'react';
import { t } from 'i18next';
import { BottomSheet, Icon, ListItem } from 'react-native-elements';
import { Theme } from '../components/ui/styleUtils';
import { Centered, Column, Row, Text } from '../components/ui';
import { WalletBinding } from '../screens/Home/MyVcs/WalletBinding';

export const KebabPopUpMenu: React.FC<KebabPopUpMenuProps> = (props) => {
  return (
    <BottomSheet
      isVisible={props.isVisible}
      containerStyle={{
        backgroundColor: 'transparent',
        elevation: 4,
        marginHorizontal: 4,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      }}>
      <Row
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 24,
          padding: 18,
          justifyContent: 'space-between',
        }}>
        <Centered></Centered>
        <Text
          weight="bold"
          style={{ ...Theme.TextStyles.base, flex: 1, alignSelf: 'center' }}>
          {t('More Options')}
        </Text>
        <Icon
          name="close"
          onPress={props.close}
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

        <WalletBinding
          label={t('Offline authentication disabled!')}
          Content={t(
            'Click here to enable the credentials to be used for offline authentication.'
          )}
        />
      </Column>
    </BottomSheet>
  );
};

interface KebabPopUpMenuProps {
  isVisible: boolean;
  close: () => void;
}
