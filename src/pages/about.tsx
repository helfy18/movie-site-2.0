import type { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Layout from "@/components/layout";
import { readCatalogue } from "@/server/catalogue";
import { Box, Typography } from "@mui/material";
import { Item } from "@/components/item";

interface Props {
  movieCount: number;
  runtimeDays: number;
  perfectScores: number;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const catalogue = await readCatalogue();
  const runtimeMinutes = catalogue.reduce(
    (sum, movie) => sum + (movie.runtime || 0),
    0,
  );
  return {
    props: {
      movieCount: catalogue.length,
      runtimeDays: Math.round(runtimeMinutes / 60 / 24),
      perfectScores: catalogue.filter((movie) => movie.jh_score === 100).length,
    },
  };
};

const Heading = ({ children }: { children: React.ReactNode }) => (
  <Typography
    component="h2"
    sx={{
      fontSize: "0.8rem",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "secondary.main",
      fontWeight: 600,
      mt: 3,
      mb: 0.75,
    }}
  >
    {children}
  </Typography>
);

const Para = ({ children }: { children: React.ReactNode }) => (
  <Typography sx={{ color: "text.secondary", maxWidth: "68ch", mb: 1 }}>
    {children}
  </Typography>
);

const AboutPage = ({ movieCount, runtimeDays, perfectScores }: Props) => (
  <Layout pageTitle="About">
    <Head>
      <meta
        name="description"
        content="What JD Movies is, how the scores work, and where the data comes from."
      />
    </Head>
    <Box sx={{ maxWidth: 760 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: 700, color: "text.secondary", mb: 1.5 }}
      >
        About
      </Typography>
      <Para>
        Hello, my name is Johnathan, and I built this website to showcase my
        movie ratings. I will consistently be adding new ratings as I watch
        them.
      </Para>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1.5,
          my: 2.5,
        }}
      >
        {[
          [movieCount.toLocaleString(), "movies rated"],
          [String(runtimeDays), "days watched"],
          [String(perfectScores), "perfect 100s"],
        ].map(([value, label]) => (
          <Item key={label} sx={{ textAlign: "center", py: 1.5 }}>
            <Typography
              sx={{ fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.1 }}
            >
              {value}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              {label}
            </Typography>
          </Item>
        ))}
      </Box>
      <Heading>How the scores work</Heading>
      <Para>
        Every movie gets a number out of 100 after I watch it, and the whole
        list is ranked against everything else I have seen. The scores are mine
        alone.
      </Para>
      <Para>
        <Image
          src="/dani.png"
          alt=""
          width={22}
          height={22}
          style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }}
        />
        The drawing marks movies Dani approved too. Drawing by Phoebe Torres.
      </Para>
      <Heading>Where the data comes from</Heading>
      <Para>
        Posters, cast and where to watch come from{" "}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          TMDB
        </a>{" "}
        and{" "}
        <a
          href="https://www.justwatch.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          JustWatch
        </a>
        . Critic scores come from IMDb, Rotten Tomatoes and Metacritic. This
        product uses the TMDB API but is not endorsed or certified by TMDB.
      </Para>
      <Heading>Add it to your phone</Heading>
      <Para>
        Open this site in Safari, tap Share, then Add to Home Screen. It opens
        full screen like an app, with the same tabs along the bottom.
      </Para>
    </Box>
  </Layout>
);

export default AboutPage;
