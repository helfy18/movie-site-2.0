type SearchUrl = (title: string) => string;

const appleTv: SearchUrl = (t) =>
  `https://tv.apple.com/ca/search?term=${encodeURIComponent(t)}`;
const amazon: SearchUrl = (t) =>
  `https://www.primevideo.com/region/na/search?phrase=${encodeURIComponent(t)}`;
const youtube: SearchUrl = (t) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(t)}`;
const googlePlay: SearchUrl = (t) =>
  `https://play.google.com/store/search?q=${encodeURIComponent(t)}&c=movies`;
const cosmogo: SearchUrl = (t) =>
  `https://www.cosmogo.com/#!/search/${encodeURIComponent(t)}`;
const crave: SearchUrl = (t) =>
  `https://www.crave.ca/en/search/${encodeURIComponent(t)}`;
const netflix: SearchUrl = (t) =>
  `https://www.netflix.com/search?q=${encodeURIComponent(t)}`;
const paramount: SearchUrl = () => "https://www.paramountplus.com/search/";
const plex: SearchUrl = () => "https://watch.plex.tv/search";
const disney: SearchUrl = () => "https://www.disneyplus.com/browse/search";

const byProvider: Record<number, SearchUrl> = {
  2: appleTv,
  350: appleTv,
  1852: appleTv,
  1854: appleTv,
  2048: appleTv,
  2049: appleTv,
  10: amazon,
  119: amazon,
  2100: amazon,
  201: amazon,
  204: amazon,
  205: amazon,
  528: amazon,
  582: amazon,
  588: amazon,
  605: amazon,
  606: amazon,
  705: amazon,
  1794: amazon,
  1968: amazon,
  2243: amazon,
  2358: amazon,
  2604: amazon,
  2745: amazon,
  192: youtube,
  3: googlePlay,
  140: cosmogo,
  230: crave,
  8: netflix,
  1796: netflix,
  531: paramount,
  2303: paramount,
  2304: paramount,
  538: plex,
  337: disney,
};

export const providerSearchUrl = (
  providerId: number,
  title: string,
  fallback: string,
): string => byProvider[providerId]?.(title) ?? fallback;
