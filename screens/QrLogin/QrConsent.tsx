import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Column, Row, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useQrLogin } from './QrLoginController';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ListItem, Switch } from 'react-native-elements';
import { QrLoginRef } from '../../machines/QrLoginMachine';

export const QrConsent: React.FC<QrConsentProps> = (props) => {
  const { t } = useTranslation('QrScreen');
  const controller = useQrLogin(props);

  return (
    <Column
      fill
      align="space-evenly"
      padding="0 25 0 25"
      style={{ display: props.isVisible ? 'flex' : 'none' }}
      backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
      {controller.linkTransactionResponse && (
        <Row align="space-between" crossAlign="center">
          <Image
            source={controller.logoUrl ? { uri: controller.logoUrl } : null}
            style={{ width: 100, height: 100 }}
          />
          <Icon name="sync" size={50} color={Theme.Colors.Icon} />

          <Text>{controller.clientName}</Text>
        </Row>
      )}

      <Column backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
        <Text weight="semibold">
          {controller.clientName} {t('access')}
        </Text>

        <Column scroll padding="10 0 0 0">
          <Column scroll>
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title>
                  <Text color={Theme.Colors.profileLabel}>
                    {t('Name and Picture')}
                  </Text>
                </ListItem.Title>
              </ListItem.Content>
              <Switch value={true} color={Theme.Colors.Icon} disabled />
            </ListItem>
            {controller.claims.map((claim, index) => {
              if (claim == 'name' || claim == 'picture') {
                return null;
              } else {
                return (
                  <ListItem key={index} bottomDivider>
                    <ListItem.Content>
                      <ListItem.Title>
                        <Text color={Theme.Colors.profileLabel}>
                          {t(claim).toUpperCase()}
                        </Text>
                      </ListItem.Title>
                    </ListItem.Content>

                    <Switch
                      value={controller.isShare[claim]}
                      onValueChange={() =>
                        controller.SELECT_CONSENT(
                          controller.isShare[claim],
                          claim
                        )
                      }
                      color={Theme.Colors.Icon}
                    />
                  </ListItem>
                );
              }
            })}
          </Column>
          <Column>
            <Button
              margin={'10 0 0 0'}
              styles={Theme.ButtonStyles.fill}
              title={'Confirm'}
              onPress={props.onConfirm}
            />
            <Button
              margin={'10 0 10 0'}
              type="outline"
              title={'Cancel'}
              onPress={props.onCancel}
            />
          </Column>
        </Column>
      </Column>
    </Column>
  );
};

interface QrConsentProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  service: QrLoginRef;
}
