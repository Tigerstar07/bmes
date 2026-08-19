import {
  ui,
  routes,
  serviceSlugs,
  defaultLang,
  type Lang,
  type RouteKey,
  type ServiceKey,
  type UIKey,
} from './ui';

/**
 * Base path the site is served from.
 *
 * Empty for a real domain (bmes.lv), or "/bmes" when it is sitting on a
 * GitHub Pages project URL. Every link in the site is built through the
 * helpers below, so this is the only place that needs to know.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

const withBase = (path: string): string => `${BASE}${path}`;

/** Strip the base back off a runtime pathname so it can be compared to `routes`. */
const stripBase = (pathname: string): string => {
  if (BASE && pathname.startsWith(BASE)) {
    return pathname.slice(BASE.length) || '/';
  }
  return pathname;
};

/** Read the active language off the URL. Anything not under /en/ is Latvian. */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = stripBase(url.pathname).split('/');
  if (first === 'en') return 'en';
  return defaultLang;
}

/** Translator bound to one language. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key] ?? key;
  };
}

/** Path for a top-level page in a given language. */
export function route(lang: Lang, key: RouteKey): string {
  return withBase(routes[key][lang]);
}

/** Path for one service page in a given language. */
export function servicePath(lang: Lang, key: ServiceKey): string {
  return withBase(`${routes.services[lang]}${serviceSlugs[key][lang]}/`);
}

/** Path for one project page in a given language. */
export function projectPath(lang: Lang, slug: string): string {
  return withBase(`${routes.projects[lang]}${slug}/`);
}

/** Path to a file in /public, base-aware. */
export function asset(path: string): string {
  return withBase(path);
}

export const otherLang = (lang: Lang): Lang => (lang === 'lv' ? 'en' : 'lv');

/**
 * Given the current URL, work out the equivalent URL in the other
 * language. Falls back to that language's home page when there is no
 * direct counterpart, which is better than a 404.
 */
export function alternatePath(
  url: URL,
  lang: Lang,
  opts?: { serviceKey?: ServiceKey; projectSlug?: string },
): string {
  const target = otherLang(lang);

  if (opts?.serviceKey) return servicePath(target, opts.serviceKey);
  if (opts?.projectSlug) return projectPath(target, opts.projectSlug);

  const path = stripBase(url.pathname);
  for (const key of Object.keys(routes) as RouteKey[]) {
    if (path === routes[key][lang]) return route(target, key);
  }
  return route(target, 'home');
}

/** Locale codes for <html lang> and hreflang. */
export const htmlLang: Record<Lang, string> = { lv: 'lv-LV', en: 'en-GB' };
