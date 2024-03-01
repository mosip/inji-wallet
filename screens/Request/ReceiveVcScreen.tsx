import React from 'react';
import {useTranslation} from 'react-i18next';
import {DeviceInfoList} from '../../components/DeviceInfoList';
import {Button, Column, Row, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {useReceiveVcScreen} from './ReceiveVcScreenController';
import {VerifyIdentityOverlay} from '../VerifyIdentityOverlay';
import {
  ErrorMessageOverlay,
  MessageOverlay,
} from '../../components/MessageOverlay';
import {useOverlayVisibleAfterTimeout} from '../../shared/hooks/useOverlayVisibleAfterTimeout';
import {VcDetailsContainer} from '../../components/VC/VcDetailsContainer';
import {SharingStatusModal} from '../Scan/SharingStatusModal';
import {SvgImage} from '../../components/ui/svg';

export const ReceiveVcScreen: React.FC = () => {
  const {t} = useTranslation('ReceiveVcScreen');
  const controller = useReceiveVcScreen();
  const savingOverlayVisible = useOverlayVisibleAfterTimeout(
    controller.isAccepting,
  );

  return (
    <React.Fragment>
      {controller.isDisplayingIncomingVC && (
        <Column
          scroll
          padding="24 0 48 0"
          backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
          <Column>
            <DeviceInfoList of="sender" deviceInfo={controller.senderInfo} />
            <Text weight="semibold" margin="24 24 0 24">
              {t('header')}
            </Text>
            <VcDetailsContainer
              vc={controller.incomingVc}
              isBindingPending={false}
              activeTab={1}
            />
          </Column>
          <Column padding="0 24" margin="32 0 0 0">
            <Button
              title={t('goToReceivedVCTab')}
              margin="0 0 12 0"
              onPress={controller.GO_TO_RECEIVED_VC_TAB}
            />
          </Column>
        </Column>
      )}

      <VerifyIdentityOverlay
        vc={controller.incomingVc}
        isVisible={controller.isVerifyingIdentity}
        onCancel={controller.CANCEL}
        onFaceValid={controller.FACE_VALID}
        onFaceInvalid={controller.FACE_INVALID}
      />

      <MessageOverlay
        isVisible={controller.isInvalidIdentity}
        title={t('VerifyIdentityOverlay:errors.invalidIdentity.title')}
        message={t('VerifyIdentityOverlay:errors.invalidIdentity.message')}
        minHeight={'auto'}
        // DOUBT^: when does the above message show up in verifier device if it's never communicated explicitly?
        onBackdropPress={controller.DISMISS}>
        <Row>
          <Button
            fill
            type="clear"
            title={t('common:dismiss')}
            onPress={controller.DISMISS}
            margin={[0, 8, 0, 0]}
          />
          <Button
            testID="tryAgain"
            fill
            title={t('common:tryAgain')}
            onPress={controller.RETRY_VERIFICATION}
          />
        </Row>
      </MessageOverlay>

      <MessageOverlay
        isVisible={savingOverlayVisible}
        message={t('saving')}
        progress={true}
      />

      <SharingStatusModal
        isVisible={controller.isSavingFailedInIdle}
        testId={'savingFailedError'}
        image={SvgImage.ErrorLogo()}
        title={t('errors.savingFailed.title')}
        message={t('errors.savingFailed.message')}
        gradientButtonTitle={t('common:ok')}
        onGradientButton={controller.RESET}
      />
    </React.Fragment>
  );
};
