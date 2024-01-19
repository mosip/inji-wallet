import argon2 from 'react-native-argon2';
import {AnyState} from 'xstate';
import {getDeviceNameSync} from 'react-native-device-info';
import {isAndroid} from './constants';
import {generateSecureRandom} from 'react-native-securerandom';
import Aes from 'react-native-aes-crypto';

export const hashData = async (
  data: string,
  salt: string,
  config: Argon2iConfig,
): Promise<string> => {
  const result = await argon2(data, salt, config);
  return result.rawHash as string;
};

export const generateRandomString = async () => {
  const randomBytes = await generateSecureRandom(64);
  const randomString = randomBytes.reduce(
    (acc, byte) => acc + byte.toString(16).padStart(2, '0'),
    '',
  );
  return randomString;
};
export const generateBackupEncryptionKey = (password, salt, cost, length) =>
  Aes.pbkdf2(password, salt, cost, length, 'sha256');

export interface Argon2iConfig {
  iterations: number;
  memory: number;
  parallelism: number;
  hashLength: number;
  mode: string;
}

export default function testIDProps(id) {
  return isAndroid()
    ? {accessible: true, accessibilityLabel: id}
    : {testID: id};
}

export const removeWhiteSpace = (str: string) => {
  return str ? str.replace(/\s/g, '') : str;
};

export function logState(state: AnyState) {
  const data = JSON.stringify(
    state.event,
    (key, value) => {
      if (key === 'type') return undefined;
      if (typeof value === 'string' && value.length >= 100) {
        return value.slice(0, 100) + '...';
      }
      return value;
    },
    2,
  );
  console.log(
    `[${getDeviceNameSync()}] ${state.machine.id}: ${
      state.event.type
    } -> ${state.toStrings().pop()}\n${
      data.length > 300 ? data.slice(0, 300) + '...' : data
    }
    `,
  );
}

export const getMaskedText = (id: string): string => {
  return '*'.repeat(id.length - 4) + id.slice(-4);
};

export const faceMatchConfig = (resp: string) => {
  return {
    withFace: {
      encoder: {
        tfModel: {
          path: resp + '/model.tflite',
          inputWidth: 160,
          inputHeight: 160,
          outputLength: 512,
          modelChecksum:
            '797b4d99794965749635352d55da38d4748c28c659ee1502338badee4614ed06',
        },
      },
      matcher: {
        threshold: 0.8,
      },
    },
  };
};

export const getBackupFileName = () => {
  return `backup_${Date.now()}`;
};
