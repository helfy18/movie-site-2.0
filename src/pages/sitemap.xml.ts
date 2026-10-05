import type { GetServerSideProps } from "next";
import { fetchMoviesListCompact } from "@/api/client";
import { sitemapPaths } from "@/utils";

const SITEURL = process.env.NEXT_PUBLIC_SITEURL ?? "http://localhost:3000";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const movies = await fetchMoviesListCompact({});
  const urls = sitemapPaths(movies)
    .map((path) => `  <url><loc>${SITEURL}${path}</loc></url>`)
    .join("\n");

  res.setHeader("Content-Type", "application/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=86400",
  );
  res.write(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);
  res.end();
  return { props: {} };
};

const Sitemap = () => null;

export default Sitemap;
