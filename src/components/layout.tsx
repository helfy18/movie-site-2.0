import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Grid2, Stack } from "@mui/material";
import { activeFilter } from "@/contexts/apiContext";

interface layoutProps {
  pageTitle: string;
  children: React.ReactNode;
}

const Layout = (props: layoutProps) => {
  return (
    <div
      className="py-[1%] px-[5%] font-sans"
      style={{
        backgroundImage: activeFilter.holiday?.includes("Christmas")
          ? `url('/christmas.png')`
          : undefined,
        backgroundSize: "100%",
      }}
    >
      <title>{props.pageTitle}</title>
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
      </Stack>
      <main>{props.children}</main>
      <Grid2 container spacing={2} sx={{ mt: 4 }}>
        <Image
          src="/tmdb.svg"
          height={50}
          width={50}
          alt="TMDB API"
          onClick={() => window.open("https://www.themoviedb.org/", "_blank")}
          style={{ cursor: "pointer" }}
          className="rounded"
        />
        <Image
          src="/letterboxd.png"
          height={50}
          width={163}
          alt="Letterboxd"
          onClick={() =>
            window.open("https://letterboxd.com/helfy18/", "_blank")
          }
          style={{ cursor: "pointer" }}
          className="rounded"
        />
      </Grid2>
    </div>
  );
};

export default Layout;
