import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Column, Row, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useQrLogin } from './QrLoginController';
import { Image } from 'react-native';
import { Icon, ListItem, Switch } from 'react-native-elements';

export const QrConsent: React.FC<QrConsentProps> = (props) => {
  const { t } = useTranslation('QrScreen');
  const controller = useQrLogin();

  return (
    <Column
      fill
      align="space-evenly"
      padding="0 25 0 25"
      style={{ display: props.isVisible ? 'flex' : 'none' }}
      backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
      {controller.linkTransactionResponse && (
        <Row margin={'0 0 0 38'} crossAlign="center">
          <Icon name="mobile" type="font-awesome" size={70} />
          <Text color={'grey'} style={Theme.TextStyles.bold}>
            {' '}
            --------------{' '}
          </Text>
          {/* <Text>{controller.clientName}</Text> */}
          <Image
            source={controller.logoUrl ? { uri: controller.logoUrl } : null}
            style={{ width: 90, height: 90 }}
          />
        </Row>
      )}

      <Column backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
        <Text style={Theme.TextStyles.base} margin={'0  0 6'}>
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
              margin={'20 10 10 10'}
              styles={Theme.ButtonStyles.fill}
              title={'Confirm'}
              onPress={props.onConfirm}
            />
            <Button
              margin={'10 10 10 10'}
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
}
