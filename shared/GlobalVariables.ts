import {getVersion} from 'react-native-device-info';
import ShortUniqueId from 'short-unique-id';
import {APP_ID_LENGTH} from './constants';
/* eslint-disable @typescript-eslint/no-var-requires */
const dependencies = require('../package-lock.json').dependencies;

function getTuvaliPackageDetails() {
  let packageVersion;
  Object.keys(dependencies).forEach(dependencyName => {
    const dependencyData = dependencies[dependencyName];
    if (dependencyName == '@mosip/tuvali') {
      packageVersion = dependencyData.from
        ? dependencyData.from.split('#')[1]
        : 'unknown';
    }
  });
  return {packageVersion};
}
export class __AppId {
  private static value: string;

  public static getValue(): string {
    return __AppId.value;
  }

  public static setValue(value: string) {
    this.value = value;
  }
}
export class __TuvaliVersion {
  private static packageDetails = getTuvaliPackageDetails();

  public static getpackageVersion(): string {
    return __TuvaliVersion.packageDetails.packageVersion;
  }

  public static getValue(): string {
    return this.getpackageVersion();
  }
}
export class __InjiVersion {
  private static value = getVersion();

  public static getValue(): string {
    return __InjiVersion.value;
  }
}
export class __SessionId {
  private static value = generateSessionId();

  public static getValue(): string {
    return __SessionId.value;
  }
}

function generateSessionId() {
  const shortUUID = new ShortUniqueId({
    length: APP_ID_LENGTH,
  });
  return shortUUID.randomUUID() + Date.now();
}
