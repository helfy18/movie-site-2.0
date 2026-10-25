import { Box } from "@mui/material";
import { scoreColor } from "@/styles/gradient";

interface Props {
  score: number;
  size?: number;
}

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ScoreRing = ({ score, size = 84 }: Props) => (
  <Box
    role="img"
    aria-label={`${score} out of 100`}
    sx={{
      position: "relative",
      width: size,
      height: size,
      display: "grid",
      placeItems: "center",
      flex: "none",
    }}
  >
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      style={{ position: "absolute", inset: 0 }}
    >
      <circle
        cx="32"
        cy="32"
        r={RADIUS}
        fill="#44403c"
        stroke="#3b3632"
        strokeWidth="6"
      />
      <circle
        cx="32"
        cy="32"
        r={RADIUS}
        fill="none"
        stroke={scoreColor(score)}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * (1 - score / 100)}
        transform="rotate(-90 32 32)"
      />
    </svg>
    <Box
      component="span"
      sx={{
        position: "relative",
        fontSize: size / 3,
        fontWeight: 800,
        color: "text.secondary",
        letterSpacing: "-0.02em",
      }}
    >
      {score}
    </Box>
  </Box>
);

export default ScoreRing;
