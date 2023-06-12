/* eslint-disable sonarjs/no-duplicate-string */
import SmartshareReactNative from '@idpass/smartshare-react-native';
import { ConnectionParams } from '@idpass/smartshare-react-native/lib/typescript/IdpassSmartshare';
import OpenIdBle from 'react-native-openid4vp-ble';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {
  ActorRefFrom,
  assign,
  DoneInvokeEvent,
  EventFrom,
  send,
  sendParent,
  spawn,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { EmitterSubscription, Linking, Platform } from 'react-native';
import { DeviceInfo } from '../../components/DeviceInfoList';
import { getDeviceNameSync } from 'react-native-device-info';
import { VC, VerifiablePresentation } from '../../types/vc';
import { AppServices } from '../../shared/GlobalContext';
import { ActivityLogEvents, ActivityLogType } from '../activityLog';
import {
  GNM_API_KEY,
  GNM_MESSAGE_LIMIT,
  MY_LOGIN_STORE_KEY,
  VC_ITEM_STORE_KEY,
} from '../../shared/constants';
import {
  onlineSubscribe,
  offlineSubscribe,
  offlineSend,
  onlineSend,
  ExchangeSenderInfoEvent,
  PairingEvent,
  SendVcEvent,
  SendVcStatus,
} from '../../shared/openIdBLE/smartshare';
import {
  check,
  checkMultiple,
  PermissionStatus,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import { checkLocation, requestLocation } from '../../shared/location';
import { CameraCapturedPicture } from 'expo-camera';
import { log } from 'xstate/lib/actions';
import { BLEError, isBLEEnabled } from '../../lib/smartshare';
import { createQrLoginMachine, qrLoginMachine } from '../QrLoginMachine';
import { StoreEvents } from '../store';

const { GoogleNearbyMessages } = SmartshareReactNative;
const { Openid4vpBle } = OpenIdBle;

type SharingProtocol = 'OFFLINE' | 'ONLINE';

const SendVcResponseType = 'send-vc:response';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    senderInfo: {} as DeviceInfo,
    receiverInfo: {} as DeviceInfo,
    selectedVc: {} as VC,
    bleError: {} as BLEError,
    createdVp: null as VC,
    reason: '',
    loggers: [] as EmitterSubscription[],
    vcName: '',
    verificationImage: {} as CameraCapturedPicture,
    sharingProtocol: 'OFFLINE' as SharingProtocol,
    scannedQrParams: {} as ConnectionParams,
    shareLogType: '' as ActivityLogType,
    QrLoginRef: {} as ActorRefFrom<typeof qrLoginMachine>,
    linkCode: '',
    readyForBluetoothStateCheck: false,
  },
  {
    events: {
      EXCHANGE_DONE: (receiverInfo: DeviceInfo) => ({ receiverInfo }),
      RECEIVE_DEVICE_INFO: (info: DeviceInfo) => ({ info }),
      SELECT_VC: (vc: VC) => ({ vc }),
      SCAN: (params: string) => ({ params }),
      ACCEPT_REQUEST: () => ({}),
      VERIFY_AND_ACCEPT_REQUEST: () => ({}),
      VC_ACCEPTED: () => ({}),
      VC_REJECTED: () => ({}),
      VC_SENT: () => ({}),
      CANCEL: () => ({}),
      DISMISS: () => ({}),
      CONNECTED: () => ({}),
      DISCONNECT: () => ({}),
      BLE_ERROR: (bleError: BLEError) => ({ bleError }),
      CONNECTION_DESTROYED: () => ({}),
      SCREEN_BLUR: () => ({}),
      SCREEN_FOCUS: () => ({}),
      BLUETOOTH_PERMISSION_ENABLED: () => ({}),
      BLUETOOTH_PERMISSION_DENIED: () => ({}),
      BLUETOOTH_STATE_ENABLED: () => ({}),
      BLUETOOTH_STATE_DISABLED: () => ({}),
      NEARBY_ENABLED: () => ({}),
      NEARBY_DISABLED: () => ({}),
      GOTO_SETTINGS: () => ({}),
      START_PERMISSION_CHECK: () => ({}),
      UPDATE_REASON: (reason: string) => ({ reason }),
      LOCATION_ENABLED: () => ({}),
      LOCATION_DISABLED: () => ({}),
      LOCATION_REQUEST: () => ({}),
      UPDATE_VC_NAME: (vcName: string) => ({ vcName }),
      STORE_RESPONSE: (response: unknown) => ({ response }),
      APP_ACTIVE: () => ({}),
      FACE_VALID: () => ({}),
      FACE_INVALID: () => ({}),
      RETRY_VERIFICATION: () => ({}),
      VP_CREATED: (vp: VerifiablePresentation) => ({ vp }),
      TOGGLE_USER_CONSENT: () => ({}),
    },
  }
);
const QR_LOGIN_REF_ID = 'QrLogin';

export const ScanEvents = model.events;

export const scanMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYEMB2BiAygYQCUBRIgOQH0AhAGQFUCBtABgF1FQAHAe1gEsAXXlwzsQAD0QAWAEwAaEAE9EAZgCsATgB06gGx7py9U3UBGdeYC+F+aky5CJCgDEA8nlo5mbJCG59BwqISCDLySiGSJtqqBobKTBoAHNLSVjbo2DRE5EQEBC6MrKJ+AkIiPsGhiio6yjraygDsierKJpJNkqppILYYmrD8aABO-AAKYMMAtrywfMJ4ABZgKADWuAAqAIIEG+RjuQCyAJI4OMcuFHgAEkR4ANJexTylgRVSkkyaXQnSiRpMNTKaQ6MIfKLqGLKOIJdTJVLWXoZTQoZZrUhgEYAIwUABEwAA3XgoOATaazeb9VErVa8DBQLCkIg7SgATRypC2WVxTx8JQC5VAwRMTEaXyYn2UiUMkg6xmUYIQqh0kk0JmaulUkkaahMyh6fRRaNWGOxeMJxNJkxmczKRppdIZTJZ7Nxpy51CIPKKfJeAqCiBFYs0EsB0vUsvirUVkmSata0lUTFFOh1ooNyOp6Mxwxx+KJJNgZJtlM0wzAAEcAK5wQT0xnMghsjker28zh+soBhAmFVaWO-f46VRS6Ex3TfT4mFpMaRhxomDOYe3Zs35y1F60Uu3l6u1x0Nl3kN04Vve7wd-xd949vvfRKD5Uj6UK6oIaRmb6NMXD1QmEWzk0S5Usapq5uaBZWuStrCJoYAYGgWIADaQFg7a+J2bxCoGd4DjEQ7PmOb5avU6jSOojRwtIjTSF02rASuqyUEhNb8FwXD8IsxbbrBWa0vWNC0EQGwuC4GzXOQWzUNQLgAOptj6l6vIK4iIB+jSqCGI6xs0qiNDo6qvuEMTSN8yiRCKFHJHqiQMXxzGsexnHcTBIEOgJdDCaJ4nHmQxwKReGFXlhqnvqoqiJN8pgJOZahJmoio6vUI4froOgtBRI52caDlgGxHFcVurlwQhyGoeh-LXthYURVFIraXFgKqIqUINNqFG6YmZHZTSuX5ZxOBDPwYCMQegleWJElkGeFWYSpwTmd+mj-G0tEGJCkgUS1sbfH8CTtGREo6Ai6TLvZLF5U5iyDWgw2jR5QkiZNx7utys3BfNKjao0y0jiYa2GFqW1vjoZFqulrTAqDTWND1ax9VdN13buNaDGNnlPT501vYpQXKd2gNRN+tH-dqEqtI0iqpj9ZFzu0MjftO3SIoa52OQVSMjSj+4PRNPknjNuOVSFlTQl8zTkZEiTfvplNvuY9S1CZD5-n8Kpw0xF39ddQ0jfBiEoRAaFC3N3YdPEmgSxG04y6mLV6Wq37JsOor6RGDHlmzl0c7r90MuNmNTZyOOBcLn0IItk7UcYKpasYJiKhGP0qrUCQ6Ewx0qvqLPIp7OVa4jvt8ejj3eRJAsh88H3djR9RdG0L6JJIegGYqIramqtELnO8UmMqHsrPn7MDb7+tlUb734ze5vi8k1vS9+dvy5tarN+YJNixRDHIcPhXQZS+IYLwqFbGMYySXgGzHAAakQk-+je8RtJb+HSskiTpYCiUdJbD5k6DjRPjM1Ov0He3tnJFQPvBY+RsADiYkXDkBwMJK+pBYGeBNtXae5EiZ1GHDLfSHQqY-3VC0Pu6cZDamAUiZcYDtaHxgVgU+58tiXxvnfTBU9qoxDbmYLQhh-xzlTMmP8kgGIYBzJQCCG4XJQKPifM+F8r633vlVUKvYV54T+E+UcRk1Kg20C3f6epfwZ3EZI6RhZZFlAYaheBIkkEoOOGgjBodTY3nIiqNUwIQSpj7qONufworND0OZJgTdmh2RQiMR0eBhASJQAKLAeBLhMjYZcXyOANj5FZAFKuXDQpamUJoeIQ4P7lMBHokI5FNLtF0v8EcypFw5zOtE4YsT4krCSWIQYt0RpoAAGbDWGAAClxEQLJOTyBX0OEQFwtANgAEosCszaR0jACSBSqJFogIpJTwnKnKZ-Ii4RKFfE2uqXQ-wDoMQGXSCA6zNllHsFsUg2zw6WVMjqQ51yWjJBjCTS2tQLIZxESdGh-Q7kYAefSOJGyunPPwK8hgJg3FYOqp8y2ah0q-KojGdomk9BmASNKAyOhbn3MeQi4QLy3nSDRQU4UxgvnYsSLi-5b5IxfGJRRWokJF7UMNFCmFUA4VPJpUit5ygGUPwxeEllPy-x-LkJy4wtSaKeIip8VoDFYCLC4AAdwAIrDGoFwKAdIsAQGECNOkBIuCrBGias1FqMDvO7HqfSIY6jtQ2r2BIMZm6kV5f9cyTd-i6v1ca015rLUnhOGcd1N4RRxm+TipVeLOUaGSnhPuOqWn9D1Ya51sbC1sXafWLJBRsjEBwGMS4yCk0Yo0qZAydNRSJniKKQNMhNCg3-EwDRbK+4MQ4OWDgMT6QbC4GKrpWBiB4CIOw3y19jiLvIM41wTb1ERTrrXdOrQOrhPxenS2Mg5wRhBNquynTEkHhSaQNJGw8m+nRYUlVpzZa-xSOqP4XREw3vhXe+kmg6RjGGOa8scwsA9N9oM4ZIyH1PouBQGZcyFnLNZreusUBQMYHA5BuAsBt3BFiJFGiKVrbNHaPi1oIZYxNxkGYOosMC0omw46TQggphgC4FWfgyTXmLuoCRxAx0YwLh+uREE4TAS0XJWxsAYhUSYFdVAdcJJjgYAGVwLAJ4kN3A2KJhA6dFaJHqh-LUNEEpvmhJCScyQdT1zIvRRTynFiqcdBpsAWmdNYCIAADRuK82B2RcSXA4TKtRwRTN9vMyS4c2oDDNTfPTH64UYj-TZYCSJbmVP0i8xaTT2ndOwb6ZoeDkxEOpMMyh6ZxxZnzKWSs5ESn8tqe875rgxnUr3l+BnZIg6IyglS1qWpelm5-DhC+BibWPMFfpJ1krXHeA8b4wJvAQmiAic4bK0KsX0oWcS9ZlL4Q+4-2HOlKUC5pQdoHkSMABrOOwDAChYDUBr4oCwLQMYuItjPvIMQLYOBLg9dIVFDowikzhN7G3Oe+zTCHIMr2NQ93j5PZAy9t7OHPt6dOAZy+PW9LFKZm0QBqZwojfCNRU92o2itFVmItj5YHsY9w1jhF9JcfIM9Jfcg188Bg7BgYLoZEWhSl7FTwMOpilzg0m0QCIumcgLLBaR7z3Xuc4+192+BBjhOHZK83EF9F1jD2MQI1QksnGfaNCPtZEFy6DFC5yQioe5RDMBoC5ZDlcQtV6zjX2PHS49Yab83RBLcTKM7t6LgZIz2+omYYRLu25GFVBQ6U2o9TTgSGj9XmPNfvdx5t0gwnjPS1lxKAc+k+7HrfNRLo9HExqq6LbvPbOBiF5x19kSsDYGenIB4XI5AH3ININHqLOz3wHRDP+XQah9KxFOzhJoapQWJkoq0Sh7fOMZBJEhJCB5jNkQBcqZadNjH+pHcztXHeXvQuD19-TNXCcx6n4maUaoVrqmbhpZUbv4tDFEwxtvwyFs4VcWd0cNcH8ucdc8BHFx8bcU1HYIlpx-xYwaNbNpxVRmM+VahDBhwd8C8YDtcsABcTciAzcX0lI9thQP5TJZQIwpQkwYgJQ3c4Qoh1JpZPhW86IiD2d4IRVcdyDiAAApQzagvGWgwMf4BgzaDof4frV3WzWiVUMUcyHFaiMhfgzvEgz7PDAjKAKDWAGDXpO6SrUZHAa4HYZxWBerRrDDFrZcSA-PAQvQlAAwiDIwojG3VQ7QTaYENldOczSIRUBXVUSEBnACGcEEHQ+-IQjw7jXjfjQTUvbbG3WQycJgxQ1g5Q6nNlZOdUIpP8NoKUHQtAFAEkDgYaI2eNU4VxfJaQ98FIYpf9LqZMazJudg8zTQLgwBCUURLUHQ8sAAKy6VQjqMTTf3Dg3xJ2-3Jz-ylwjj-HqGY1FAfE3wih0IJEmF4AGQUEdGOAgHgkEH4AUCwCcFYWyGvikmOHPEaNjwQBWl6Krw2IMiTESDCPaEigKP7RVBVnAL9xcI7x2PaX2MOOOIwFOPOMuPXWcRuOoDuJt2TFVHM1MEsnM3aATnr2kziwy0Y3+lFF90NGBM41BL2IOPpCOJOIEHOJLzL2mI9Xj1BkTyd2ZVlDd2THFgzjswpg7XBRJNv133LFumDw4CtRtTw3tUdQGFziFJAxQBFJxw4AQDtS4HQC2VYHL1qBeNlDeNr0+Prw-jUIryxIXHVD0B0MVMxGVKwEmAg2GE0A4CQluh02mFlOcPlNw2tNFK5xVLVI1LKC8GRPImWgol7BaNAP0jhzqGWnqg-zqE7R0LtTQEPwgGpKhNpLxxwATQaNfUZUDBRLjPROMExNCNSzIi0GigllBiMDIgUwgK9KlNTN4HTMhOhPnWEgIHZF131zXX+xQ2RIlGLIHQ4KxLd3VAhE+Hl3Mz-CSgYgeVQGwwmNOFzPLw-SkHiFVFKQ0C9zTgbL93mwgEP3pGYjACIGGAdOzLXMZJvBohjDG0tion2nrPMgYhTLTOvPqOMz2R3PSn-IfBOSkCrzixBAr2BFnH7jY2LnpDNUDOEBwEmEgj9iRirBMJkk2yvgyWxk9HuPzKaKz2SjZPMGnGhDyLE0TG0Aok2lBk2gXGMA1kdDgtFIQqQstBQqGjQqwAwoHIyQrlwuM0Is0GzWd1MBfHIpCDjFqBSGsnSmVFCUYtgvVJYowEQuGGQu5jRinS4CIFKhQm4rcF4ooBwskLDm7ChE0glB-G1AHCWJYN6JiBZOBBYwXEUqgGYoFDUo0srFRhw2nV0oNjAAMswrq34tMvcW4WS3o2ssAQfCWLoiBVKXiAXAPUFUzGNCYuUs8rYpJD9msRpR4qwuMuDgEtvLlQ3OqQzhKXiCTDVhlAPNZgyqUvgtUpypGhgqgHyuwEKtCtelKsn3Dj0g0D7TqDhEhD1H5Ran-CfL+BlEogfEBAavSvcncqyrKC8vYsXMCqNh6oyQtytwnweKnyhEihHCuzFHops1OWHOokWglz9UhDco8vWras0EhMYWYSUXYR-OSE0jWgMg6k1AkubiiCfgMFnGoh1D+CerWtYvUs2ugVQl2ooH2qjx-Mym0GTFrzG3QPxWKX7RBFaFLLZWzkRAwC4GOPgB8D6COvDgAFp1BFQ6bNIKJzA2b2a2b3yEI70djabuwPwohjpaI1U2gbJAEwjYyKIYo-1Q04RdUhhRguqlgaQ+aPFaI4zExmNopYx4re1-1kr14NU0qzpQIcw8wisoISw1EzKbwWS4tYw2bpwG8JKmgiZ0DexF8tVATGqaQwJzbIJNx947QOrVbqp+j7aMoxLnaJNWjZQRRbcPbzMNY-bLFLaeJ+hNKcNQ71FqJLKNBIYJR5Muis0tAzBzSQQbZlRvblrVxwJvNA6rbYIx5DZs7hQpR6h44m4ydgQkw5ZjIvFUxxdIh05O1q6TbeoC4CourW6ZDgRHYM5m55USbGbOUQR4wEw6geTsVWMVcvZtYuq-YZ6exst56U4l7wwpr8am5zAfUVQL0NYEYp7IE7Rm7IAj6SYPdzIDBSFIhAYWoUg2pRyJYbIH7J6R4+kj62gDFIgJQCVrYgEHzTJmM5wYHdIzFoKh5wEdZysQ78LHjgR1Rvh244HIgEHiJDA+0NRyFC6qFQHd5OZVc9wtKoBIGFxilSU5cjB4tu0QYDFf0hx-wHxbIMGJ76HR49K368Gp8pZWiK65wUgVQ2DiIz8LT6cxQO1IgB497C4IGpHw5DBFRrkiGDom4QRAFctGztGfYcGmqWG9HuxpZE4pQwyaJjAyI2hZQd6gTB5RGsGGHX6IAj69ItAY46hDIxZpxE4dp2hah0oDAtDUc2M6ErourbFAn7GPFvwWauoVZzBZzv5VQ9pYw9JAE80lraEwHFg0mj6ugvV9JgjjFzYliAJ6gNI2mIplRFryn+gJERgpF67UnEb0maDHimZVRodYQgwzqliUgtB87Ic-xRRs0x6qQ1lYUOMQobbqpoRIpIYikZxZQPxgaPxWjIRkwpRzAdRmkVdhUqU71NmIrQo4qnyPa9QPjyIAUEgQxKJJdewTEVmBgo0S1XUj69QglFrfUtR-Vl9qkdpKlpY9popjbC0gWY1XVQNjywBQWYHLZXZARD0eDDTTlPhTrZNAQY5IgvHDQi1o0XU6QBhy1HRQXtJvVvxTBdBNpARgbDnhLkwmDOXB0AWaXgX6WEIiQoBfSoBp1rguAeNQXIQkGDAaJop-xM5A1hwqKxQaLFpqJR1x1J0pWZ1sNQWNDvUVRNjh6A1OV-VhLWDVZUxgjAMnl6R36+5dmtQks6hw1sTrqHY9JZwBXB7aInWtdPDCM5h36hFohPGDB0oMDaNTIJRZzSn4mBTMwOMQMkj1t36IoohAI9JFDDntQE36Nk3IhU3Zt3NPNFsLautQWFw+tWC4mhtm4241AkGjAuS6zaJoRK32tCtIIusw3vCI2MnqpqJTJVDLkIpjTQY24da+1B6zrf9fw+35sOta3lss3+MamDJLYQlIQPX04NI24PW1RDlrtSL0wb8A8XWx3QpKI-rXiUwDT52kwRqNBviIpoQ03PTb2BCg9YDQXAUzHlnB1KWfXAwiaiH1jCbu3un-coCFTMB98Ty7GRmp8+EfonaTJ6ywLIP3xpQfpvpwkpQ2UOhiS5T-3dCEjQXQUUCs8yyQj2DoGNjwpKJah1QqWqOkO3CEjh3jDQXkCf6bt0DmOsDARogP477B1-huO-3eOaPH8Vs1sd373hQLrhKyZ5czm2UvjJPIRpOZBZO9I4jBDlP79+BgPZR-CEwgiYdyzwgoG5CNIjP0pKJf2M6myKiqiaj36uXhLTApRaIWhlQKqalIof02VrlZR0phiwAxjElJGMOZjZxxZhbQZUxPWYXgRG85w1BKyBbKIdCxXeAJW-KuAZW5X1O1Iw0SkQDjPAIT368ODLZSF+jeChib3FPyTwSqT2zaT62f5TBIhX5yEiXavZxJwbKDnnwrSlSxSj6u7dTq93i68ztBtloaJvxcuuTkhkyMACQWy2yaSziluf4UHVvX368f9-ClmJc5y6gFzZgUBlzhmpDHjc6O6WTzBjAiS3dGZlo6JJMCG-hhGVcjy0OzyLyHSlu9QVv9SPiwjahiOmgWg5RzJIQAWPzWyTWpuZM9Tu4VRInVURxei77ov+igIRG1hMqWqNqSQanpzfouhjo+XAQCOoHf4CF59Rr81d7bHnq4bkKOrUKqaUuzYuhNJ-hWe5w-u2gWo2UX5ZQ9I9A+X-oYb6fXrM7HR-KJGamKZfpdB-xewoW+4HytBYnf0j3kxpZNeVKGf2rbHp6aulRWeSkRQUgSmyJ1RFeaYBae3QPiuaf+JVqtf4bcqtrx4gn3eFcve2X1JA1LfZz4m4qB0AWOqhfWqI+Rp3rkuPup904LYpZB7AEZBoxiJ2gZrwx2oFqmcrAgA */
  model.createMachine(
    {
      predictableActionArguments: true,
      preserveActionOrder: true,
      tsTypes: {} as import('./scan.typegen').Typegen0,
      schema: {
        context: model.initialContext,
        events: {} as EventFrom<typeof model>,
        services: {} as {
          createVp: {
            data: VC;
          };
        },
      },
      invoke: {
        src: 'monitorConnection',
      },
      id: 'scan',
      initial: 'inactive',
      on: {
        SCREEN_BLUR: {
          target: '.inactive',
        },
        SCREEN_FOCUS: {
          target: '.startPermissionCheck',
        },
        BLE_ERROR: {
          target: '.handlingBleError',
          actions: 'setBleError',
        },
      },
      states: {
        inactive: {
          entry: 'removeLoggers',
        },
        startPermissionCheck: {
          on: {
            START_PERMISSION_CHECK: [
              {
                cond: 'uptoAndroid11',
                target: '#scan.checkBluetoothPermission',
              },
              {
                cond: 'isIOS',
                target: '#scan.checkBluetoothPermission',
              },
              {
                target: '#scan.checkNearbyDevicesPermission',
              },
            ],
          },
        },

        checkNearbyDevicesPermission: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkNearByDevicesPermission',
              },
              on: {
                NEARBY_ENABLED: {
                  target: 'enabled',
                },
                NEARBY_DISABLED: {
                  target: 'requesting',
                },
              },
            },
            requesting: {
              invoke: {
                src: 'requestNearByDevicesPermission',
              },
              on: {
                NEARBY_ENABLED: {
                  target: '#scan.checkBluetoothPermission',
                },
                NEARBY_DISABLED: {
                  target: '#scan.nearByDevicesPermissionDenied',
                },
              },
            },
            enabled: {
              always: {
                target: '#scan.checkBluetoothPermission',
              },
            },
          },
        },

        checkBluetoothPermission: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkBluetoothPermission',
              },
              on: {
                BLUETOOTH_PERMISSION_ENABLED: {
                  actions: 'setReadyForBluetoothStateCheck',
                  target: 'enabled',
                },
                BLUETOOTH_PERMISSION_DENIED: {
                  target: '#scan.bluetoothPermissionDenied',
                },
              },
            },
            enabled: {
              always: {
                target: '#scan.checkBluetoothState',
              },
            },
          },
        },

        checkBluetoothState: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkBluetoothState',
              },
              on: {
                BLUETOOTH_STATE_ENABLED: {
                  target: 'enabled',
                },
                BLUETOOTH_STATE_DISABLED: [
                  {
                    cond: 'isIOS',
                    target: '#scan.checkBluetoothPermission',
                  },
                  {
                    target: 'requesting',
                  },
                ],
              },
            },
            requesting: {
              invoke: {
                src: 'requestBluetooth',
              },
              on: {
                BLUETOOTH_STATE_ENABLED: {
                  target: 'enabled',
                },
                BLUETOOTH_STATE_DISABLED: {
                  target: '#scan.bluetoothDenied',
                },
              },
            },
            enabled: {
              always: [
                {
                  cond: 'uptoAndroid11',
                  target: '#scan.checkingLocationService',
                },
                {
                  target: '#scan.clearingConnection',
                },
              ],
            },
          },
        },

        recheckBluetoothState: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkBluetoothState',
              },
              on: {
                BLUETOOTH_STATE_ENABLED: {
                  target: 'enabled',
                },
                BLUETOOTH_STATE_DISABLED: {
                  target: '#scan.bluetoothDenied',
                },
              },
            },
            enabled: {
              always: [
                {
                  cond: 'uptoAndroid11',
                  target: '#scan.checkingLocationService',
                },
                {
                  target: '#scan.clearingConnection',
                },
              ],
            },
          },
        },

        bluetoothPermissionDenied: {
          on: {
            APP_ACTIVE: '#scan.checkBluetoothState',
            GOTO_SETTINGS: {
              actions: 'openBluetoothSettings',
            },
          },
        },

        bluetoothDenied: {
          on: {
            APP_ACTIVE: '#scan.recheckBluetoothState',
          },
        },

        nearByDevicesPermissionDenied: {
          on: {
            APP_ACTIVE: '#scan.checkNearbyDevicesPermission',
            GOTO_SETTINGS: {
              actions: 'openAppPermission',
            },
          },
        },

        clearingConnection: {
          invoke: {
            src: 'disconnect',
          },
          on: {
            CONNECTION_DESTROYED: {
              target: '#scan.findingConnection',
              actions: [],
              internal: false,
            },
          },
          after: {
            DESTROY_TIMEOUT: {
              target: '#scan.findingConnection',
              actions: [],
              internal: false,
            },
          },
        },
        findingConnection: {
          entry: [
            'removeLoggers',
            'registerLoggers',
            'clearScannedQrParams',
            'setChildRef',
          ],
          on: {
            SCAN: [
              {
                target: 'preparingToConnect',
                cond: 'isQrOffline',
                actions: 'setConnectionParams',
              },
              {
                target: 'preparingToConnect',
                cond: 'isQrOnline',
                actions: 'setScannedQrParams',
              },
              {
                target: 'showQrLogin',
                cond: 'isQrLogin',
                actions: 'setLinkCode',
              },
              {
                target: 'invalid',
              },
            ],
          },
        },
        showQrLogin: {
          invoke: {
            id: 'QrLogin',
            src: qrLoginMachine,
            onDone: '.storing',
          },
          on: {
            DISMISS: 'findingConnection',
          },
          initial: 'idle',
          states: {
            idle: {},
            storing: {
              entry: ['storeLoginItem'],
              on: {
                STORE_RESPONSE: {
                  target: 'navigatingToHome',
                  actions: ['storingActivityLog'],
                },
              },
            },
            navigatingToHome: {},
          },
          entry: 'sendScanData',
        },
        preparingToConnect: {
          entry: 'requestSenderInfo',
          on: {
            RECEIVE_DEVICE_INFO: {
              target: 'connecting',
              actions: 'setSenderInfo',
            },
          },
        },
        connecting: {
          invoke: {
            src: 'discoverDevice',
          },
          initial: 'inProgress',
          states: {
            inProgress: {
              after: {
                CONNECTION_TIMEOUT: {
                  target: '#scan.connecting.timeout',
                  actions: [],
                  internal: false,
                },
              },
            },
            timeout: {
              on: {
                CANCEL: {
                  target: '#scan.reviewing.cancelling',
                },
              },
            },
          },
          on: {
            CONNECTED: {
              target: 'exchangingDeviceInfo',
            },
          },
        },
        exchangingDeviceInfo: {
          invoke: {
            src: 'exchangeDeviceInfo',
          },
          initial: 'inProgress',
          after: {
            CONNECTION_TIMEOUT: {
              target: '#scan.exchangingDeviceInfo.timeout',
              actions: [],
              internal: false,
            },
          },
          states: {
            inProgress: {},
            timeout: {
              on: {
                CANCEL: {
                  target: '#scan.reviewing.cancelling',
                },
              },
            },
          },
          on: {
            DISCONNECT: {
              target: 'disconnected',
            },
            EXCHANGE_DONE: {
              target: 'reviewing',
              actions: 'setReceiverInfo',
            },
          },
        },
        reviewing: {
          entry: ['resetShouldVerifyPresence'],
          exit: ['clearReason', 'clearCreatedVp'],
          initial: 'selectingVc',
          states: {
            selectingVc: {
              on: {
                UPDATE_REASON: {
                  actions: 'setReason',
                },
                DISCONNECT: {
                  target: '#scan.disconnected',
                },
                SELECT_VC: {
                  actions: 'setSelectedVc',
                },
                VERIFY_AND_ACCEPT_REQUEST: {
                  target: 'verifyingIdentity',
                },
                ACCEPT_REQUEST: {
                  target: 'sendingVc',
                  actions: 'setShareLogTypeUnverified',
                },
                CANCEL: {
                  target: 'cancelling',
                },
                TOGGLE_USER_CONSENT: {
                  actions: 'toggleShouldVerifyPresence',
                },
              },
            },
            cancelling: {
              invoke: {
                src: 'sendDisconnect',
              },
              always: {
                target: '#scan.clearingConnection',
              },
            },
            sendingVc: {
              invoke: {
                src: 'sendVc',
              },
              initial: 'inProgress',
              states: {
                inProgress: {
                  after: {
                    SHARING_TIMEOUT: {
                      target: '#scan.reviewing.sendingVc.timeout',
                      actions: [],
                      internal: false,
                    },
                  },
                },
                timeout: {
                  on: {
                    CANCEL: {
                      target: '#scan.reviewing.cancelling',
                    },
                  },
                },
                sent: {
                  description:
                    'VC data has been shared and the receiver should now be viewing it',
                },
              },
              on: {
                DISCONNECT: {
                  target: '#scan.disconnected',
                },
                VC_SENT: {
                  target: '.sent',
                },
                VC_ACCEPTED: {
                  target: '#scan.reviewing.accepted',
                },
                VC_REJECTED: {
                  target: '#scan.reviewing.rejected',
                },
              },
            },
            accepted: {
              entry: 'logShared',
              on: {
                DISMISS: {
                  target: 'navigatingToHome',
                },
              },
            },
            rejected: {
              on: {
                DISMISS: {
                  target: '#scan.clearingConnection',
                },
              },
            },
            navigatingToHome: {},
            verifyingIdentity: {
              on: {
                FACE_VALID: {
                  target: 'sendingVc',
                  actions: 'setShareLogTypeVerified',
                },
                FACE_INVALID: {
                  target: 'invalidIdentity',
                  actions: 'logFailedVerification',
                },
                CANCEL: {
                  target: 'selectingVc',
                },
              },
            },
            creatingVp: {
              invoke: {
                src: 'createVp',
                onDone: [
                  {
                    target: 'sendingVc',
                    actions: 'setCreatedVp',
                  },
                ],
                onError: [
                  {
                    target: 'selectingVc',
                    actions: log('Could not create Verifiable Presentation'),
                  },
                ],
              },
            },
            invalidIdentity: {
              on: {
                DISMISS: {
                  target: 'selectingVc',
                },
                RETRY_VERIFICATION: {
                  target: 'verifyingIdentity',
                },
              },
            },
          },
        },
        disconnected: {
          on: {
            DISMISS: {
              target: '#scan.clearingConnection',
            },
          },
        },
        handlingBleError: {
          on: {
            DISMISS: {
              target: '#scan.clearingConnection',
            },
          },
        },
        invalid: {
          on: {
            DISMISS: {
              target: '#scan.clearingConnection',
            },
          },
        },
        checkingLocationService: {
          initial: 'checkingStatus',
          states: {
            checkingStatus: {
              invoke: {
                src: 'checkLocationStatus',
              },
              on: {
                LOCATION_ENABLED: {
                  target: 'checkingPermission',
                },
                LOCATION_DISABLED: {
                  target: 'requestingToEnable',
                },
              },
            },
            requestingToEnable: {
              entry: 'requestToEnableLocation',
              on: {
                LOCATION_ENABLED: {
                  target: 'checkingPermission',
                },
                LOCATION_DISABLED: {
                  target: 'disabled',
                },
              },
            },
            checkingPermission: {
              invoke: {
                src: 'checkLocationPermission',
              },
              on: {
                LOCATION_ENABLED: {
                  target: '#scan.clearingConnection',
                },
                LOCATION_DISABLED: {
                  target: 'denied',
                },
              },
            },
            disabled: {
              on: {
                LOCATION_REQUEST: {
                  target: 'requestingToEnable',
                },
              },
            },
            denied: {
              on: {
                APP_ACTIVE: {
                  target: 'checkingPermission',
                },
                LOCATION_REQUEST: {
                  actions: 'openSettings',
                },
              },
            },
          },
        },
      },
    },
    {
      actions: {
        setChildRef: assign({
          QrLoginRef: (context) =>
            spawn(createQrLoginMachine(context.serviceRefs), QR_LOGIN_REF_ID),
        }),

        sendScanData: (context) =>
          context.QrLoginRef.send({
            type: 'GET',
            value: context.linkCode,
          }),
        openBluetoothSettings: () => {
          Platform.OS === 'android'
            ? BluetoothStateManager.openSettings().catch()
            : Linking.openURL('App-Prefs:Bluetooth');
        },
        openAppPermission: () => {
          Linking.openSettings();
        },

        requestSenderInfo: sendParent('REQUEST_DEVICE_INFO'),

        setSenderInfo: model.assign({
          senderInfo: (_context, event) => event.info,
        }),

        requestToEnableLocation: () => requestLocation(),

        setConnectionParams: (_context, event) => {
          Openid4vpBle.setConnectionParameters(event.params);
        },

        setScannedQrParams: model.assign({
          scannedQrParams: (_context, event) =>
            JSON.parse(event.params) as ConnectionParams,
          sharingProtocol: 'ONLINE',
        }),

        clearScannedQrParams: assign({
          scannedQrParams: {} as ConnectionParams,
        }),

        setReceiverInfo: model.assign({
          receiverInfo: (_context, event) => event.receiverInfo,
        }),

        setReadyForBluetoothStateCheck: model.assign({
          readyForBluetoothStateCheck: () => true,
        }),

        setReason: model.assign({
          reason: (_context, event) => event.reason,
        }),

        clearReason: assign({ reason: '' }),

        setSelectedVc: assign({
          selectedVc: (context, event) => {
            const reason = [];
            if (context.reason.trim() !== '') {
              reason.push({ message: context.reason, timestamp: Date.now() });
            }
            return {
              ...event.vc,
              reason,
              shouldVerifyPresence: context.selectedVc.shouldVerifyPresence,
            };
          },
        }),

        setCreatedVp: assign({
          createdVp: (_context, event) => event.data,
        }),

        clearCreatedVp: assign({
          createdVp: () => null,
        }),

        registerLoggers: assign({
          loggers: (context) => {
            if (context.sharingProtocol === 'OFFLINE' && __DEV__) {
              return [
                Openid4vpBle.handleNearbyEvents((event) => {
                  console.log(
                    getDeviceNameSync(),
                    '<Sender.Event>',
                    JSON.stringify(event).slice(0, 100)
                  );
                }),
                Openid4vpBle.handleLogEvents((event) => {
                  console.log(
                    getDeviceNameSync(),
                    '<Sender.Log>',
                    JSON.stringify(event).slice(0, 100)
                  );
                }),
              ];
            } else {
              return [];
            }
          },
        }),

        removeLoggers: assign({
          loggers: ({ loggers }) => {
            loggers?.forEach((logger) => logger.remove());
            return [];
          },
        }),

        setShareLogTypeUnverified: model.assign({
          shareLogType: 'VC_SHARED',
        }),

        setShareLogTypeVerified: model.assign({
          shareLogType: 'PRESENCE_VERIFIED_AND_VC_SHARED',
        }),

        logShared: send(
          (context) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: VC_ITEM_STORE_KEY(context.selectedVc),
              type: context.selectedVc.shouldVerifyPresence
                ? 'VC_SHARED_WITH_VERIFICATION_CONSENT'
                : context.shareLogType,
              timestamp: Date.now(),
              deviceName:
                context.receiverInfo.name || context.receiverInfo.deviceName,
              vcLabel: context.selectedVc.tag || context.selectedVc.id,
            }),
          { to: (context) => context.serviceRefs.activityLog }
        ),

        logFailedVerification: send(
          (context) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: VC_ITEM_STORE_KEY(context.selectedVc),
              type: 'PRESENCE_VERIFICATION_FAILED',
              timestamp: Date.now(),
              deviceName:
                context.receiverInfo.name || context.receiverInfo.deviceName,
              vcLabel: context.selectedVc.tag || context.selectedVc.id,
            }),
          { to: (context) => context.serviceRefs.activityLog }
        ),

        openSettings: () => Linking.openSettings(),

        toggleShouldVerifyPresence: assign({
          selectedVc: (context) => ({
            ...context.selectedVc,
            shouldVerifyPresence: !context.selectedVc.shouldVerifyPresence,
          }),
        }),

        setLinkCode: assign({
          linkCode: (_context, event) =>
            event.params.substring(
              event.params.indexOf('linkCode=') + 9,
              event.params.indexOf('&')
            ),
        }),

        resetShouldVerifyPresence: assign({
          selectedVc: (context) => ({
            ...context.selectedVc,
            shouldVerifyPresence: false,
          }),
        }),

        storeLoginItem: send(
          (_context, event) => {
            return StoreEvents.PREPEND(
              MY_LOGIN_STORE_KEY,
              (event as DoneInvokeEvent<string>).data
            );
          },
          { to: (context) => context.serviceRefs.store }
        ),

        storingActivityLog: send(
          (_, event) =>
            ActivityLogEvents.LOG_ACTIVITY({
              _vcKey: '',
              type: 'QRLOGIN_SUCCESFULL',
              timestamp: Date.now(),
              deviceName: '',
              vcLabel: String(event.response.selectedVc.id),
            }),
          {
            to: (context) => context.serviceRefs.activityLog,
          }
        ),
      },

      services: {
        checkBluetoothPermission: () => async (callback) => {
          // wait a bit for animation to finish when app becomes active
          await new Promise((resolve) => setTimeout(resolve, 250));
          try {
            // Passing Granted for android since permission status is always granted even if its denied.
            let response: PermissionStatus = RESULTS.GRANTED;

            if (Platform.OS === 'ios') {
              response = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
            }

            if (response === RESULTS.GRANTED) {
              callback(model.events.BLUETOOTH_PERMISSION_ENABLED());
            } else {
              callback(model.events.BLUETOOTH_PERMISSION_DENIED());
            }
          } catch (e) {
            console.error(e);
          }
        },
        checkBluetoothState: () => (callback) => {
          const subscription = BluetoothStateManager.onStateChange((state) => {
            if (state === 'PoweredOn') {
              callback(model.events.BLUETOOTH_STATE_ENABLED());
            } else {
              callback(model.events.BLUETOOTH_STATE_DISABLED());
            }
          }, true);
          return () => subscription.remove();
        },

        requestBluetooth: () => (callback) => {
          BluetoothStateManager.requestToEnable()
            .then(() => callback(model.events.BLUETOOTH_STATE_ENABLED()))
            .catch(() => callback(model.events.BLUETOOTH_STATE_DISABLED()));
        },

        checkLocationPermission: () => async (callback) => {
          try {
            // wait a bit for animation to finish when app becomes active
            await new Promise((resolve) => setTimeout(resolve, 250));

            let response: PermissionStatus;
            if (Platform.OS === 'android') {
              response = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            }
            if (response === 'granted') {
              callback(model.events.LOCATION_ENABLED());
            } else {
              callback(model.events.LOCATION_DISABLED());
            }
          } catch (e) {
            console.error(e);
          }
        },

        checkNearByDevicesPermission: () => (callback) => {
          checkMultiple([
            PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
            PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          ])
            .then((response) => {
              if (
                response[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE] ===
                  RESULTS.GRANTED &&
                response[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] ===
                  RESULTS.GRANTED
              ) {
                callback(model.events.NEARBY_ENABLED());
              } else {
                callback(model.events.NEARBY_DISABLED());
              }
            })
            .catch((err) => {
              callback(model.events.NEARBY_DISABLED());
            });
        },

        requestNearByDevicesPermission: () => (callback) => {
          requestMultiple([
            PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
            PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          ])
            .then((response) => {
              if (
                response[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] ===
                  RESULTS.GRANTED &&
                response[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] ===
                  RESULTS.GRANTED
              ) {
                callback(model.events.NEARBY_ENABLED());
              } else {
                callback(model.events.NEARBY_DISABLED());
              }
            })
            .catch((err) => {
              callback(model.events.NEARBY_DISABLED());
            });
        },

        monitorConnection: (context) => (callback) => {
          if (context.sharingProtocol === 'OFFLINE') {
            const subscription = Openid4vpBle.handleNearbyEvents((event) => {
              if (event.type === 'onDisconnected') {
                callback({ type: 'DISCONNECT' });
              }
              if (event.type === 'onError') {
                callback({
                  type: 'BLE_ERROR',
                  bleError: { message: event.message, code: event.code },
                });
                console.log(`BLE Exception:${event.code} ${event.message}`);
              }
            });

            return () => subscription.remove();
          }
        },

        checkLocationStatus: () => (callback) => {
          checkLocation(
            () => callback(model.events.LOCATION_ENABLED()),
            () => callback(model.events.LOCATION_DISABLED())
          );
        },

        discoverDevice: (context) => (callback) => {
          if (context.sharingProtocol === 'OFFLINE') {
            Openid4vpBle.createConnection('discoverer', () => {
              callback({ type: 'CONNECTED' });
            });
          } else {
            (async function () {
              GoogleNearbyMessages.addOnErrorListener((kind, message) =>
                console.log('\n\n[scan] GNM_ERROR\n\n', kind, message)
              );

              await GoogleNearbyMessages.connect({
                apiKey: GNM_API_KEY,
                discoveryMediums: ['ble'],
                discoveryModes: ['scan', 'broadcast'],
              });
              console.log('[scan] GNM connected!');

              await onlineSubscribe('pairing:response', async (response) => {
                await GoogleNearbyMessages.unpublish();
                if (response === 'ok') {
                  callback({ type: 'CONNECTED' });
                }
              });

              const pairingEvent: PairingEvent = {
                type: 'pairing',
                data: context.scannedQrParams,
              };

              await onlineSend(pairingEvent);
            })();
          }
        },

        exchangeDeviceInfo: (context) => (callback) => {
          const event: ExchangeSenderInfoEvent = {
            type: 'exchange-sender-info',
            data: context.senderInfo,
          };

          if (context.sharingProtocol === 'OFFLINE') {
            let subscription: EmitterSubscription;
            offlineSend(event, () => {
              subscription = offlineSubscribe(
                'exchange-receiver-info',
                (receiverInfo) => {
                  callback({ type: 'EXCHANGE_DONE', receiverInfo });
                }
              );
            });
            return () => subscription?.remove();
          } else {
            (async function () {
              await onlineSubscribe(
                'exchange-receiver-info',
                async (receiverInfo) => {
                  await GoogleNearbyMessages.unpublish();
                  callback({ type: 'EXCHANGE_DONE', receiverInfo });
                }
              );

              await onlineSend(event);
            })();
          }
        },

        sendVc: (context) => (callback) => {
          let subscription: EmitterSubscription;
          const vp = context.createdVp;
          const vc = {
            ...(vp != null ? vp : context.selectedVc),
            tag: '',
          };

          const statusCallback = (status: SendVcStatus) => {
            if (typeof status === 'number') return;
            if (status === 'RECEIVED') {
              callback({ type: 'VC_SENT' });
            } else {
              callback({
                type: status === 'ACCEPTED' ? 'VC_ACCEPTED' : 'VC_REJECTED',
              });
            }
          };

          if (context.sharingProtocol === 'OFFLINE') {
            const event: SendVcEvent = {
              type: 'send-vc',
              data: { isChunked: false, vc },
            };
            offlineSend(event, () => {
              subscription = offlineSubscribe(
                SendVcResponseType,
                statusCallback
              );
            });
            return () => subscription?.remove();
          } else {
            sendVc(vc, statusCallback, () => callback({ type: 'DISCONNECT' }));
          }
        },

        sendDisconnect: (context) => () => {
          if (context.sharingProtocol === 'ONLINE') {
            onlineSend({
              type: 'disconnect',
              data: 'rejected',
            });
          }
        },

        disconnect: (context) => (callback) => {
          try {
            if (context.sharingProtocol === 'OFFLINE') {
              Openid4vpBle.destroyConnection(() => {
                callback({ type: 'CONNECTION_DESTROYED' });
              });
            } else {
              GoogleNearbyMessages.disconnect();
            }
          } catch (e) {
            // pass
          }
        },

        createVp: (context) => async () => {
          // const verifiablePresentation = await createVerifiablePresentation(...);

          const verifiablePresentation: VerifiablePresentation = {
            '@context': [''],
            'proof': null,
            'type': 'VerifiablePresentation',
            'verifiableCredential': [context.selectedVc.verifiableCredential],
          };

          const vc: VC = {
            ...context.selectedVc,
            verifiableCredential: null,
            verifiablePresentation,
          };

          return Promise.resolve(vc);
        },
      },

      guards: {
        isQrOffline: (_context, event) => {
          // don't scan if QR is offline and Google Nearby is enabled
          if (Platform.OS === 'ios' && !isBLEEnabled) return false;

          const param: ConnectionParams = Object.create(null);
          try {
            Object.assign(param, JSON.parse(event.params));
            return 'cid' in param && 'pk' in param && param.pk !== '';
          } catch (e) {
            return false;
          }
        },

        isQrOnline: (_context, event) => {
          const param: ConnectionParams = Object.create(null);
          try {
            Object.assign(param, JSON.parse(event.params));
            return 'cid' in param && 'pk' in param && param.pk === '';
          } catch (e) {
            return false;
          }
        },

        isQrLogin: (_context, event) => {
          let linkCode = '';
          try {
            linkCode = event.params.substring(
              event.params.indexOf('linkCode=') + 9,
              event.params.indexOf('&')
            );
            return linkCode !== null;
          } catch (e) {
            return false;
          }
        },
        uptoAndroid11: () => Platform.OS === 'android' && Platform.Version < 31,

        isIOS: () => Platform.OS === 'ios',
      },

      delays: {
        DESTROY_TIMEOUT: 500,
        CONNECTION_TIMEOUT: (context) => {
          return (context.sharingProtocol === 'ONLINE' ? 15 : 5) * 1000;
        },
        SHARING_TIMEOUT: (context) => {
          return (context.sharingProtocol === 'ONLINE' ? 45 : 15) * 1000;
        },
      },
    }
  );

export function createScanMachine(serviceRefs: AppServices) {
  return scanMachine.withContext({
    ...scanMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof scanMachine>;

export function selectReceiverInfo(state: State) {
  return state.context.receiverInfo;
}

export function selectReason(state: State) {
  return state.context.reason;
}
export function selectReadyForBluetoothStateCheck(state: State) {
  return state.context.readyForBluetoothStateCheck;
}

export function selectVcName(state: State) {
  return state.context.vcName;
}

export function selectSelectedVc(state: State) {
  return state.context.selectedVc;
}

export function selectIsScanning(state: State) {
  return state.matches('findingConnection');
}

export function selectIsConnecting(state: State) {
  return state.matches('connecting.inProgress');
}

export function selectIsConnectingTimeout(state: State) {
  return state.matches('connecting.timeout');
}

export function selectIsExchangingDeviceInfo(state: State) {
  return state.matches('exchangingDeviceInfo.inProgress');
}

export function selectIsExchangingDeviceInfoTimeout(state: State) {
  return state.matches('exchangingDeviceInfo.timeout');
}

export function selectIsReviewing(state: State) {
  return state.matches('reviewing');
}

export function selectIsSelectingVc(state: State) {
  return state.matches('reviewing.selectingVc');
}

export function selectIsSendingVc(state: State) {
  return state.matches('reviewing.sendingVc.inProgress');
}

export function selectIsSendingVcTimeout(state: State) {
  return state.matches('reviewing.sendingVc.timeout');
}

export function selectIsAccepted(state: State) {
  return state.matches('reviewing.accepted');
}

export function selectIsRejected(state: State) {
  return state.matches('reviewing.rejected');
}

export function selectIsInvalid(state: State) {
  return state.matches('invalid');
}

export function selectIsBluetoothPermissionDenied(state: State) {
  return state.matches('bluetoothPermissionDenied');
}

export function selectIsBluetoothDenied(state: State) {
  return state.matches('bluetoothDenied');
}

export function selectIsStartPermissionCheck(state: State) {
  return state.matches('startPermissionCheck');
}

export function selectIsLocationDenied(state: State) {
  return state.matches('checkingLocationService.denied');
}
export function selectIsNearByDevicesPermissionDenied(state: State) {
  return state.matches('nearByDevicesPermissionDenied');
}

export function selectIsLocationDisabled(state: State) {
  return state.matches('checkingLocationService.disabled');
}

export function selectIsDone(state: State) {
  return state.matches('reviewing.navigatingToHome');
}

export function selectIsVerifyingIdentity(state: State) {
  return state.matches('reviewing.verifyingIdentity');
}

export function selectIsInvalidIdentity(state: State) {
  return state.matches('reviewing.invalidIdentity');
}

export function selectIsCancelling(state: State) {
  return state.matches('reviewing.cancelling');
}

export function selectIsHandlingBleError(state: State) {
  return state.matches('handlingBleError');
}

async function sendVc(
  vc: VC,
  callback: (status: SendVcStatus) => void,
  disconnectCallback: () => void
) {
  const rawData = JSON.stringify(vc);
  const chunks = chunkString(rawData, GNM_MESSAGE_LIMIT);
  if (chunks.length > 1) {
    let chunk = 0;
    const vcChunk = {
      total: chunks.length,
      chunk,
      rawData: chunks[chunk],
    };
    const event: SendVcEvent = {
      type: 'send-vc',
      data: {
        isChunked: true,
        vcChunk,
      },
    };

    await onlineSubscribe(
      SendVcResponseType,
      async (status) => {
        if (typeof status === 'number' && chunk < event.data.vcChunk.total) {
          chunk += 1;
          await GoogleNearbyMessages.unpublish();
          await onlineSend({
            type: 'send-vc',
            data: {
              isChunked: true,
              vcChunk: {
                total: chunks.length,
                chunk,
                rawData: chunks[chunk],
              },
            },
          });
        } else if (typeof status === 'string') {
          if (status === 'ACCEPTED' || status === 'REJECTED') {
            GoogleNearbyMessages.unsubscribe();
          }
          callback(status);
        }
      },
      disconnectCallback,
      { keepAlive: true }
    );
    await onlineSend(event);
  } else {
    const event: SendVcEvent = {
      type: 'send-vc',
      data: { isChunked: false, vc },
    };
    await onlineSubscribe(SendVcResponseType, callback);
    await onlineSend(event);
  }
}

function chunkString(str: string, length: number) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}
