import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify, type Lang } from '../i18n/ui';

export type Story = CollectionEntry<'stories'>;

/** "en/salvador-part-1" → "salvador-part-1" */
export const slugOf = (s: Story) => s.id.split('/').slice(1).join('/');
export const langOf = (s: Story) => s.id.split('/')[0] as Lang;
export const storyUrl = (s: Story) => `/${langOf(s)}/journal/${slugOf(s)}/`;
export const countryUrl = (lang: Lang, country: string) =>
  `/${lang}/destinations/${slugify(country)}/`;

/** Published stories for one language, newest first (drafts show only in `npm run dev`). */
export async function getStories(lang: Lang) {
  const all = await getCollection(
    'stories',
    (s) => s.id.startsWith(`${lang}/`) && (import.meta.env.DEV || !s.data.draft),
  );
  // Tags are entered once, on the English version (CMS `i18n: false`); translations inherit them.
  if (lang !== 'en') {
    const en = await getCollection('stories', (s) => s.id.startsWith('en/'));
    for (const s of all) {
      if (s.data.tags.length) continue;
      const twin = en.find((e) => slugOf(e) === slugOf(s));
      if (twin) s.data.tags = twin.data.tags;
    }
  }
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function groupByCountry(stories: Story[]) {
  const map = new Map<string, Story[]>();
  for (const s of stories) {
    const list = map.get(s.data.country) ?? [];
    list.push(s);
    map.set(s.data.country, list);
  }
  // countries with the most recent story first
  return [...map.entries()].map(([country, list]) => ({ country, stories: list }));
}

export async function getPage(lang: Lang, name: string) {
  const pages = await getCollection('pages');
  return pages.find((p) => p.id === `pages/${lang}/${name}`);
}
