import {Camera, CameraCapturedPicture, PermissionStatus} from 'expo-camera';
import {Linking} from 'react-native';
import {assign, StateFrom} from 'xstate';
import {createModel} from 'xstate/lib/model';

import {faceCompare} from '@iriscan/biometric-sdk-react-native';

const model = createModel(
  {
    cameraRef: {} as Camera | null,
    faceBounds: {
      minWidth: 280,
      minHeight: 280,
    },
    capturedImage: {} as CameraCapturedPicture | null,
    captureError: '',
  },
  {
    events: {
      READY: (cameraRef: Camera) => ({cameraRef}),
      CAPTURE: () => ({}),
      DENIED: (status: PermissionStatus) => ({status}),
      GRANTED: () => ({}),
      OPEN_SETTINGS: () => ({}),
      APP_FOCUSED: () => ({}),
    },
  },
);

export const FaceScannerEvents = model.events;

export const createFaceScannerMachine = (vcImages: string[]) =>
  model.createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QDMCGBjMBldqB2eYATgHQCWeZALgMQBKAogIIAiAmgNoAMAuoqAAcA9rGpkhefiAAeiAIwAmAOxKSCgByKArFwCc6rVoAsANgUAaEAE9ERuavUBmLboUKuRrUvWatAXz9LNEwcfEJSCmoSdAALMHQAawooAAViAFsyWFEJGhYGADkASQYWbj4kEGFRKnFJStkER0c5EnUjR29mnxbHT0sbBCMuLjUjXV0lCZ0dNwCgjGxcAmJySipouMTktKJM7Lq8wpKyuQrBETEJKUbm1vbOp0ceuT6tAcQTE0cSJXHJ3wmORcEzzEDBJZhVaRDaxeJJPCpDJZHJ4GgAcToTAKABVSuUpNUrvVQLcWm0Ol1nk5Xv1rIgFFoTCR-vp2lxHApdCZ1GCIaEVhF1iQBMiDhIWGBKJAaAB5FKFAD6WAYOJxRQK6KwBMqRNq1wa8i4TN+Kk6emUcnUGg+Q1Mpqtjm5E3cSkcfMWAvCayior2KLqkulEBoTBSKUVADFZQBhACqKrKvEJl31JJkiB8RhZPKmmg0nl0jltxgUJAmEyUcnGKi4SlBgXBnuW3phJCIYAAjgBXOC1RG7faojFY3H45O61N1G6Z9o59R5xTtFzF+lNAzlivW+uaEZGD0hFvQ4Udnt9nZi4f5Yrj85VKcG0mz7OmBf6JeF1eDDrM1ncrjtOokyvAekKCiQsAtskNAxmGOJxowOoXDU06GggS6qBo2h6AYxhmLac6dP89gmNyRhuryjb8kepC4AIVDdkQ0EQBIYBrAAbkICRsdRUK0ag9GMckCAUJxuBpuUSH3ihj4ZuhyiYfmOj6IYpgWGuWjViy1bGppSguDycigV6qx0QxTGIjQxBEEIpACAANqgVDILZ6QkLx4FmUJiIiXgYlOXUkkTshxIzvJC5qEpOGqfha60m0+kjDo6gmEYaUAcZNEkOxxBkMgVjMaxHFcTxzZ8dluX5cJolCOJgW8FJeqoU+6EmEoZZKBycheEY7h7nItpAq0daaORii6CM9aZeVOVMVVlksYQxXce5ZXgbNeUFT5NV1RIklnCmMnpo0cg8h1XU9X1HgDRp3wkF4mjNAocgTZyCjTetlVbVAVlEDZdmOc5rmrYeM1fdVfm1QFe0NcF0mhWhp3Wr8F1-FddglqdJAjXIL2OHoxpKAEjZ4EIEBwFIHnhIdCMtQAtAoRi2nTzIjCM9iKJSbgTB9rbrDTaZhYztpI5uEw8mYaWjf4VFrXzURwtsA6Xs18OC2h7W2goJijNWW5pVh7qy6D4Ftn6Q6BlKZCQALqsncazLPXoZg6CMTolkY6gkH0lYaFyzxurzx6+irEjokQ+BUDbk5HWFwImk73KMmz7trtr2bJ1wuOGO49i6EHQpRKevawP2SL+uK6ZNbJjTfLoCU6FMng9bjtqdJhrI6ECpGaUbCwm96kFhMkts1-I5FexWkwguaTNxS42nDN0uhaO0jKUf3YHel5FlQKPx22OpgyaPdbNcNrxhpfjMubyZpAbfNe8x7TcnVqRbTOK4pHUhNSiY2WK9egeAmmlF6BdsqoHsmQCA+8hZsxRvjSYyVnSDQAm0Q27UAKKCJsbLex52KQOgbAxGAI2jaG+E4bkUwbqDC0M9FkugJ5IyzpyGWAQgA */
      predictableActionArguments: true,
      preserveActionOrder: true,
      id: 'faceScanner',
      initial: 'init',
      states: {
        init: {
          initial: 'checkingPermission',
          states: {
            checkingPermission: {
              invoke: {
                src: 'checkPermission',
              },
              on: {
                DENIED: [
                  {
                    cond: 'canRequestPermission',
                    target: 'requestingPermission',
                  },
                  {
                    target: 'permissionDenied',
                  },
                ],
                GRANTED: 'permissionGranted',
              },
            },
            permissionDenied: {
              on: {
                OPEN_SETTINGS: {
                  actions: 'openSettings',
                },
                APP_FOCUSED: 'checkingPermission',
              },
            },
            permissionGranted: {},
            requestingPermission: {
              invoke: {
                src: 'requestPermission',
              },
              on: {
                GRANTED: 'permissionGranted',
                DENIED: 'permissionDenied',
              },
            },
          },
          on: {
            READY: {
              actions: 'setCameraRef',
              target: 'scanning',
            },
          },
        },
        scanning: {
          on: {
            CAPTURE: 'capturing',
          },
        },
        capturing: {
          invoke: {
            src: 'captureImage',
            onDone: {
              actions: 'setCapturedImage',
              target: 'verifying',
            },
            onError: {
              actions: 'setCaptureError',
              target: 'scanning',
            },
          },
        },
        verifying: {
          invoke: {
            src: 'verifyImage',
            onDone: [
              {
                cond: 'doesFaceMatch',
                target: 'valid',
              },
              {
                target: 'invalid',
              },
            ],
            onError: 'invalid',
          },
        },
        valid: {
          type: 'final',
        },
        invalid: {
          type: 'final',
        },
      },
    },
    {
      actions: {
        setCameraRef: model.assign({
          cameraRef: (_context, event) => event.cameraRef,
        }),
        setCapturedImage: assign({
          capturedImage: (_context, event) => event.data,
        }),
        setCaptureError: assign({
          captureError: (_, __) => 'Failed to capture image.',
        }),
        openSettings: () => Linking.openSettings(),
      },
      services: {
        checkPermission: async callback => {
          const {status} = await Camera.requestCameraPermissionsAsync();
          if (status === 'granted') {
            callback(FaceScannerEvents.GRANTED());
          } else {
            callback(FaceScannerEvents.DENIED(status));
          }
        },
        requestPermission: async callback => {
          const {status} = await Camera.requestCameraPermissionsAsync();
          if (status === 'granted') {
            callback(FaceScannerEvents.GRANTED());
          } else {
            callback(FaceScannerEvents.DENIED(status));
          }
        },
        captureImage: async context => {
          if (context.cameraRef) {
            return context.cameraRef.takePictureAsync({
              base64: true,
              quality: 0.7,
              skipProcessing: true,
            });
          }
          throw new Error('Camera reference not found');
        },
        verifyImage: async context => {
          const {capturedImage} = context;
          if (!capturedImage || !capturedImage.base64) {
            throw new Error('No image captured');
          }
          const rxDataURI =
            /data:(?<mime>[\w/\-.]+);(?<encoding>\w+),(?<data>.*)/;
          let isMatchFound = false;

          for (const vcImage of vcImages) {
            const matches = rxDataURI.exec(vcImage)?.groups;
            if (matches) {
              const {data} = matches;
              try {
                isMatchFound = await faceCompare(capturedImage.base64, data);
                if (isMatchFound) break;
              } catch (error) {
                throw error;
              }
            }
          }
          return isMatchFound;
        },
      },
      guards: {
        canRequestPermission: (_context, event) => event.status === 'denied',
        doesFaceMatch: (_context, event) => event.data === true,
      },
    },
  );

type State = StateFrom<ReturnType<typeof createFaceScannerMachine>>;

export function selectCameraRef(state: State) {
  return state.context.cameraRef;
}

export function selectCapturedImage(state: State) {
  return state.context.capturedImage;
}
