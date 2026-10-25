import { Box } from "@mui/material";
import { criticSites } from "@/stats";
import { scoreColor } from "@/styles/gradient";

interface Props {
  movie: Movie;
}

const Row = ({
  label,
  value,
  display,
  color,
  highlight = false,
}: {
  label: string;
  value: number;
  display: React.ReactNode;
  color: string;
  highlight?: boolean;
}) => (
  <>
    <Box
      component="span"
      sx={{
        color: highlight ? "secondary.main" : "text.disabled",
        fontWeight: highlight ? 700 : 400,
      }}
    >
      {label}
    </Box>
    <Box
      sx={{
        height: 8,
        borderRadius: 4,
        bgcolor: "#2f2a27",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: `${value}%`,
          borderRadius: 4,
          bgcolor: color,
        }}
      />
    </Box>
    <Box
      component="span"
      sx={{
        textAlign: "right",
        color: "text.secondary",
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      {display}
    </Box>
  </>
);

const Unit = ({ children }: { children: React.ReactNode }) => (
  <Box
    component="small"
    sx={{ color: "text.disabled", fontSize: "0.7rem", ml: "1px" }}
  >
    {children}
  </Box>
);

const CriticBars = ({ movie }: Props) => {
  // Every site gets a row; a missing score shows as N/A on an empty track so
  // the three always line up under the site's own bar.
  const critics = criticSites.map((site) => ({
    label: site.site,
    value: site.score(movie),
    raw: site.raw(movie),
  }));
  const reviewed = movie.jh_score !== -1;
  if (!reviewed && critics.every((site) => site.value === null)) return null;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "110px 1fr 64px",
        gap: "8px 10px",
        alignItems: "center",
        fontSize: "0.85rem",
      }}
    >
      {reviewed && (
        <Row
          label="Johnathan"
          value={movie.jh_score}
          display={
            <>
              {movie.jh_score}
              <Unit>/100</Unit>
            </>
          }
          color={scoreColor(movie.jh_score) ?? "#8a8580"}
          highlight
        />
      )}
      {critics.map((site) => (
        <Row
          key={site.label}
          label={site.label}
          value={site.value ?? 0}
          display={
            site.value === null ? (
              <Box component="span" sx={{ color: "text.disabled" }}>
                N/A
              </Box>
            ) : (
              site.raw
            )
          }
          color="#8a8580"
        />
      ))}
    </Box>
  );
};

export default CriticBars;
