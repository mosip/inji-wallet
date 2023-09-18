import { getVersion } from 'react-native-device-info';
import ShortUniqueId from 'short-unique-id';
import { APP_ID_LENGTH } from './constants';
/* eslint-disable @typescript-eslint/no-var-requires */
const dependencies = require('../package-lock.json').dependencies;

function getTuvaliPackageDetails() {
  let packageVersion, packageCommitId;

  Object.keys(dependencies).forEach((dependencyName) => {
    const dependencyData = dependencies[dependencyName];

    if (dependencyName == 'react-native-tuvali') {
      packageVersion = dependencyData.from
        ? dependencyData.from.split('#')[1]
        : 'unknown';

      if (packageVersion != 'unknown') {
        packageCommitId = dependencyData.version.split('#')[1].substring(0, 7);
      }
    }
  });
  return { packageVersion, packageCommitId };
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

  public static getPackageCommitId(): string {
    return __TuvaliVersion.packageDetails.packageCommitId;
  }

  public static getpackageVersion(): string {
    return __TuvaliVersion.packageDetails.packageVersion;
  }

  public static getValue(): string {
    return this.getpackageVersion() + '-' + this.getPackageCommitId();
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

export class __SelectedLanguage {
  private static language = '';

  public static getValue(): string {
    return __SelectedLanguage.language;
  }

  public static setValue(currentLangauge: string) {
    this.language = currentLangauge;
  }
}

function generateSessionId() {
  const shortUUID = new ShortUniqueId({
    length: APP_ID_LENGTH,
  });
  return shortUUID.randomUUID() + Date.now();
}
