import { Platform } from 'react-native';
import argon2 from 'react-native-argon2';

export const hashData = async (
  data: string,
  salt: string,
  config: Argon2iConfig
): Promise<string> => {
  const result = await argon2(data, salt, config);
  return result.rawHash as string;
};

export interface Argon2iConfig {
  iterations: number;
  memory: number;
  parallelism: number;
  hashLength: number;
  mode: string;
}

export default function testIDProps(id) {
  return Platform.OS === 'android'
    ? { accessible: true, accessibilityLabel: id }
    : { testID: id };
}
