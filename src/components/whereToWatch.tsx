import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { providerSearchUrl } from "@/providerSearch";

interface Props {
  movie: Movie;
}

const CAP = 8;

const dedupe = (lists: (ProviderInfo[] | null | undefined)[]) => {
  const seen = new Set<number>();
  return lists
    .flatMap((list) => list ?? [])
    .filter((provider) =>
      seen.has(provider.provider_id)
        ? false
        : (seen.add(provider.provider_id), true),
    );
};

const Group = ({
  label,
  providers,
  title,
  fallback,
}: {
  label: string;
  providers: ProviderInfo[];
  title: string;
  fallback: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? providers : providers.slice(0, CAP);
  const hidden = providers.length - shown.length;
  return (
    <Box>
      <Typography
        component="h3"
        sx={{
          fontSize: "0.7rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "text.disabled",
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.75 }}>
        {shown.map((provider) => (
          <a
            key={provider.provider_id}
            href={providerSearchUrl(provider.provider_id, title, fallback)}
            target="_blank"
            rel="noopener noreferrer"
            title={provider.provider_name}
          >
            <Image
              src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
              alt={provider.provider_name}
              width={34}
              height={34}
              className="rounded-lg"
            />
          </a>
        ))}
        {hidden > 0 && (
          <Box
            component="button"
            onClick={() => setExpanded(true)}
            aria-label={`Show ${hidden} more`}
            sx={{
              width: 34,
              height: 34,
              borderRadius: "8px",
              border: 0,
              bgcolor: "background.paper",
              color: "secondary.main",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            +{hidden}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const WhereToWatch = ({ movie }: Props) => {
  const { link, flatrate, rent, buy, ads, free } = movie.provider;
  const stream = dedupe([flatrate, free, ads]);
  const rentOrBuy = dedupe([rent, buy]);
  if (stream.length === 0 && rentOrBuy.length === 0) return null;

  return (
    <Box>
      <Typography
        component="h2"
        sx={{
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "text.disabled",
          fontWeight: 600,
          mb: 1,
        }}
      >
        Where to watch · Canada
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2.25,
          "& > div + div": {
            borderLeft: "1px solid",
            borderColor: "background.paper",
            pl: 2.25,
          },
        }}
      >
        {stream.length > 0 && (
          <Group
            label="Stream"
            providers={stream}
            title={movie.movie}
            fallback={link}
          />
        )}
        {rentOrBuy.length > 0 && (
          <Group
            label="Rent or buy"
            providers={rentOrBuy}
            title={movie.movie}
            fallback={link}
          />
        )}
      </Box>
      <Typography variant="caption" sx={{ color: "text.disabled", mt: 1 }}>
        Availability by{" "}
        <a
          href={link || "https://www.justwatch.com/"}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          JustWatch
        </a>
      </Typography>
    </Box>
  );
};

export default WhereToWatch;
