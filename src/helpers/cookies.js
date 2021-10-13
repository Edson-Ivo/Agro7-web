import cookie from 'js-cookie';

export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
      path: '/',
      secure: true
    });
  }
};

export const removeCookie = key => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1
    });
  }
};

export const getCookieFromBrowser = key => cookie.get(key);

const getCookieFromServer = (key, ctx) => {
  const { req } = ctx;

  if (!req || !req.headers || !req.headers.cookie) return undefined;

  const rawCookie = req.headers.cookie
    .split(';')
    .find(c => c.trim().startsWith(`${key}=`));

  return rawCookie ? rawCookie.split('=')[1] : undefined;
};

export const getCookie = (key, ctx) =>
  ctx && !process.browser
    ? getCookieFromServer(key, ctx)
    : getCookieFromBrowser(key);
