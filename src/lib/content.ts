import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify, countryName, type Lang } from '../i18n/ui';

export type Story = CollectionEntry<'stories'>;

/** "en/salvador-part-1" → "salvador-part-1" */
export const slugOf = (s: Story) => s.id.split('/').slice(1).join('/');
export const langOf = (s: Story) => s.id.split('/')[0] as Lang;
/** "Maria's tips" pages live under /tips/, everything else under /journal/. */
export const isTip = (s: Story) => s.data.category === 'tips';
export const sectionOf = (s: Story) => (isTip(s) ? 'tips' : 'journal');
export const storyUrl = (s: Story) => `/${langOf(s)}/${sectionOf(s)}/${slugOf(s)}/`;

/** getStaticPaths for one section's article pages (journal or tips). */
export async function storyPaths(section: 'journal' | 'tips') {
  const all = await getCollection('stories', (s) => import.meta.env.DEV || !s.data.draft);
  return all
    .filter((story) => sectionOf(story) === section)
    .map((story) => ({
      params: { lang: langOf(story), slug: slugOf(story) },
      props: { story, hasTranslation: all.some((o) => o.id !== story.id && slugOf(o) === slugOf(story)) },
    }));
}
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
  return all.sort((a, b) => -byTime(a, b));
}

/** Oldest first; stories on the same date are ordered by part number (Part 1 before Part 2). */
const byTime = (a: Story, b: Story) =>
  a.data.date.valueOf() - b.data.date.valueOf() || (a.data.part ?? 0) - (b.data.part ?? 0);

/** Copy of `stories` in chronological order (oldest first). */
export const chronological = (stories: Story[]) => [...stories].sort(byTime);

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

/** Map pins for every story that has coordinates. */
export function mapPoints(stories: Story[], countryName: (c: string) => string) {
  return stories
    .filter((x) => typeof x.data.lat === 'number' && typeof x.data.lng === 'number')
    .map((x) => ({
      lat: x.data.lat!, lng: x.data.lng!, title: x.data.title, href: storyUrl(x),
      place: [x.data.city, countryName(x.data.country)].filter(Boolean).join(', '),
    }));
}

const sameCountry = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Country entry written in the CMS (name + intro text). Matched on the English country name. */
export async function getDestination(lang: Lang, country: string) {
  const all = await getCollection('destinations', (d) => d.id.startsWith(`destinations/${lang}/`));
  return all.find((d) => sameCountry(d.data.country, country));
}

/**
 * Returns a function that turns the English country key into the name to show.
 * Order: name set in the CMS for this language → built-in Greek list → the English key.
 */
export async function countryNamer(lang: Lang) {
  const all = await getCollection('destinations', (d) => d.id.startsWith(`destinations/${lang}/`));
  return (country: string) =>
    all.find((d) => sameCountry(d.data.country, country))?.data.name?.trim() || countryName(country, lang);
}

/**
 * Every country for a language: those with stories, plus countries added in the CMS
 * that have no stories yet (so their page exists and can be linked).
 */
export async function getCountries(lang: Lang) {
  // Tips pages are not travel stories: keep them out of country pages and story counts
  const groups = groupByCountry((await getStories(lang)).filter((s) => !isTip(s)));
  const extra = await getCollection('destinations');
  for (const d of extra) {
    if (!groups.some((g) => sameCountry(g.country, d.data.country))) {
      groups.push({ country: d.data.country.trim(), stories: [] });
    }
  }
  return groups;
}

export async function getPage(lang: Lang, name: string) {
  const pages = await getCollection('pages');
  return pages.find((p) => p.id === `pages/${lang}/${name}`);
}
