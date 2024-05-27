import {Linking} from 'react-native';
import {getDeviceNameSync} from 'react-native-device-info';
import {assign, spawn, send, DoneInvokeEvent} from 'xstate';
import {VCShareFlowType} from '../../../shared/Utils';
import {VCMetadata} from '../../../shared/VCMetadata';
import {logState} from '../../../shared/commonUtil';
import {
  SHOW_FACE_AUTH_CONSENT_SHARE_FLOW,
  isAndroid,
  DEFAULT_QR_HEADER,
  MY_VCS_STORE_KEY,
  MY_LOGIN_STORE_KEY,
} from '../../../shared/constants';
import {getIdType} from '../../../shared/openId4VCI/Utils';
import {TelemetryConstants} from '../../../shared/telemetry/TelemetryConstants';
import {
  sendImpressionEvent,
  getImpressionEventData,
  sendEndEvent,
  getEndEventData,
  sendErrorEvent,
  getErrorEventData,
  sendStartEvent,
  getStartEventData,
} from '../../../shared/telemetry/TelemetryUtils';
import {createQrLoginMachine} from '../../QrLogin/QrLoginMachine';
import {VcMetaEvents} from '../../VerifiableCredential/VCMetaMachine/VCMetaEvents';
import {ActivityLogEvents} from '../../activityLog';
import {StoreEvents} from '../../store';
import tuvali from '@mosip/tuvali';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {NativeModules} from 'react-native';

const {wallet, EventTypes, VerificationStatus} = tuvali;
export const ScanActions = (model: any, QR_LOGIN_REF_ID: any) => {
  const {RNPixelpassModule} = NativeModules;
  return {
    setChildRef: assign({
      QrLoginRef: (context: any) => {
        const service = spawn(
          createQrLoginMachine(context.serviceRefs),
          QR_LOGIN_REF_ID,
        );
        service.subscribe(logState);
        return service;
      },
    }),

    updateShowFaceAuthConsent: model.assign({
      showFaceAuthConsent: (_, event) => {
        return event.response || event.response === null;
      },
    }),

    setShowFaceAuthConsent: model.assign({
      showFaceAuthConsent: (_, event) => {
        return !event.isDoNotAskAgainChecked;
      },
    }),

    getFaceAuthConsent: send(
      StoreEvents.GET(SHOW_FACE_AUTH_CONSENT_SHARE_FLOW),
      {
        to: (context: any) => context.serviceRefs.store,
      },
    ),

    storeShowFaceAuthConsent: send(
      (context, event) =>
        StoreEvents.SET(
          SHOW_FACE_AUTH_CONSENT_SHARE_FLOW,
          !event.isDoNotAskAgainChecked,
        ),
      {
        to: (context: any) => context.serviceRefs.store,
      },
    ),

    sendScanData: context =>
      context.QrLoginRef.send({
        type: 'GET',
        linkCode: context.linkCode,
        flowType: context.flowType,
        selectedVc: context.selectedVc,
      }),

    openBluetoothSettings: () => {
      isAndroid()
        ? BluetoothStateManager.openSettings().catch()
        : Linking.openURL('App-Prefs:Bluetooth');
    },

    openAppPermission: () => Linking.openSettings(),

    enableLocation: async () => {
      await Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
    },

    setUri: model.assign({
      openId4VpUri: (_context, event) => event.params,
    }),

    clearUri: assign({
      openId4VpUri: '',
    }),

    setSenderInfo: assign({
      senderInfo: () => {
        return {name: 'Wallet', deviceName: 'Wallet', deviceId: ''};
      },
    }),

    setReceiverInfo: assign({
      receiverInfo: () => {
        return {name: 'Verifier', deviceName: 'Verifier', deviceId: ''};
      },
    }),

    setReadyForBluetoothStateCheck: model.assign({
      readyForBluetoothStateCheck: () => true,
    }),

    setBleError: assign({
      bleError: (_context, event) => event.bleError,
    }),

    setSelectedVc: assign({
      selectedVc: (_context, event) => event.vc,
    }),

    resetSelectedVc: assign({
      selectedVc: {},
    }),

    resetShowQuickShareSuccessBanner: assign({
      showQuickShareSuccessBanner: false,
    }),

    setShowQuickShareSuccessBanner: assign({
      showQuickShareSuccessBanner: true,
    }),

    setFlowType: assign({
      flowType: (_context, event) => event.flowType,
    }),

    resetFlowType: assign({
      flowType: VCShareFlowType.SIMPLE_SHARE,
    }),

    registerLoggers: assign({
      loggers: () => {
        if (__DEV__) {
          return [
            wallet.handleDataEvents(event => {
              console.log(
                getDeviceNameSync(),
                '<Sender.Event>',
                JSON.stringify(event).slice(0, 100),
              );
            }),
          ];
        } else {
          return [];
        }
      },
    }),

    removeLoggers: assign({
      loggers: ({loggers}) => {
        loggers?.forEach(logger => logger.remove());
        return [];
      },
    }),

    setShareLogTypeUnverified: model.assign({
      shareLogType: 'VC_SHARED',
    }),

    setShareLogTypeVerified: model.assign({
      shareLogType: 'PRESENCE_VERIFIED_AND_VC_SHARED',
    }),

    updateFaceCaptureBannerStatus: model.assign({
      showFaceCaptureSuccessBanner: true,
    }),

    resetFaceCaptureBannerStatus: model.assign({
      showFaceCaptureSuccessBanner: false,
    }),

    logShared: send(
      (context: any) => {
        const vcMetadata = context.selectedVc?.vcMetadata;
        return ActivityLogEvents.LOG_ACTIVITY({
          _vcKey: VCMetadata.fromVC(vcMetadata).getVcKey(),
          type: context.shareLogType
            ? context.shareLogType
            : 'VC_SHARED_WITH_VERIFICATION_CONSENT',
          id: vcMetadata.id,
          idType: getIdType(vcMetadata.issuer),
          timestamp: Date.now(),
          deviceName:
            context.receiverInfo.name || context.receiverInfo.deviceName,
          vcLabel: vcMetadata.id,
        });
      },
      {to: context => context.serviceRefs.activityLog},
    ),

    logFailedVerification: send(
      context =>
        ActivityLogEvents.LOG_ACTIVITY({
          _vcKey: VCMetadata.fromVC(context.selectedVc).getVcKey(),
          type: 'PRESENCE_VERIFICATION_FAILED',
          timestamp: Date.now(),
          idType: getIdType(context.selectedVc.vcMetadata.issuer),
          id: context.selectedVc.vcMetadata.id,
          deviceName:
            context.receiverInfo.name || context.receiverInfo.deviceName,
          vcLabel: context.selectedVc.vcMetadata.id,
        }),
      {to: context => context.serviceRefs.activityLog},
    ),

    setLinkCode: assign({
      linkCode: (_, event) =>
        new URL(event.params).searchParams.get('linkCode'),
    }),
    setQuickShareData: assign({
      quickShareData: (_, event) =>
        JSON.parse(
          RNPixelpassModule.decode(event.params.split(DEFAULT_QR_HEADER)[1]),
        ),
    }),
    loadMetaDataToMemory: send(
      (context: any) => {
        let metadata = VCMetadata.fromVC(context.quickShareData?.meta);
        return StoreEvents.PREPEND(MY_VCS_STORE_KEY, metadata);
      },
      {to: context => context.serviceRefs.store},
    ),
    loadVCDataToMemory: send(
      (context: any) => {
        let metadata = VCMetadata.fromVC(context.quickShareData?.meta);

        let verifiableCredential = metadata.isFromOpenId4VCI()
          ? {credential: context.quickShareData?.verifiableCredential}
          : context.quickShareData?.verifiableCredential;

        return StoreEvents.SET(metadata.getVcKey(), {
          verifiableCredential: verifiableCredential,
        });
      },
      {to: context => context.serviceRefs.store},
    ),
    refreshVCs: send(VcMetaEvents.REFRESH_MY_VCS, {
      to: context => context.serviceRefs.vcMeta,
    }),
    storeLoginItem: send(
      (_context, event) => {
        return StoreEvents.PREPEND(
          MY_LOGIN_STORE_KEY,
          (event as DoneInvokeEvent<string>).data,
        );
      },
      {to: (context: any) => context.serviceRefs.store},
    ),

    storingActivityLog: send(
      (_, event) =>
        ActivityLogEvents.LOG_ACTIVITY({
          _vcKey: '',
          id: event.response.selectedVc.vcMetadata.id,
          idType: getIdType(event.response.selectedVc.vcMetadata.issuer),
          type: 'QRLOGIN_SUCCESFULL',
          timestamp: Date.now(),
          deviceName: '',
          vcLabel: String(event.response.selectedVc.vcMetadata.id),
        }),
      {
        to: (context: any) => context.serviceRefs.activityLog,
      },
    ),

    sendVcShareSuccessEvent: () => {
      sendImpressionEvent(
        getImpressionEventData(
          TelemetryConstants.FlowType.senderVcShare,
          TelemetryConstants.Screens.vcShareSuccessPage,
        ),
      );
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.senderVcShare,
          TelemetryConstants.EndEventStatus.success,
        ),
      );
    },

    sendBLEConnectionErrorEvent: (_context, event) => {
      sendErrorEvent(
        getErrorEventData(
          TelemetryConstants.FlowType.senderVcShare,
          event.bleError.code,
          event.bleError.message,
        ),
      );
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.senderVcShare,
          TelemetryConstants.EndEventStatus.failure,
        ),
      );
    },

    sendVcSharingStartEvent: () => {
      sendStartEvent(
        getStartEventData(TelemetryConstants.FlowType.senderVcShare),
      );
      sendImpressionEvent(
        getImpressionEventData(
          TelemetryConstants.FlowType.senderVcShare,
          TelemetryConstants.Screens.scanScreen,
        ),
      );
    },

    sendVCShareFlowCancelEndEvent: () => {
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.senderVcShare,
          TelemetryConstants.EndEventStatus.cancel,
          {comment: 'User cancelled VC share'},
        ),
      );
    },

    sendVCShareFlowTimeoutEndEvent: () => {
      sendEndEvent(
        getEndEventData(
          TelemetryConstants.FlowType.senderVcShare,
          TelemetryConstants.EndEventStatus.failure,
          {comment: 'VC sharing timeout'},
        ),
      );
    },
  };
};
