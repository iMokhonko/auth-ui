import env from '../../env.cligenerated.json';
import setCookies from './setCookies';

export default async (googleCredential) => {
  try {
    const response = await fetch(`https://${env['auth-api']}/sign-in`, {
      method: "POST",
      body: JSON.stringify({
        authType: 'GOOGLE',
        googleCredential
      })
    });

    if(response.status === 200) {
      const result = await response.json();

      const { accessToken, refreshToken } = result;

      setCookies(accessToken, refreshToken);

      return { isSuccess: true }
    } else {
      return {
        isSuccess: false,
        isContinueSignUp: true
      }
    }
  } catch(e) {
     console.log(e);

     return {
      isSuccess: false,
      error: e
     }
  }
};