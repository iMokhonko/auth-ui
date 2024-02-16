import { env } from '../../env.cligenerated.json';

export default (accessToken, refreshToken) => {
  const isDev = process.env.NODE_ENV === 'development';

  // prod env does not have prefix
  const cookiePrefix = env !== 'prod' ? `${env}-` : '';

  document.cookie = `${cookiePrefix}access-token=${accessToken.value};max-age=${accessToken.maxAge};path=${accessToken.path ?? ''};sameSite=${accessToken.sameSite ?? 'none'};secure=${accessToken.secure ?? false};domain=${isDev ? 'localhost' : accessToken.domain}`;
  document.cookie = `${cookiePrefix}refresh-token=${refreshToken.value};max-age=${refreshToken.maxAge};path=${refreshToken.path ?? ''};sameSite=${refreshToken.sameSite ?? 'none'};secure=${refreshToken.secure ?? false};domain=${isDev ? 'localhost' : refreshToken.domain}`;
};