import CookieManager from '@react-native-cookies/cookies';

export const getSessionCookieHeader = async () => {
  const cookies = await CookieManager.get('http://10.0.2.2:8080/');
  const jsessionid = cookies?.JSESSIONID?.value;
  return jsessionid ? { Cookie: `JSESSIONID=${jsessionid}` } : {};
};
