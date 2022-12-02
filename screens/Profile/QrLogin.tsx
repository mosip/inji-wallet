import React from 'react';
import { Divider, Icon, ListItem, Overlay } from 'react-native-elements';
import { Button, Centered, Column, Row, Text } from '../../components/ui';
import { useTranslation } from 'react-i18next';
import { FaceScanner } from '../../components/FaceScanner';
import { useQrLogin } from './QrLoginController';
import { SafeAreaView, View, RefreshControl, Dimensions } from 'react-native';
import { ToastItem } from '../../components/ui/ToastItem';
import { VidItem } from '../../components/VidItem';
import { Modal } from '../../components/ui/Modal';
import { Theme } from '../../components/ui/styleUtils';
import { QrScanner } from '../../components/QrScanner';

export const QrLogin: React.FC = () => {
  const controller = useQrLogin();
  const { t } = useTranslation('ProfileScreen');

  return (
    <ListItem bottomDivider onPress={() => controller.setQrLogin(true)}>
      <ListItem.Content>
        <ListItem.Title>
          <Text>{'QR Login'}</Text>
        </ListItem.Title>
      </ListItem.Content>

      <Modal isVisible={controller.isQrLogin} onDismiss={controller.DISMISS}>
        <Column fill padding="32" align="space-between">
          <Centered fill>
            <Icon
              name="card-account-details-outline"
              color={Theme.Colors.Icon}
              size={30}
            />
            {controller.isQrLogin && (
              <QrScanner onQrFound={controller.showWarning} />
            )}
            <Text
              align="center"
              weight="bold"
              margin="8 0 12 0"
              style={{ fontSize: 24 }}>
              {t('title')}
            </Text>
            <Text align="center">{t('text')}</Text>
            <Text
              align="center"
              color={Theme.Colors.errorMessage}
              margin="16 0 0 0">
              {'errpr'}
            </Text>
          </Centered>
          <Column></Column>
        </Column>
      </Modal>
    </ListItem>
  );
};

interface RevokeScreenProps {
  label: string;
}
