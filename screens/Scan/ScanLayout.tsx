import React from 'react';
import {useTranslation} from 'react-i18next';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SendVcScreen} from './SendVcScreen';
import {useScanLayout} from './ScanLayoutController';
import {ScanScreen} from './ScanScreen';
import {ProgressingModal} from '../../components/ProgressingModal';
import {SCAN_ROUTES} from '../../routes/routesConstants';
import {SharingSuccessModal} from './SuccessfullySharedModal';
import {Theme} from '../../components/ui/styleUtils';
import {Icon} from 'react-native-elements';
import {Loader} from '../../components/ui/Loader';
import {FlowType} from '../../shared/Utils';
import {VerifyIdentityOverlay} from '../VerifyIdentityOverlay';
import {MessageOverlay} from '../../components/MessageOverlay';
import {Row, Button} from '../../components/ui';

const ScanStack = createNativeStackNavigator();

export const ScanLayout: React.FC = () => {
  const {t} = useTranslation('ScanScreen');
  const controller = useScanLayout();

  if (
    controller.statusOverlay != null &&
    !controller.isAccepted &&
    !controller.isInvalid
  ) {
    return (
      <Loader
        title={controller.statusOverlay?.title}
        hint={controller.statusOverlay?.hint}
        onCancel={controller.statusOverlay?.onButtonPress}
        onStayInProgress={controller.statusOverlay?.onStayInProgress}
        isHintVisible={
          controller.isStayInProgress ||
          controller.isBleError ||
          controller.isSendingVc
        }
        onRetry={controller.statusOverlay?.onRetry}
      />
    );
  }

  return (
    <React.Fragment>
      <VerifyIdentityOverlay
        isVisible={
          controller.isVerifyingIdentity &&
          controller.flowType === FlowType.MINI_VIEW_SHARE_WITH_SELFIE
        }
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
            testID="cancel"
            fill
            type="clear"
            title={t('common:cancel')}
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

      <ScanStack.Navigator initialRouteName="ScanScreen">
        {controller.isReviewing &&
          controller.flowType === FlowType.SIMPLE_SHARE && (
            <ScanStack.Screen
              name={SCAN_ROUTES.SendVcScreen}
              component={SendVcScreen}
              options={{
                title: t('sharingVc'),
                headerBackVisible: false,
                headerRight: () => (
                  <Icon
                    name="close"
                    color={Theme.Colors.blackIcon}
                    onPress={controller.CANCEL}
                  />
                ),
              }}
            />
          )}
        <ScanStack.Screen
          name={SCAN_ROUTES.ScanScreen}
          component={ScanScreen}
          options={{
            headerTitleStyle: {fontSize: 30, fontFamily: 'Inter_600SemiBold'},
            title: t('MainLayout:share'),
          }}
        />
      </ScanStack.Navigator>

      <SharingSuccessModal
        isVisible={controller.isAccepted}
        testId={'sharingSuccessModal'}
      />

      <ProgressingModal
        isVisible={controller.isDisconnected}
        title={t('RequestScreen:status.disconnected.title')}
        isHintVisible={true}
        hint={t('RequestScreen:status.disconnected.message')}
        onCancel={controller.DISMISS}
        onRetry={controller.onRetry}
        progress
      />
    </React.Fragment>
  );
};
