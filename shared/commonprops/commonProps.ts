import { request } from '../request';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COMMON_PROPS_KEY: string =
  'CommonPropsKey-' + '6964d04a-9268-11ed-a1eb-0242ac120002';

export default async function getAllConfigurations() {
  try {
    var response = await AsyncStorage.getItem(COMMON_PROPS_KEY);
    if (response) {
      return JSON.parse(response);
    } else {
      const resp = await request('GET', '/allProperties');
      const injiProps = resp.response;
      const injiPropsString = JSON.stringify(injiProps);
      await AsyncStorage.setItem(COMMON_PROPS_KEY, injiPropsString);
      return injiProps;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
