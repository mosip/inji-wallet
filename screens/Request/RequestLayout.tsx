import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {HeaderBackButton} from '@react-navigation/elements';
import {RequestScreen} from './RequestScreen';
import {useRequestLayout} from './RequestLayoutController';
import {Message} from '../../components/Message';
import {ReceiveVcScreen} from './ReceiveVcScreen';
import {ReceivedCardsModal} from '../Settings/ReceivedCardsModal';
import {useReceivedVcsTab} from '../Home/ReceivedVcsTabController';
import {REQUEST_ROUTES} from '../../routes/routesConstants';
import {SquircleIconPopUpModal} from '../../components/ui/SquircleIconPopUpModal';
import {BannerNotificationContainer} from '../../components/BannerNotificationContainer';
import {SharingStatusModal} from '../Scan/SharingStatusModal';
import {SvgImage} from '../../components/ui/svg';

const RequestStack = createNativeStackNavigator();

export const RequestLayout: React.FC = () => {
  const {t} = useTranslation('RequestScreen');
  const controller = useRequestLayout();
  const receivedCardsController = useReceivedVcsTab();
  let bleErrorCode = controller.bleError.code;

  return (
    <React.Fragment>
      <BannerNotificationContainer />
      <RequestStack.Navigator
        initialRouteName="RequestScreen"
        screenListeners={{
          state: () => {
            if (controller.IsSavingFailedInViewingVc || controller.isAccepted) {
              controller.RESET();
            }
          },
        }}
        screenOptions={{
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}>
        {!controller.isDone && (
          <RequestStack.Screen
            name={REQUEST_ROUTES.ReceiveVcScreen}
            component={ReceiveVcScreen}
            options={{
              title: t('incomingVc'),
              headerLeft: () => (
                <HeaderBackButton
                  onPress={() => {
                    controller.RESET();
                  }}
                />
              ),
            }}
          />
        )}
        <RequestStack.Screen
          name={REQUEST_ROUTES.RequestScreen}
          component={RequestScreen}
          options={{
            title: t('receiveCard').toUpperCase(),
          }}
        />
      </RequestStack.Navigator>

      <ReceivedCardsModal
        isVisible={controller.isNavigatingToReceivedCards}
        controller={receivedCardsController}
        onDismiss={controller.DISMISS}
      />
      {controller.isAccepted && (
        <SquircleIconPopUpModal
          message={t('status.accepted.message')}
          onBackdropPress={controller.DISMISS}
          testId={'vcAcceptedPopUp'}
        />
      )}

      {controller.isRejected && (
        <Message
          title={t('status.rejected.title')}
          message={t('status.rejected.message')}
          onBackdropPress={controller.DISMISS}
        />
      )}

      <SharingStatusModal
        isVisible={controller.isDisconnected}
        testId={'sharingErrorModal'}
        status={'withGradientButton'}
        title={t('status.disconnected.title')}
        message={t('status.disconnected.message')}
        gradientButtonTitle={t('common:ok')}
        image={SvgImage.ErrorLogo()}
        onGradientButton={controller.RESET}
      />

      <SharingStatusModal
        isVisible={controller.isBleError}
        testId={'sharingErrorModal'}
        status={'withGradientButton'}
        title={t(`status.bleError.${bleErrorCode}.title`)}
        message={t(`status.bleError.${bleErrorCode}.message`)}
        gradientButtonTitle={t('common:ok')}
        image={SvgImage.ErrorLogo()}
        onGradientButton={controller.RESET}
      />
    </React.Fragment>
  );
};
