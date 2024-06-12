import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Stack } from "@mui/material";

interface layoutProps {
  pageTitle: string;
  children: React.ReactNode;
}

const Layout = (props: layoutProps) => {
  return (
    <div className="my-[1%] mx-[5%] font-sans">
      <title>{props.pageTitle}</title>
      <Link href="/">
        <header className="text-4xl text-yellow-500 flex items-center justify-center">
          <Image
            src="/popcorn.png"
            height={50}
            width={45}
            alt=""
            className="mx-2.5"
          />
          JD Movies
          <Image
            src="/popcorn.png"
            height={50}
            width={45}
            alt=""
            className="mx-2.5"
          />
        </header>
      </Link>
      <Stack direction="row" spacing={4} className="justify-center">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/movie-grid">Ratings</Link>
      </Stack>
      <main>{props.children}</main>
      <Image
        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
        height={50}
        width={50}
        className="mt-4"
        alt="TMDB API"
      />
    </div>
  );
};

export default Layout;
