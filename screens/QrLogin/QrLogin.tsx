import React from 'react';
import { Button, Column, Row } from '../../components/ui';
import { useTranslation } from 'react-i18next';
import { useQrLogin } from './QrLoginController';
import { Modal } from '../../components/ui/Modal';
import { VerifyIdentityOverlay } from '../VerifyIdentityOverlay';
import { MessageOverlay } from '../../components/MessageOverlay';
import { MyBindedVcs } from './MyBindedVcs';
import { QrLoginWarning } from './QrLoginWarning';
import { QrLoginSuccess } from './QrLoginSuccessMessage';
import { QrConsent } from './QrConsent';
import { QrLoginRef } from '../../machines/QrLoginMachine';
import { Icon } from 'react-native-elements';

export const QrLogin: React.FC<QrLoginProps> = (props) => {
  const controller = useQrLogin(props);
  const { t } = useTranslation('QrScreen');

  return (
    <Modal
      isVisible={props.isVisible}
      onDismiss={controller.DISMISS}
      headerTitle={t('title')}
      headerRight={<Icon name={''} />}>
      <Column fill>
        <QrLoginWarning
          isVisible={controller.isShowWarning}
          onConfirm={controller.CONFIRM}
          onCancel={controller.DISMISS}
        />

        <MessageOverlay
          isVisible={
            controller.isWaitingForData ||
            controller.isLoadingMyVcs ||
            controller.isLinkTransaction
          }
          title={t('loading')}
          progress
        />

        <MessageOverlay
          isVisible={controller.isShowingError}
          title={controller.error}
          onCancel={controller.CANCEL}
        />

        <MyBindedVcs
          isVisible={controller.isShowingVcList}
          service={props.service}
        />

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

        <QrConsent
          isVisible={controller.isRequestConsent}
          onConfirm={controller.CONFIRM}
          onCancel={controller.CANCEL}
          service={props.service}
        />

        <QrLoginSuccess
          isVisible={controller.isVerifyingSuccesful}
          onPress={controller.CONFIRM}
        />
      </Column>
    </Modal>
  );
};

export interface QrLoginProps {
  isVisible: boolean;
  service: QrLoginRef;
}
