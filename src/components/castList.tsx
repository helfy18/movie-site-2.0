import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { personLink } from "@/utils";

interface Props {
  cast: CastMember[];
  // How many to show before the "all cast" link; the page sets this from
  // how long the plot is so the column stays level with the poster.
  shown?: number;
}

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("");

const Member = ({ member }: { member: CastMember }) => (
  <Link
    href={personLink(member.name)}
    prefetch={false}
    className="flex items-center gap-2.5 py-1 min-w-0"
  >
    {member.profile_path ? (
      <Image
        src={`https://image.tmdb.org/t/p/w92${member.profile_path}`}
        alt=""
        width={40}
        height={40}
        className="rounded-full object-cover flex-none"
        style={{ width: 40, height: 40 }}
      />
    ) : (
      <Avatar
        sx={{
          width: 40,
          height: 40,
          fontSize: "0.8rem",
          fontWeight: 700,
          bgcolor: "background.paper",
          color: "text.secondary",
        }}
      >
        {initials(member.name)}
      </Avatar>
    )}
    <Box component="span" sx={{ minWidth: 0 }}>
      <Box
        component="span"
        sx={{
          display: "block",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "text.secondary",
          lineHeight: 1.25,
        }}
      >
        {member.name}
      </Box>
      {member.character && (
        <Box
          component="span"
          sx={{
            display: "block",
            fontSize: "0.78rem",
            color: "text.disabled",
            lineHeight: 1.3,
          }}
        >
          {member.character}
        </Box>
      )}
    </Box>
  </Link>
);

const columns = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "4px 16px",
};

const CastList = ({ cast, shown = 10 }: Props) => {
  const [open, setOpen] = useState(false);
  if (cast.length === 0) return null;

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
        Cast
      </Typography>
      <Box sx={columns}>
        {cast.slice(0, shown).map((member) => (
          <Member key={`${member.tmdbid}-${member.name}`} member={member} />
        ))}
      </Box>
      {cast.length > shown && (
        <Button
          color="secondary"
          onClick={() => setOpen(true)}
          sx={{ mt: 1, px: 0, textTransform: "none", fontWeight: 600 }}
        >
          All {cast.length} cast members →
        </Button>
      )}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { sx: { bgcolor: "background.default" } } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "text.secondary",
          }}
        >
          Cast · {cast.length}
          <IconButton
            aria-label="Close"
            color="secondary"
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={columns}>
          {cast.map((member) => (
            <Member key={`${member.tmdbid}-${member.name}`} member={member} />
          ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CastList;
