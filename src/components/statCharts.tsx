import { Box, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { scoreColor } from "@/styles/gradient";
import { gridLink } from "@/utils";
import { BUCKET_SIZE, type GroupStat } from "@/stats";

const histogramBarHeight = 130;
const countBarHeight = 96;

export const ScoreHistogram = ({ counts }: { counts: number[] }) => {
  const top = Math.max(...counts, 1);
  return (
    <Box sx={{ overflowX: "auto", maxWidth: "100%", minWidth: 0 }}>
      <Box sx={{ width: "fit-content", mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "flex-end",
            borderBottom: "1px solid",
            borderColor: "text.disabled",
          }}
        >
          {counts.map((count, i) => {
            const min = i * BUCKET_SIZE;
            const max = i === counts.length - 1 ? 100 : min + BUCKET_SIZE - 1;
            return (
              <Tooltip
                key={min}
                title={`${min}-${max}: ${count} movie${count === 1 ? "" : "s"}`}
              >
                <Box
                  component={Link}
                  href={gridLink({ rating: [min, max] })}
                  sx={{
                    width: { xs: 12, md: 20 },
                    display: "block",
                    "&:hover": { opacity: 0.75 },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: count
                        ? Math.max(3, (count / top) * histogramBarHeight)
                        : 0,
                      borderRadius: "4px 4px 0 0",
                      bgcolor: scoreColor(min + 2),
                    }}
                  />
                </Box>
              </Tooltip>
            );
          })}
        </Box>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {counts.map((_, i) => (
            <Typography
              key={i}
              variant="caption"
              sx={{
                width: { xs: 12, md: 20 },
                color: "text.secondary",
                textAlign: "left",
              }}
            >
              {(i * BUCKET_SIZE) % 20 === 0 ? i * BUCKET_SIZE : ""}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

interface CountBarsProps {
  data: GroupStat[];
  columnWidth?: { xs: number; md: number };
}

export const CountBars = ({ data, columnWidth }: CountBarsProps) => {
  const width = columnWidth ?? { xs: 44, md: 52 };
  const top = Math.max(...data.map(({ count }) => count), 1);
  return (
    <Box sx={{ maxWidth: "100%", minWidth: 0 }}>
      <Box sx={{ overflowX: "auto" }}>
        <Box sx={{ width: "fit-content", mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "flex-end",
              borderBottom: "1px solid",
              borderColor: "text.disabled",
            }}
          >
            {data.map(({ label, count, avg, query }) => (
              <Tooltip
                key={label}
                title={`${label}: ${count} movie${count === 1 ? "" : "s"} · avg ${avg.toFixed(2)}`}
              >
                <Box
                  {...(query ? { component: Link, href: gridLink(query) } : {})}
                  sx={{
                    width,
                    textAlign: "center",
                    display: "block",
                    "&:hover": query ? { opacity: 0.75 } : undefined,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", lineHeight: 1.5 }}
                  >
                    {count}
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: Math.max(3, (count / top) * countBarHeight),
                      borderRadius: "4px 4px 0 0",
                      bgcolor: scoreColor(avg),
                    }}
                  />
                </Box>
              </Tooltip>
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {data.map(({ label }) => (
              <Typography
                key={label}
                variant="caption"
                sx={{
                  width,
                  color: "text.secondary",
                  textAlign: "center",
                  lineHeight: 1.2,
                  pt: 0.5,
                }}
              >
                {label}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {data.map(({ label, avg }) => (
              <Typography
                key={label}
                variant="caption"
                sx={{
                  width,
                  color: scoreColor(avg),
                  fontWeight: "bolder",
                  textAlign: "center",
                }}
              >
                {avg.toFixed(2)}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          textAlign: "center",
          color: "text.secondary",
          mt: 0.5,
        }}
      >
        Colored number = average score
      </Typography>
    </Box>
  );
};
