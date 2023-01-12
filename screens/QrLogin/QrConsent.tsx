import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Column, Row, Text } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useQrLogin } from './QrLoginController';
import { Image } from 'react-native';
<<<<<<< HEAD:screens/QrLogin/QrConsent.tsx
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ListItem, Switch } from 'react-native-elements';
import { QrLoginRef } from '../../machines/QrLoginMachine';
=======
import { Icon, ListItem, Switch } from 'react-native-elements';
import { Modal } from '../../components/ui/Modal';
>>>>>>> upstream/qrloginfeature:screens/Profile/QrConsent.tsx

export const QrConsent: React.FC<QrConsentProps> = (props) => {
  const { t } = useTranslation('QrScreen');
  const controller = useQrLogin(props);

  return (
    <Modal
      isVisible={controller.isRequestConsent}
      arrowLeft={<Icon name={''} />}
      headerTitle={t('consent')}
      headerElevation={5}
      onDismiss={props.onCancel}>
      <Column
        fill
        align="space-between"
        padding="0 24 0 24"
        style={{ display: props.isVisible ? 'flex' : 'none' }}
        backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
        <Column>
          <Column
            align="space-evenly"
            crossAlign="center"
            margin={'15 0 0 0'}
            style={Theme.Styles.consentPageTop}
            elevation={3}>
            {controller.linkTransactionResponse && (
              <Row margin={'0 0 0 38'} crossAlign="center">
                <Icon name="mobile" type="font-awesome" size={60} />
                <Text
                  color={'grey'}
                  weight="semibold"
                  style={Theme.TextStyles.small}>
                  {' '}
                  -----------------------{' '}
                </Text>
                <Image
                  source={
                    controller.logoUrl ? { uri: controller.logoUrl } : null
                  }
                  style={{ width: 60, height: 60 }}
                />
              </Row>
            )}
            <Text
              style={Theme.TextStyles.small}
              weight="bold"
              margin={'0 0 10 6'}>
              {controller.clientName} {t('access')}
            </Text>
          </Column>

          <Column scroll padding="10 0 0 0">
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title>
                  <Text
                    color={Theme.Colors.profileLabel}
                    style={Theme.TextStyles.base}>
                    {t('Name and Picture')}
                  </Text>
                </ListItem.Title>
              </ListItem.Content>
              <Switch value={true} color={Theme.Colors.ProfileIconBg} />
            </ListItem>
            {controller.claims.map((claim, index) => {
              if (claim == 'name' || claim == 'picture') {
                return null;
              } else {
                let L = claim.length();
                return (
                  <ListItem key={index} bottomDivider>
                    <ListItem.Content>
                      <ListItem.Title>
                        <Text color={Theme.Colors.profileLabel}>
                          {t(claim[0]).toUpperCase() +
                            claim.split(claim[1], claim[L - 1]).toLowerCase()}
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
        </Column>
        <Column
          margin={'0 -20 0 -20'}
          style={Theme.Styles.bottomButtonsContainer}
          elevation={5}>
          <Button
            margin={'6 10 0 10'}
            styles={Theme.ButtonStyles.radius}
            title={'Confirm'}
            onPress={props.onConfirm}
          />
          <Button
            margin={'10 10 0 10'}
            type="clear"
            title={'Cancel'}
            onPress={props.onCancel}
          />
        </Column>
      </Column>
    </Modal>
  );
};

interface QrConsentProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  service: QrLoginRef;
}
