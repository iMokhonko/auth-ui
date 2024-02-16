import { env } from '../../env.cligenerated.json';

export default (accessToken, refreshToken, { isRememberMe = true } = {}) => {
  const isDev = process.env.NODE_ENV === 'development';

  // prod env does not have prefix
  const cookiePrefix = env !== 'prod' ? `${env}-` : '';

  const accessTokenMaxAgeValue = isRememberMe ? `max-age=${accessToken.maxAge};` : '';
  const refreshTokenMaxAgeValue = isRememberMe ? `max-age=${refreshToken.maxAge};` : '';

  console.log("isRememberMe", isRememberMe)

  document.cookie = `${cookiePrefix}access-token=${accessToken.value};${accessTokenMaxAgeValue}path=${accessToken.path ?? ''};sameSite=${accessToken.sameSite ?? 'none'};secure=${accessToken.secure ?? false};domain=${isDev ? 'localhost' : accessToken.domain}`;
  document.cookie = `${cookiePrefix}refresh-token=${refreshToken.value};${refreshTokenMaxAgeValue}path=${refreshToken.path ?? ''};sameSite=${refreshToken.sameSite ?? 'none'};secure=${refreshToken.secure ?? false};domain=${isDev ? 'localhost' : refreshToken.domain}`;
};