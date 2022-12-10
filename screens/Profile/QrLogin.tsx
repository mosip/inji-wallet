import React from 'react';
import { ListItem } from 'react-native-elements';
import { Button, Column, Row, Text } from '../../components/ui';
import { useTranslation } from 'react-i18next';
import { useQrLogin } from './QrLoginController';
import { Modal } from '../../components/ui/Modal';
import { QrScanner } from '../../components/QrScanner';
import { VerifyIdentityOverlay } from '../VerifyIdentityOverlay';
import { MessageOverlay } from '../../components/MessageOverlay';
import { MyBindedVcs } from './MyBindedVcs';
import { QrLoginWarning } from './QrLoginWarning';
import { QrLoginSuccess } from './QrLoginSuccessMessage';

export const QrLogin: React.FC = () => {
  const controller = useQrLogin();
  const { t } = useTranslation('QrScreen');

  return (
    <ListItem
      bottomDivider
      onPress={() => {
        controller.setQrLogin(true);
      }}>
      <ListItem.Content>
        <ListItem.Title>
          <Text>{t('title')}</Text>
        </ListItem.Title>
      </ListItem.Content>

      <Modal
        isVisible={controller.isQrLogin}
        onDismiss={() => {
          controller.setQrLogin(false), controller.DISMISS();
        }}>
        <Column fill>
          {controller.isScanningQr && (
            <Column fill padding="32" align="space-between">
              <QrScanner
                onQrFound={controller.SCANNING_DONE}
                title={'Scan the QR Code to initiate the login'}
              />
            </Column>
          )}

          <QrLoginWarning isVisible={controller.isShowWarning} />

          <MessageOverlay
            isVisible={controller.isLoadingVc}
            title={t('loadingVc')}
            progress
          />

          <MyBindedVcs isVisible={controller.isShowingVcList} />

          <VerifyIdentityOverlay
            isVisible={controller.isVerifyingIdentity}
            vc={controller.selectedVc}
            onCancel={controller.CANCEL}
            onFaceValid={controller.FACE_VALID}
            onFaceInvalid={controller.FACE_INVALID}
          />

          <MessageOverlay
            isVisible={controller.isInvalidIdentity}
            title={t('VerifyIdentityOverlay:errors.invalidIdentity.title')}
            message={t('VerifyIdentityOverlay:errors.invalidIdentity.message')}
            onBackdropPress={controller.DISMISS}>
            <Row>
              <Button
                fill
                type="clear"
                title={t('common:cancel')}
                onPress={controller.DISMISS}
                margin={[0, 8, 0, 0]}
              />
              <Button
                fill
                title={t('common:tryAgain')}
                onPress={controller.RETRY_VERIFICATION}
              />
            </Row>
          </MessageOverlay>

          <QrLoginSuccess
            isVisible={controller.isVerifyingSuccesful}
            onPress={() => {
              controller.setQrLogin(false), controller.DISMISS();
            }}
          />
        </Column>
      </Modal>
    </ListItem>
  );
};
