import { CameraCapturedPicture } from "expo-camera";
import { EmitterSubscription } from "react-native";
import { ActorRefFrom } from "xstate";
import { createModel } from "xstate/lib/model";
import { DeviceInfo } from "../../../components/DeviceInfoList";
import { AppServices } from "../../../shared/GlobalContext";
import { VCShareFlowType } from "../../../shared/Utils";
import { qrLoginMachine } from "../../QrLoginMachine";
import { VC } from "../../VerifiableCredential/VCMetaMachine/vc";
import { ActivityLogType } from "../../activityLog";
import { BLEError } from "../types";
import { ScanEvents } from "./scanEvents";

export const ScanModel = createModel(
    {
      serviceRefs: {} as AppServices,
      senderInfo: {} as DeviceInfo,
      receiverInfo: {} as DeviceInfo,
      selectedVc: {} as VC,
      bleError: {} as BLEError,
      loggers: [] as EmitterSubscription[],
      vcName: '',
      flowType: VCShareFlowType.SIMPLE_SHARE,
      verificationImage: {} as CameraCapturedPicture,
      openId4VpUri: '',
      shareLogType: '' as ActivityLogType,
      QrLoginRef: {} as ActorRefFrom<typeof qrLoginMachine>,
      showQuickShareSuccessBanner: false,
      linkCode: '',
      quickShareData: {},
      showFaceAuthConsent: true as boolean,
      readyForBluetoothStateCheck: false,
      showFaceCaptureSuccessBanner: false,
    },
    {
      events: ScanEvents,
    },
  );