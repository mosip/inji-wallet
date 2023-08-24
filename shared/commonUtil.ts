import argon2 from 'react-native-argon2';

export const hashData = async (
  data: string,
  salt: string,
  config: Argon2iConfig
): Promise<string> => {
  const result = await argon2(data, salt, config);
  console.log('argon--result', result);
  return result.rawHash as string;
};

export interface Argon2iConfig {
  iterations: number;
  memory: number;
  parallelism: number;
  hashLength: number;
  mode: String;
}
