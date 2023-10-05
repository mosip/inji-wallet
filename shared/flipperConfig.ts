import mmkvFlipper from 'rn-mmkv-storage-flipper';
import {MMKV} from './storage';
import {inspect} from 'react-native-flipper-xstate';

if (__DEV__) {
  mmkvFlipper(MMKV);
  inspect();
}
