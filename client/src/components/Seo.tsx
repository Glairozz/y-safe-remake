import { useEffect } from 'react';

const SITE_URL = 'https://y-safe-remake.vercel.app';

interface SeoProps {
  /** Page title shown in the browser tab and search results. */
  title: string;
  /** Meta description for this page. */
  description?: string;
  /** Path relative to the site root, e.g. "/" or "/login". */
  path?: string;
  /** Set to true for pages that must never appear in search results. */
  noindex?: boolean;
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Keeps document metadata in sync with the current route.
 *
 * Y-Safe is a client-side SPA, so the default metadata lives in
 * `client/index.html`. This component gives each route a unique title and
 * description, and marks non-public routes as `noindex` so only the public
 * homepage is offered for indexing.
 */
export default function Seo({ title, description, path, noindex = false }: SeoProps) {
  useEffect(() => {
    document.title = title;
    setMeta('property', 'og:title', title);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    if (path !== undefined) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', `${SITE_URL}${path}`);
    }
  }, [title, description, path, noindex]);

  return null;
}
