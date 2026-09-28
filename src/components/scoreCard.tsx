import { Box } from "@mui/material";
import { ReactNode } from "react";
import { Item } from "./item";
import { scoreColor } from "@/styles/gradient";

interface Props {
  label: string;
  value: ReactNode;
  total: ReactNode;
  score: number;
}

const ScoreCard = ({ label, value, total, score }: Props) => {
  const color = scoreColor(score);
  return (
    <Item
      sx={{
        textAlign: "center",
        color: "secondary.main",
        display: "flex",
        flexDirection: "column",
        fontSize: "1.3em",
        width: "fit-content",
        height: "fit-content",
        fontWeight: "bold",
      }}
    >
      {label}
      <Box style={{ color }}>{value}</Box>
      <Box className="relative">
        <hr className="absolute top-1/2 w-full" style={{ borderColor: color }} />
      </Box>
      <Box style={{ color }}>{total}</Box>
    </Item>
  );
};

export default ScoreCard;
