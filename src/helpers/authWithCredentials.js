import env from '../../env.cligenerated.json';
import setCookies from './setCookies';

export default async ({ login, password }) => {
  try {
    const response = await fetch(`https://${env['auth-api']}/sign-in`, {
      method: "POST",
      body: JSON.stringify({
        authType: 'CREDENTIALS',
        login,
        password
      })
    });

    const result = await response.json();

    if(response.status === 200) {
      const { accessToken, refreshToken } = result;

      setCookies(accessToken, refreshToken);

      return { isSuccess: true };
    
    } else {
      return {
        isSuccess: false,
        error: 'We couldn’t find an account matching the login and password you entered'
      };
    }
  } catch(e) {
    console.error(e);

    return {
      isSuccess: false,
      error: e
    };
  }
};