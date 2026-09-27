import type { APIRoute } from 'astro';
import { langPaths, countryName, type Lang } from '../../i18n/ui';
import { getStories, storyUrl } from '../../lib/content';

export const getStaticPaths = langPaths;

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const stories = await getStories(lang);
  const index = stories.map((s) => ({
    title: s.data.title,
    description: s.data.description ?? '',
    place: [s.data.city, countryName(s.data.country, lang)].filter(Boolean).join(', '),
    cover: s.data.cover,
    href: storyUrl(s),
    text: [s.data.country, s.data.tags.join(' '), s.data.highlights.map((h) => h.title).join(' '), s.body ?? ''].join(' '),
  }));
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json' } });
};
