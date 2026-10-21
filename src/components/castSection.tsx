import { Avatar, Box, Grid, Paper, styled, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Image from "next/image";
import Link from "next/link";
import { personLink } from "@/utils";

interface Props {
  cast: CastMember[];
}

const HEADSHOT_WIDTH = 110;
const HEADSHOT_HEIGHT = 165;

const CastItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  width: `${HEADSHOT_WIDTH}px`,
  height: "250px",
  fontSize: "13px",
  boxSizing: "content-box",
  cursor: "pointer",
}));

const clamp = (lines: number) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: lines,
});

const CastSection = ({ cast }: Props) => (
  <>
    <header className="w-full font-bold text-xl my-2">Cast</header>
    <Grid
      container
      spacing={2}
      wrap="nowrap"
      style={{ overflowX: "auto", overflowY: "clip" }}
    >
      {cast.map((member, index) => (
        <Grid
          size={{ xs: "auto" }}
          key={`${member.name}-${index}`}
          sx={{ mb: 1 }}
        >
          <Link
            href={personLink(member.name)}
            style={{ textDecoration: "none" }}
          >
            <CastItem>
              {member.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                  width={HEADSHOT_WIDTH}
                  height={HEADSHOT_HEIGHT}
                  alt={member.name}
                  style={{ objectFit: "cover" }}
                  className="rounded"
                />
              ) : (
                <Avatar
                  variant="rounded"
                  sx={{ width: HEADSHOT_WIDTH, height: HEADSHOT_HEIGHT }}
                >
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
              )}
              <Typography
                variant="body2"
                sx={{ fontWeight: "bolder", mt: 0.5, ...clamp(2) }}
              >
                {member.name}
              </Typography>
              {member.character && (
                <Box
                  component={Typography}
                  variant="body2"
                  sx={{ color: "text.disabled", ...clamp(2) }}
                >
                  {member.character}
                </Box>
              )}
            </CastItem>
          </Link>
        </Grid>
      ))}
    </Grid>
  </>
);

export default CastSection;
