export const langs = ['en', 'gr'] as const;
export type Lang = (typeof langs)[number];

export const langLabel: Record<Lang, string> = { en: 'EN', gr: 'ΕΛ' };
export const htmlLang: Record<Lang, string> = { en: 'en', gr: 'el' };

const en = {
  tagline: 'Stories, food & places, slowly.',
  heroKicker: 'Travel journal',
  seeMore: 'See more',
  readMore: 'Read more',
  discover: 'Discover',
  journal: 'Journal',
  destinations: 'Destinations',
  about: 'About',
  aboutMe: 'About me',
  aboutNav: 'About me',
  tips: "Maria's tips",
  tipsTitle: "Maria's tips",
  tipsEmpty: 'Tips coming soon.',
  travelTo: 'Travel to',
  latest: 'Latest stories',
  viewAll: 'View all',
  hi: "Hi, I'm Maria!",
  explore: 'Explore',
  quoteA: 'Collect',
  quoteB: 'moments, not things.',
  guidesTitle: 'Destinations',
  stories: (n: number) => (n === 1 ? '1 story' : `${n} stories`),
  part: 'Part',
  inThisSeries: 'In this series',
  gallery: 'Gallery',
  map: 'Map of my travels',
  nothingYet: 'New stories coming soon.',
  comingSoon: 'Stories coming soon',
  allDestinations: 'All destinations',
  close: 'Close',
  otherLang: 'Διαβάστε στα ελληνικά',
  backToJournal: 'Back to the journal',
  footerNote: 'A travel journal by Maria.',
  menu: 'Menu',
};

const gr: typeof en = {
  tagline: 'Ιστορίες, φαγητό & μέρη, με την ησυχία μας.',
  heroKicker: 'Ταξιδιωτικό ημερολόγιο',
  seeMore: 'Δείτε περισσότερα',
  readMore: 'Διαβάστε',
  discover: 'Ανακαλύψτε',
  journal: 'Ημερολόγιο',
  destinations: 'Προορισμοί',
  about: 'Σχετικά',
  aboutMe: 'Λίγα λόγια',
  aboutNav: 'Σχετικά',
  tips: 'Συμβουλές',
  tipsTitle: 'Οι συμβουλές της Μαρίας',
  tipsEmpty: 'Οι συμβουλές έρχονται σύντομα.',
  travelTo: 'Ταξίδι στη',
  latest: 'Πρόσφατες ιστορίες',
  viewAll: 'Περισσότερα',
  hi: 'Γεια, είμαι η Μαρία!',
  explore: 'Εξερευνήστε',
  quoteA: 'Συλλέξτε',
  quoteB: 'στιγμές, όχι πράγματα.',
  guidesTitle: 'Προορισμοί',
  stories: (n: number) => (n === 1 ? '1 ιστορία' : `${n} ιστορίες`),
  part: 'Μέρος',
  inThisSeries: 'Σε αυτή τη σειρά',
  gallery: 'Φωτογραφίες',
  map: 'Ο χάρτης των ταξιδιών μου',
  nothingYet: 'Νέες ιστορίες έρχονται σύντομα.',
  comingSoon: 'Ιστορίες σύντομα',
  allDestinations: 'Όλοι οι προορισμοί',
  close: 'Κλείσιμο',
  otherLang: 'Read in English',
  backToJournal: 'Πίσω στο ημερολόγιο',
  footerNote: 'Ένα ταξιδιωτικό ημερολόγιο της Μαρίας.',
  menu: 'Μενού',
};

export const ui: Record<Lang, typeof en> = { en, gr };
export const t = (lang: Lang) => ui[lang];

/** Country names are stored in English in the CMS; this translates them for display. */
const countryGr: Record<string, string> = {
  Brazil: 'Βραζιλία',
  Jordan: 'Ιορδανία',
  Cuba: 'Κούβα',
  Portugal: 'Πορτογαλία',
  France: 'Γαλλία',
  Greece: 'Ελλάδα',
  Italy: 'Ιταλία',
  Spain: 'Ισπανία',
  Mexico: 'Μεξικό',
  Argentina: 'Αργεντινή',
  Morocco: 'Μαρόκο',
  Egypt: 'Αίγυπτος',
  Turkey: 'Τουρκία',
  Netherlands: 'Ολλανδία',
};
export const countryName = (country: string, lang: Lang) =>
  lang === 'gr' ? countryGr[country] ?? country : country;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const formatDate = (d: Date, lang: Lang) =>
  d.toLocaleDateString(lang === 'gr' ? 'el-GR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export const langPaths = () => langs.map((lang) => ({ params: { lang } }));
