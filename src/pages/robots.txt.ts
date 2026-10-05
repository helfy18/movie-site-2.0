import type { GetServerSideProps } from "next";

const SITEURL = process.env.NEXT_PUBLIC_SITEURL ?? "http://localhost:3000";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=86400",
  );
  res.write(`User-agent: *
Allow: /

Sitemap: ${SITEURL}/sitemap.xml
`);
  res.end();
  return { props: {} };
};

const Robots = () => null;

export default Robots;
