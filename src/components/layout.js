import * as React from "react";
import Image from "next/image";
import Link from "next/link";

const Layout = ({ pageTitle, children }) => {
  return (
    <div className="my-[1%] mx-[5%] font-sans">
      <title>{pageTitle}</title>
      <Link href="/" className="decoration-none">
        <header className="text-5xl text-yellow-500 flex items-center justify-center">
          <Image src="/willie.svg" height={60} width={100} alt="" />
          JD Movies
          <Image src="/nachos.png" height={25} width={40} alt="" />
        </header>
      </Link>
      <nav>
        <ul>
          <li>
            {/* <Link to="/" style={{ textDecoration: "none", color: "#008080" }}> */}
            Home
            {/* </Link> */}
          </li>
          <li>
            {/* <Link
              to="/about"
              style={{ textDecoration: "none", color: "#008080" }}
            > */}
            About
            {/* </Link> */}
          </li>
          <li>
            {/* <Link
              to="/movie-grid"
              style={{ textDecoration: "none", color: "#008080" }}
            > */}
            Movie Ratings
            {/* </Link> */}
          </li>
        </ul>
      </nav>
      <main>{children}</main>
      <Image
        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
        height={50}
        width={50}
        style={{ paddingTop: "1rem" }}
        alt="TMDB API"
      />
    </div>
  );
};

export default Layout;
