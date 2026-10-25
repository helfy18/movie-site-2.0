import Layout from "@/components/layout";
import { jsonLdScript } from "@/utils";
import { Avatar, Box, Button, Collapse, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Item } from "@/components/item";
import Filmography from "@/components/filmography";
import ScoreBars from "@/components/scoreBars";
import { scoreColor } from "@/styles/gradient";

export interface PersonDetailProps {
  name: string;
  person: TMDBPerson | null;
  directed: FilmographyMovie[];
  actedIn: FilmographyMovie[];
}

const BIO_COLLAPSE_CHARS = 300;

const MovieLink = ({ movie }: { movie: PosterMovie }) => (
  <>
    <Link
      href={`/movie/${movie.tmdbid}`}
      prefetch={false}
      className="underline underline-offset-4"
    >
      {movie.movie}
    </Link>{" "}
    <Box
      component="span"
      sx={{ color: scoreColor(movie.jh_score), fontWeight: 800 }}
    >
      {movie.jh_score}
    </Box>
  </>
);

const PersonDetail = ({
  name,
  person,
  directed,
  actedIn,
}: PersonDetailProps) => {
  const [expanded, setExpanded] = useState(false);

  const rated = useMemo(
    () =>
      [
        ...new Map(
          [...directed, ...actedIn].map((movie) => [movie.tmdbid, movie]),
        ).values(),
      ].sort((a, b) => b.jh_score - a.jh_score),
    [directed, actedIn],
  );

  const avg =
    rated.reduce((sum, movie) => sum + movie.jh_score, 0) / (rated.length || 1);
  const best = rated[0];
  const worst = rated[rated.length - 1];
  const daniCount = rated.filter((movie) => movie.dani_approved).length;
  const bio = person?.biography?.trim();
  const longBio = Boolean(bio && bio.length > BIO_COLLAPSE_CHARS);

  const description = `${name} on JD Movies: ${rated.length} movie${
    rated.length === 1 ? "" : "s"
  } rated, average score ${avg.toFixed(2)}.`;
  const photo = person?.profile_path
    ? `https://image.tmdb.org/t/p/w342${person.profile_path}`
    : best?.poster;

  return (
    <Layout pageTitle={name}>
      <Head>
        <meta name="description" content={description} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={name} />
        <meta property="og:description" content={description} />
        {photo && <meta property="og:image" content={photo} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript({
              "@context": "https://schema.org",
              "@type": "Person",
              name,
              ...(photo ? { image: photo } : {}),
            }),
          }}
        />
      </Head>
      <Item
        sx={{
          p: 2,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "auto minmax(0, 1fr)" },
          gap: "12px 24px",
        }}
      >
        <Box sx={{ width: { xs: 110, md: 150 } }}>
          {person?.profile_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
              width={342}
              height={513}
              sizes="150px"
              style={{ width: "100%", height: "auto" }}
              alt={name}
              className="rounded-lg"
            />
          ) : (
            <Avatar
              variant="rounded"
              sx={{ width: "100%", height: { xs: 165, md: 225 } }}
            >
              <PersonIcon sx={{ fontSize: 80 }} />
            </Avatar>
          )}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, color: "text.secondary", lineHeight: 1.1 }}
          >
            {name}
          </Typography>
          {best && (
            <>
              <Typography sx={{ color: "text.disabled", mt: 0.5 }}>
                {rated.length} movie{rated.length === 1 ? "" : "s"} rated
                {" · "}Average{" "}
                <Box
                  component="span"
                  sx={{ color: scoreColor(avg), fontWeight: 800 }}
                >
                  {avg.toFixed(2)}
                </Box>
                {daniCount > 0 && (
                  <>
                    {" · "}
                    <Image
                      src="/dani.png"
                      alt=""
                      width={18}
                      height={18}
                      style={{
                        display: "inline",
                        verticalAlign: "text-bottom",
                        marginRight: 4,
                      }}
                    />
                    {daniCount} Dani approved
                  </>
                )}
              </Typography>
              <Typography sx={{ color: "text.disabled", mt: 0.5 }}>
                Best <MovieLink movie={best} />
                {worst.tmdbid !== best.tmdbid && (
                  <>
                    {" · "}Worst <MovieLink movie={worst} />
                  </>
                )}
              </Typography>
              <ScoreBars scores={rated.map((movie) => movie.jh_score)} />
            </>
          )}
        </Box>
        {bio && (
          <Box
            sx={{
              gridColumn: "1 / -1",
              borderTop: "1px solid",
              borderColor: "#5a544e",
              pt: 1.5,
            }}
          >
            <Collapse in={expanded || !longBio} collapsedSize={66}>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-line",
                  color: "text.secondary",
                  maxWidth: "80ch",
                }}
              >
                {bio}
              </Typography>
            </Collapse>
            {longBio && (
              <Button
                size="small"
                color="secondary"
                onClick={() => setExpanded((previous) => !previous)}
                sx={{ px: 0, mt: 0.5, textTransform: "none", fontWeight: 600 }}
              >
                {expanded ? "Show less" : "Read more"}
              </Button>
            )}
          </Box>
        )}
      </Item>
      <Filmography title="Directed" movies={directed} />
      <Filmography title="Acted in" movies={actedIn} />
    </Layout>
  );
};

export default PersonDetail;
