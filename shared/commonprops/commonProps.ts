import { request } from '../request';

export default async function getAllProperties() {
  try {
    const resp = await request('GET', '/allProperties');
    return resp.response;
  } catch (error) {
    console.log(error);
  }
}
