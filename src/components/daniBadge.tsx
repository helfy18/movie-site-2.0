import { Box, Tooltip } from "@mui/material";
import Image from "next/image";

interface Props {
  size: number;
  right?: number | { xs?: number; md?: number };
  onClick?: () => void;
}

const DaniBadge = ({ size, right = 0, onClick }: Props) => (
  <Box
    sx={{ position: "absolute", top: 0, right, width: size, height: size }}
    onClick={onClick}
  >
    <Tooltip title="Dani Approved" arrow>
      <Image
        src="/dani.png"
        alt="Dani Approved"
        fill
        sizes={`${size}px`}
        style={{ cursor: "pointer", objectFit: "contain" }}
      />
    </Tooltip>
  </Box>
);

export default DaniBadge;
