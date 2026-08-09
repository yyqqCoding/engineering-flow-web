export const locales = ['en', 'zh-CN'];
export const defaultLocale = 'en';

/** @param {unknown} value */
export function isLocale(value) {
  return typeof value === 'string' && locales.includes(value);
}

/** @param {string} locale @param {string} path */
export function localizePath(locale, path = '/') {
  if (!isLocale(locale)) {
    throw new TypeError(`Unsupported locale: ${locale}`);
  }

  const normalizedPath = path === '/' ? '' : `/${path.replace(/^\/+|\/+$/g, '')}`;
  return `/${locale}${normalizedPath}`;
}

/** @param {string} pathname @param {string} nextLocale */
export function switchLocale(pathname, nextLocale) {
  if (!isLocale(nextLocale)) {
    throw new TypeError(`Unsupported locale: ${nextLocale}`);
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = nextLocale;
  } else {
    segments.unshift(nextLocale);
  }

  return `/${segments.join('/')}`;
}
