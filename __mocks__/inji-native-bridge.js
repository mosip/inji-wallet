import {NativeModules} from 'react-native';

NativeModules.VersionModule = {
    getVersion: jest.fn()
};
// NativeModules.VersionModule.getVersion