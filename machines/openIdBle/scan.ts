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
  request,
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
    requestCount: 0,
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
      BLUETOOTH_ALLOWED: () => ({}),
      BLUETOOTH_DENIED: () => ({}),
      BLUETOOTH_ENABLED: () => ({}),
      BLUETOOTH_DISABLED: () => ({}),
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
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYEMB2BiAygYQCUBRIgOQH0AhAGQFUCBtABgF1FQAHAe1gEsAXXlwzsQAD0QAWAEwAaEAE9EARgCsygHSSA7JKYBmadoBsq6QA5lx4wF8b81JlyESFAGIB5PLRzM2SEG4+QWFRCQQZeSUEZSYLDXN9cyZtZUlkgE5laX07B3RsGiJyIgICD0ZWUSCBIREA8MjFRGkMyQ1pNLbzcyNJGWNJPJBHDA1YfjQAJ34ABTApgFteWD5hPAALMBQAa1wAFQBBAn3yWdKAWQBJHBwrjwo8AAkiPABpP2qeWtCGqT0tKomOkMp0UqZVFEVHFzAkkikLIMesDhqMNCgtrtSGBpgAjBQAETAADdeCg4PMlis1mMMdsdrwMFAsKQiMdKABNEqkQ5FAmfAI1EL1UDhWLaJgaYEGHSmYzSPpQmJMKwafR6ZQmTVMDKqHSogrozE7bF4wkkskUhbLVZ1I30xnM1nsrkEm686hEflVQXfYVhaESqV6dUmVTyxXNZUZWGGVQZDLGDL6HWtbQGzD2rE4qb4omk8mwSk2mkaKZgACOAFc4IImSy2QROdyPV6BZw-XUAzFBhktMlJOHpEntG1jErYuZ2ikMnFJFk4qmM7Tjabc+aC1aqbbhGXKzWJo6Gy7yG6cK3vf4O8Eu38e-P+8ChyOxxPDJpjLpVPo1OpBoNlyzE0czzC1C2Lak7TADA0FxAAbSAsHbQJO1+UUVF7R9B3lF9JHHKNYn0YwNHjJgk0MfQkh6VRALpXZHUoOCa34LguH4DYIJ3FcHXrGhaCIfYPA8fYnnIQ5qGoDwAHU2x9a8fhFcQWmUcxVClb88PSEx5x6CcmGSKVtFaJhVG0IF+m0dN7BGQ06IZJlGOY1j2M40s7KPPiBKEkTTzIK5ZKvFCbzQpSEGkcNYXnZRouMRJZ1BCdpCYSVLBMBNtBTXoZFo40GKYsAWLYjjrUg3doNghCICQuSgoU7twtirQshiuLUyVYwDC0QcYz0HJpEkfQaOstF3Ic-LCvYnAFk3ICPLoLzhNEsgL2QoVb3QhAUwTBJUifbRzAyqc9OyDph3jNo9X6hUcp4qBHIK5yNimqYZtG5lPMExbT3dPlVtQxTGjI4jjCsNJktScx0qVSzJQypNQWi0ciOkG76LGpyiue17ct4+bPp8s8VuUQK1pC8Itr7A7YkHfbDskdrgTVZJlETCwYWi1H7Lu8bHqxy092rWs5v4-Glp5X6atJgHECIg6NA61Q9STfrkXpqNIc0dJNXMDqYx-fQrPyTM3vuianum-ny0Fw9cZF7zRMJiWSf+7s9GseXQb0FIVKhqMQekDRk1BJJYjMSjlE5vKMcmi3yQ0cr4MQv7guliIgY9kGvYh33omi1VVNUkzVF6UEE0A+Do+K7caSJDBeEQw5ZlmMS8H2K4ADUiGTuq7wayLmqsVqEvV3opWTJIjDh3QMnLnmitcupa-rqqAHFhI8cgcAEtvSBX3xJZdu8ZByEigRMweVUsCdYgD1JM514wkjaXJhsNCuHqKpeG6blu2877v-S91MLCIcqlKIZQNuYJUkg0iB3jBKPUbsC6GxspmDAOZKAbktEWEqXEv5VUbs3Q4rcO5dwPinbsCD5ZTgOvpLI-Q1BviMhoKwegLL7WUD+IaRsxjoOmJg-M2CF7CHwVgNeglN7byuLvfezsKG9wyLoFh74zKgl6PoRKqQSLynnAbaKSUUav2NghaYjo8DCHQSgYUWA8APFZCQh4vkcD7HKByAKXx5EbW-PoNU+k9QZQRPoZM0CcjtANomJGijdCDVoiYqYZiLHbGsWICYaB+BgA0GgAAZukqYAAKAkRBnGuPIG3C4RAPC0H2AASiwCNOJCSMCWOFAA9aoVvG+NUjoFMRkgkaKjDA0cGhekdWBJ0b8hieEaCyYyCAjTml1GcIcUgrSybQlHhlCKhEFQGBCaPHUsUTDWFVoBGZGA5lMnMU0pJiz8DLIYMTDxPcNqTlvoNWK2ykr9OiDA1SgddRxg6ipXQpzZnzJucIJZKzpByOeaFV5wz3mWAMDs75Ug6EJGTJZQc6oLqgvOeCqxty8D3P0LCwBLyESIq2Sir50DIEsJ6pPQaEDAKwA2FwAA7gARSmNQLgUBGRYAgMIDJjJiRcB2Bk3l-LBUYFWanTh7sDC9jMCZT8A1oHZGIhKAwU4chzhnkYsY7KuUyoFUKs81xbgKu7OKN5NLDB0qjEkUwHRZQ6n6NYCwL8pmmp5Xyi1JqWLxPrM4ioxRiA4FmA8Letq7yahkB7L5nDNRJTMlquIaosVflxYOQCHBywcFMUyfYXArnNKwMQPARBSG+XblcGt5BpGeHjS80yxEdDDl1CDRWwSBnDm0FKKwplU06G4ag2kiSiX1lsaQex+x3G+k8e0uQAzzqBwVECEck5zC0WnXWKAGhGSzCmAK8sqwsApMmOkzJOSFh5LnQu+4FAykVKqbUkaB7HTHowKe89cBYBttCn1WERkNLAk4QbSEA7toURUrEWIRd93XJnUewQiwwBcCrPwGxyya3UGA+EeU0C9R9gGq0LFXqDCATAGIDEmA5VQEEeSK4GAslcCwGeJ9rx9hEeUukQOql5T7QavpJhAcvWdH6rERREdjXx3oxsRjjoWNgDYxxrARAAAazxlkr2KASB4ZDyVtPCJ0QTMYhyifDOJgi4ZNA-nSFlS+vRJmTsUwxpkqmwLqfY5x69aSMnZNyY+uxvGX2lKuOUypNS6mGjo15pjamNNcH4wgA6E4OrEWyF0JKcmdZ7oU4l5T3mmQpf8xoDDWGcN4dIAR9LOh2hJWBG0DKEo75ZdMloVhlE8I9GyIBcspIwCcp-bAMACE0PtxQFgWgswCSHEXeQYghwcAPHS3o2GMZEgNXjDrbQSoWs+KIjIUE4ysgTrRMN+uY2mTjEmzcpkM2uM3B463Rrod+yzlivGb8bQjs6x8a0Qw85wYsxQddi0o3xuPem7NrenpW7kHbngTbRl2j-ZVDCQYRkJyziHcOPo0UQQ0KG9Du7R6JtTcPS9zuBArhuC5MsgkLca2zFOMQbl-FnHpdaG69KKqYFAi6UdrdHQRc9DlHq8nI3KcPZp46F7xD2ec6INzopfHyFwvM4otSgvTtqD8WraI6bYSmBjP1ZGEZZe3dh4r57s2SX1aIIR7XFKQN6DUkCAnbRWgPzXabrIfYdSpCiUlTURqpk3Zh-d6nT2oAvcEivFenpyA+FKOQOdW9SBa9M2szaHy1SsLIm1tomoJyWE0KDFmyVegmXnLb2PR6CjkjgnBI86XeghJZqfFmxczvfnk9HinsOCWO9e-gcLH33dmakNFNSIIyKqQBQDqMrROHDN6CYBUlFYpGCb-Lib4-E+zdR5I3PfPBiSnSCmUi+0gmcKVJRYu7r69xE6LtSHhoY9H+ghc0-LAc-FXIgDnJdeSD3cmIJdoMyIiRRNRbVQ7F1X8DoIyIwJWFUWKQ-MfAAunPAFbIgAAKV43ANqkgJliSBgO-BfAsEQOf1+WGWLgOR2TSAsGwLj3-yVxQF-X-SgAvVgCvVSVvRCwfRwCeGOGkRXiixiw-Xi0zF-xwK4J4LPT4MAz50skJ3+yMBlGlCgRdSMBDzBhhl6GLnDHYKp04Mdyq14Ew2w1w2dwa1nwL0oinEYLgNHFoMHWfzIg-DD32mSAplsAUwUPuzQBQHJA4HSSqitRuFkSeXIM2jMjUjMkfjIh-E-B-GfxQKMAVDMjwkwKKxHzlx-XLAACsklEIYibUnDU48cB1Pxgw4hZxQ5VJh8PMQij1iQFheAskFBHQrgIBoJBB+AFAsA3BiFih25xIrhLx4i58wokhvcdQZwzsA9n8nVA4ZAEMUw0gehzCNAuj4lej+jBiMBhjRjxim1pEpjqAZi+dvwh1sgDZrAkhKIvD188IdU2FXNwochv95DR97tDiei+imQBihiBBRiHDXc+c9d-kJRDcRc9QjtE1hkQZoNB8zAgiii7d7sUByw0klcOBhVRVf0JUpVxgf9ASW8CTacOAEBxUuB0AWlWA+cgkljfdVjvVvCkgEgti5xI8shsT2jqT0RaSiSsAFgz0pgNAOA4I0kOMlhKSATii8TxTnt6TGTmS6g-B7j5QOgVQOsDpBp0CjtscEhTAdAdQYw0hKJ9jxU0AO8IBwSzjITJ9rU4jl0dcWgHiWE-iXjEhDBPwUTOpEwB9DBegpw8J7SMBiRHTeBnTTjziq0BICAuR6dGdG0lsX17iDY-TnjH5Az3jTd1R9ddRR0shIYkZAI5lUAD1KibgPT0th4fkrAQ8dFBwvknxAJSsIAO8xowAiAphpT3TYj0t9FoFl8pREhfkzJwYhgFMHSnTRzqj89U4OlMp-Eekch+0fkZBzceg-jU0iJI4mR+VtThA+Y443ocAb0qwBDJISU25HFlonY5iC9+gzAtA0wDoQYVQ19c5tR5ZRxgQIYDpg9TyoBzzCTLzY4Mkby7yHyvBszHFHZPRZivSEjPzJMfytR-yTdoQjBi8J4ZA3YOpfUPM3poLhQryMkrYDxD0y0iAYJE4sBHyUKKBXz0LGtFEUpkhhwZBdAzJlA9IHxkwZAJl9IYF80FMqKmSYKMBaKBYGLHQmKWKEI2LkLnyKA0LSCpZXZeKEh+LBg+hhKlQExyMvVTB+owwYxILqK6glK3phFsB2LtKWw3zML5ib4tUVISIjJkwIc5R7L5KaK4LZomQXLNKnzItdKMKID5iyNF8ESEx+9dRA9oRwwtBokEwBhQQBoQqLzFLwrayKpEI3LIsucec893zU55wlEDY9V9p-ZYpzLLNFYUgjIdZZwzBCqFKlLTjl4sBCFf5SF0tFYQZDJrL1ADAgQYNc5kp9caESdrA2z-juI0YoLQrHKSroIhqKrHEqrNdxrUhNAIEuru1woCKEBdRYwurb9zo2gFzrIMAuBBj4AAhRharuwABaDIJUH64iZKYGkGkGtIQCRkMIwQLo763uaKeWXfYPH8HULhRKSKSyY09I5GNotEVJGYFyzYekWGjaBUdoSwfqc7I3ehPSVoNUeEVIdIHUJ4zmNcUCTcHBauNpfSu8ZWahLSOhNIYXcy+ILpBzVIA2as2S1cECLBcCXBNyHGKAYm0KXQSUWKfmjWBhea6ESa-SREJWbIKslmmWtTDmksO0eioWJkZWsUdA9SGMfw2UaKNFZUMyNUf3A2dICPMiY2s0U2ly+OdSyAG2lQV1MeSPMiYuCebW5UfOL2NmIHKcCikaRW02R6FykOmIfVFhBBBEswIwF2vWOESwT8IGIwawSCtO+eeWu0N6TOn2SUbUUyWa3Il28URzP4ywMOTsyuueFyGusqIOiATOq6avdURNSwZERRPSAyUyVocKbIc6PYqW26KumOF6S0EekwIdUEc6FmLpQaPQ6IP8YZYEecP3WIeUZO2yVOvu82De68xWkeruzdPeqzAaYudqcKbRIucKcBT8YUlO1eu+pSy2m2JWry5w-oPsawcS+UKwK6GOjqdoWvZ2g6dRUcXuyuJShOSqTOx-PscKYPZIP8TUJA6ISGQhlMEyFIcM5MWeSuFy-BLev5Xe1K9+w+xKTqVKeGAJLKQBt+O+5hyBuqlMAOc6CwJgxRdIBmIdVSbSFURGaJBhj+difBZQTOwcLNHQCUSebIInaGTqecGBfK3UBfQojzd+M2dRzJDABQdiR0TRjq7K3RyyfRkjKMECwOUcB+cdOIARtBDBWWrcc2kRPa4OkRu1LpJqBMA6PCRGVSCTeWa-dhSwLhWJHMQlD3bmjaCMwOPfThOIDKFmF2rYnxHoQaFmboLKfFAAitCFRSHJlWxMYZIUxR1SVurVfoYvWTUwKStlDlANWVRkeun8WEIXdK9VaJZ-AnRFVIBUDIknAZs1QNOVY9PssAeur2U+txvtWmQYScxqMEKmZKZ4u0hTf1c1NZiYLgUNCBhKgvNQfqKUSBGcA1N2TNAOL5R+L2HRCx3GwZq5xkDQGCUkKAQk0tLgJ4LgTDeuv3fM2BlUIho6AZRe+WBMQYB4kyRMAtItEtKAMtepqxUZoiF51VJKcMaZ+o4iXoQYHpHWEya+42b9a2yJuG9qiyfqUycDa6mBR+Pk+J3fIHFDBZe7E9FQ-gkelmYiXUTlmmHlkJGMd2ohuIXFIyEVhPaw2wnDEe0dKUUJGMffOc3l-3ZV0iA19V4rJTFTcrXzVLfB-6giGBHxNQRYwZaDSyWja1srZjO1yrcVgDVYUZvsEwIiB-IyFGnWCcfxeWMZlRZKB2r1pLHzTcVLLVmrfgfB2m-3NQWlrFUyLLEyP05YzhBUamAJsYDokewwIdH3FY-3bkgiHRdFpDR+LIdURIfY+PeHLejKfylmQpwuRJ9famLQYBCjSMr1fY1vSbfs+5sg+Yk08jA7UcbCSyfCaIHYzQIfSXawRBf5qk1Uiwk-GbXV0EfsO-AnOKJ-ZAgaEiQaDAqiR+davcI9h7E97ggN1QoNtlkm6-C97FlIa9l2mt8Z1NS7XfJlyt0U4-XA7g6rOwrNoJBIdQAaSGHCIiZ-IwMDn8CDnIKD193E49uD99zN39kDDQiXIJbQ9UXQ9Y0loEToV17llUfYsIiIqI-B8MGlntHWJWQYfoLIwwVAnCPQW6lmfYsoio4e8j8mRWHxGEfxNrZB+g3vcKVdtJxWDHfY0F3gcFxiqFmFzZ2TmWZEeWUw6-Y0z8rIxWYZNAvIoFLA4I0U4E44sEpMyErNkwDoFSNDwS3schloWUGJwYNQJMUvBcnE5vMUnEOk6tt2ut1dhtjx3OXKzdddnqrUcG5zt9pchMl084+Ljk+tw1lLloDt-5cMTs5WSwGslYFAesmTh5uqiwO6yifSHUXxo7WcHxGBPVajiUXtHszAPsvKQc4c25+uyGLCPUZIDrdIa61oGAroZzPoAYSLjzPLprhdx5+ejoZBgfaRr8aBLYlhMiQcaS4SqPSixWhy2Ch+4z5r12W06hfZ7LFSRWJUHWTWciUcCUNQPOPqsKh7iKqAW8tJe8zRgd1738971SGO523roiZKcdfofDoHnakHsBgz5isqzRjI9FiwVrhDeUBHlH4vGGcZHoMyF9uSoqpyxWjOkzhAdQc920u-L2uowC4TjqQdVg2TDH+7maUqxObbpp8IVngOdnhvbfDKm6toNUVIz8K6lrWn277aoX-mQaiJp7u8DtYiX4tNVKAuPSeMbKgaXKy6gquwGwIAA */
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
            START_PERMISSION_CHECK: '#scan.checkNearbyDevicesPermission',
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
                  target: '#scan.checkingBluetoothPermission',
                },
                NEARBY_DISABLED: {
                  target: '#scan.nearByDevicesPermissionDenied',
                },
              },
            },
            enabled: {
              always: {
                target: '#scan.checkingBluetoothPermission',
              },
            },
          },
        },

        checkingBluetoothPermission: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkBluetoothPermission',
              },
              on: {
                BLUETOOTH_ALLOWED: {
                  target: 'enabled',
                },
                BLUETOOTH_DENIED: {
                  target: '#scan.bluetoothPermissionDenied',
                },
              },
            },
            enabled: {
              always: {
                target: '#scan.checkingBluetoothService',
              },
            },
          },
        },

        checkingBluetoothService: {
          initial: 'checking',
          states: {
            checking: {
              invoke: {
                src: 'checkBluetoothService',
              },
              on: {
                BLUETOOTH_ENABLED: {
                  target: 'enabled',
                },
                BLUETOOTH_DISABLED: [
                  {
                    cond: 'bluetoothAlreadyRequested',
                    target: '#scan.bluetoothDenied',
                  },
                  {
                    actions: 'setRequestCounter',
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
                BLUETOOTH_ENABLED: {
                  target: 'enabled',
                },
                BLUETOOTH_DISABLED: {
                  target: '#scan.bluetoothDenied',
                },
              },
            },
            enabled: {
              always: {
                target: '#scan.checkingLocationService',
              },
            },
          },
        },

        bluetoothPermissionDenied: {
          on: {
            APP_ACTIVE: '#scan.checkingBluetoothPermission',
            GOTO_SETTINGS: {
              actions: 'openBluetoothSettings',
            },
          },
        },

        bluetoothDenied: {
          on: {
            APP_ACTIVE: '#scan.checkingBluetoothService',
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

        setRequestCounter: model.assign({
          requestCount: (context) => {
            console.log('requestCount: ', context.requestCount);
            return context.requestCount + 1;
          },
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
              callback(model.events.BLUETOOTH_ALLOWED());
            } else {
              callback(model.events.BLUETOOTH_DENIED());
            }
          } catch (e) {
            console.error(e);
          }
        },
        checkBluetoothService: () => (callback) => {
          const subscription = BluetoothStateManager.onStateChange((state) => {
            if (state === 'PoweredOn') {
              callback(model.events.BLUETOOTH_ENABLED());
            } else {
              callback(model.events.BLUETOOTH_DISABLED());
            }
          }, true);
          return () => subscription.remove();
        },

        requestBluetooth: () => (callback) => {
          BluetoothStateManager.requestToEnable()
            .then(() => callback(model.events.BLUETOOTH_ENABLED()))
            .catch(() => callback(model.events.BLUETOOTH_DISABLED()));
        },

        checkLocationPermission: () => async (callback) => {
          try {
            if (
              (Platform.OS === 'android' && Platform.Version >= 31) ||
              Platform.OS === 'ios'
            ) {
              return callback(model.events.LOCATION_ENABLED());
            }
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
          if (Platform.OS === 'android' && Platform.Version >= 31) {
            const result = checkMultiple([
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
          } else {
            callback(model.events.NEARBY_ENABLED());
          }
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

        bluetoothAlreadyRequested: (context, event) => {
          if (context.requestCount > 0) return true;
          return false;
        },
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
