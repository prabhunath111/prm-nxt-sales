import { jwtDecode } from 'jwt-decode';
import { authorize } from 'react-native-app-auth';
import { mobileAuthConfig } from './AuthConfig';

export const login = async () => {
  try {
    console.warn('AAD: Config being used:', JSON.stringify(mobileAuthConfig, null, 2));
    console.warn('AAD: Triggering authorize call...');
    const result = await authorize(mobileAuthConfig);
    console.warn('AAD: authorize call successful');
    const decodedUser = jwtDecode(result.idToken);
    return {
      accessToken: result.accessToken,
      idToken: result.idToken,
      user: decodedUser,
      originalResult: result,
    };
  } catch (error) {
    console.warn('AAD authorize Error:', error?.message || error);
    throw error;
  }
};


export const logout = async () => {
  return Promise.resolve();
};
