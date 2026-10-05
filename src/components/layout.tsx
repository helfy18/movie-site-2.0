import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { Grid, Stack } from "@mui/material";
import { useRouter } from "next/router";

interface layoutProps {
  pageTitle: string;
  holiday?: string;
  children: React.ReactNode;
}

const Layout = (props: layoutProps) => {
  const holidays = [useRouter().query.holiday, props.holiday].flat();
  return (
    <div
      className="py-[1%] px-[5%] font-sans"
      style={{
        backgroundImage: holidays.includes("Christmas")
          ? `url('/christmas.png')`
          : undefined,
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
      <Link href="/">
        <header className="text-4xl flex items-center justify-center font-bold font-mono">
          <Image
            src="/popcorn.png"
            height={50}
            width={45}
            alt=""
            className="mx-2.5"
          />
          JD MOVIES
          <Image
            src="/popcorn.png"
            height={50}
            width={45}
            alt=""
            className="mx-2.5"
          />
        </header>
      </Link>
      <Stack direction="row" spacing={4} className="justify-center my-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/movie-grid">Ratings</Link>
        <Link href="/random-movie">Random Movie</Link>
        <Link href="/stats">Stats</Link>
      </Stack>
      <main>{props.children}</main>
      <Grid container spacing={2} sx={{ mt: 4 }}>
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
      </Grid>
    </div>
  );
};

export default Layout;
