import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import GridViewIcon from "@mui/icons-material/GridView";
import StyleIcon from "@mui/icons-material/Style";
import BarChartIcon from "@mui/icons-material/BarChart";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface layoutProps {
  pageTitle: string;
  holiday?: string;
  children: React.ReactNode;
}

type Tab = "home" | "ratings" | "random" | "stats" | "search" | "about";

// Holidays with their own edge art. The first match wins when a movie or a
// filtered grid carries more than one.
const holidayBackgrounds: [string, string][] = [
  ["Christmas", "/christmas.png"],
  ["Halloween", "/halloween.png"],
];

const searchHref = { pathname: "/movie-grid", query: { focus: "search" } };

const tabs = [
  { key: "home", href: "/", label: "Home", Icon: HomeIcon },
  { key: "ratings", href: "/movie-grid", label: "Ratings", Icon: GridViewIcon },
  { key: "random", href: "/random-movie", label: "Random", Icon: StyleIcon },
  { key: "stats", href: "/stats", label: "Stats", Icon: BarChartIcon },
] as const;

const activeTab = (pathname: string, focus: unknown): Tab | null => {
  switch (pathname) {
    case "/":
      return "home";
    case "/movie-grid":
      return focus === "search" ? "search" : "ratings";
    case "/random-movie":
      return "random";
    case "/stats":
      return "stats";
    case "/about":
      return "about";
    default:
      return null;
  }
};

const Layout = (props: layoutProps) => {
  const router = useRouter();
  const holidays = [router.query.holiday, props.holiday].flat();
  const background = holidayBackgrounds.find(([holiday]) =>
    holidays.includes(holiday),
  )?.[1];
  const active = activeTab(router.pathname, router.query.focus);
  const navClass = (key: Tab) =>
    `py-1 border-b-2 ${active === key ? "border-secondary" : "border-transparent"}`;
  const tabClass = (key: Tab) =>
    `flex flex-col items-center gap-0.5 text-[10px] ${
      active === key ? "text-secondary" : "text-muted"
    }`;

  return (
    <div
      className="py-[1%] px-[5%] pb-24 md:pb-[1%] font-sans"
      style={{
        backgroundImage: background ? `url('${background}')` : undefined,
        backgroundSize: "100%",
      }}
    >
      <Head>
        <title>{`${props.pageTitle} | JD Movies`}</title>
        <meta
          name="google-site-verification"
          content="WC_EnnFH_-m85mlDsjMdgTJNaP-jeVgCvyv4m--YdkM"
        />
      </Head>
      <header className="relative flex items-center justify-center md:justify-start gap-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="standalone-back absolute left-0 hidden md:hidden items-center gap-1 text-sm font-semibold bg-transparent border-0 p-0 cursor-pointer"
        >
          <ArrowBackIcon fontSize="small" />
          Back
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold font-mono"
        >
          <Image src="/popcorn.png" height={34} width={31} alt="" />
          JD MOVIES
        </Link>
        <nav className="hidden md:flex gap-6 ml-4">
          {tabs.map(({ key, href, label }) => (
            <Link key={key} href={href} className={navClass(key)}>
              {label}
            </Link>
          ))}
          <Link href="/about" className={navClass("about")}>
            About
          </Link>
        </nav>
        <Link
          href={searchHref}
          aria-label="Search"
          className="hidden md:flex ml-auto w-9 h-9 rounded-lg bg-card items-center justify-center"
        >
          <SearchIcon fontSize="small" />
        </Link>
      </header>
      <main>{props.children}</main>
      <footer className="flex items-center gap-4 mt-8">
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/tmdb.svg"
            height={36}
            width={50}
            alt="TMDB"
            className="rounded"
          />
        </a>
        <a
          href="https://letterboxd.com/helfy18/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/letterboxd.png"
            height={36}
            width={163}
            alt="Letterboxd"
            className="rounded"
          />
        </a>
        <Link href="/about" className="md:hidden ml-auto text-sm">
          About
        </Link>
      </footer>
      <nav
        className="md:hidden fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-card bg-[#1f1b19] pt-2"
        style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
      >
        {tabs.map(({ key, href, label, Icon }) => (
          <Link key={key} href={href} className={tabClass(key)}>
            <Icon fontSize="small" />
            {label}
          </Link>
        ))}
        <Link href={searchHref} className={tabClass("search")}>
          <SearchIcon fontSize="small" />
          Search
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
