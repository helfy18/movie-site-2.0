import { Box, Tooltip, Typography } from "@mui/material";
import { scoreColor } from "@/styles/gradient";

const buckets = [
  { label: "<20", min: 0, max: 19, mid: 10 },
  { label: "20-40", min: 20, max: 39, mid: 30 },
  { label: "40-60", min: 40, max: 59, mid: 50 },
  { label: "60s", min: 60, max: 69, mid: 65 },
  { label: "70s", min: 70, max: 79, mid: 75 },
  { label: "80s", min: 80, max: 89, mid: 85 },
  { label: "90s", min: 90, max: 100, mid: 95 },
];

const maxBarHeight = 48;

const ScoreBars = ({ scores }: { scores: number[] }) => {
  const counts = buckets.map(
    ({ min, max }) => scores.filter((s) => s >= min && s <= max).length,
  );
  const top = Math.max(...counts);
  if (top === 0) return null;

  return (
    <Box sx={{ mt: 1, width: "fit-content" }}>
      <Typography
        sx={{ color: "secondary.main", textAlign: "center", mb: 0.5 }}
      >
        Scores Given
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          borderBottom: "1px solid",
          borderColor: "text.disabled",
        }}
      >
        {buckets.map(({ label, mid }, i) => (
          <Tooltip
            key={label}
            title={`${label}: ${counts[i]} movie${counts[i] === 1 ? "" : "s"}`}
          >
            <Box sx={{ textAlign: "center", width: 38 }}>
              <Box
                sx={{
                  height: maxBarHeight + 18,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                {counts[i] > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", lineHeight: 1.5 }}
                  >
                    {counts[i]}
                  </Typography>
                )}
                <Box
                  sx={{
                    width: 28,
                    height: counts[i]
                      ? Math.max(3, (counts[i] / top) * maxBarHeight)
                      : 0,
                    borderRadius: "4px 4px 0 0",
                    bgcolor: scoreColor(mid),
                  }}
                />
              </Box>
            </Box>
          </Tooltip>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        {buckets.map(({ label }) => (
          <Typography
            key={label}
            variant="caption"
            sx={{ color: "text.secondary", width: 38, textAlign: "center" }}
          >
            {label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default ScoreBars;
