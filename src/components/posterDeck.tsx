import { Box } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import DaniBadge from "./daniBadge";

interface Props {
  // Front card first. Undefined entries are still loading and render blank.
  movies: (PosterMovie | undefined)[];
  onDeal: () => void;
}

const LEAVE_MS = 280;
const SWIPE_PX = 40;

const offsets = [
  "none",
  "translate(10px, -8px) rotate(3deg)",
  "translate(20px, -16px) rotate(6deg)",
];

const PosterDeck = ({ movies, onDeal }: Props) => {
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const dragStart = useRef<number | null>(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const deal = () => {
    if (leaving || !movies[0]) return;
    setLeaving(true);
    timer.current = setTimeout(() => {
      setLeaving(false);
      onDeal();
    }, LEAVE_MS);
  };

  return (
    <Box
      onPointerDown={(event) => {
        dragStart.current = event.clientX;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Capture is a nicety; dragging still works without it.
        }
      }}
      onPointerMove={(event) => {
        if (
          dragStart.current !== null &&
          Math.abs(event.clientX - dragStart.current) > SWIPE_PX
        ) {
          dragStart.current = null;
          deal();
        }
      }}
      onPointerUp={() => {
        dragStart.current = null;
      }}
      onPointerCancel={() => {
        dragStart.current = null;
      }}
      sx={{
        position: "relative",
        width: { xs: 240, md: 260 },
        aspectRatio: "2 / 3",
        touchAction: "pan-y",
        userSelect: "none",
      }}
    >
      {movies.map((movie, position) => {
        const front = position === 0;
        return (
          <Box
            key={movie?.tmdbid ?? `pending-${position}`}
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "14px",
              overflow: "hidden",
              bgcolor: "background.paper",
              boxShadow: "0 14px 40px rgba(0,0,0,.55)",
              transformOrigin: "50% 100%",
              transition:
                "transform .35s cubic-bezier(.2,.8,.2,1), opacity .35s",
              "@media (prefers-reduced-motion: reduce)": { transition: "none" },
              zIndex: front && leaving ? 4 : movies.length - position,
              opacity: front && leaving ? 0 : [1, 0.8, 0.55][position],
              transform:
                front && leaving
                  ? "translate(-120%, 10%) rotate(-14deg)"
                  : offsets[position],
            }}
          >
            {movie?.poster && (
              <Image
                src={movie.poster}
                alt={front ? `${movie.movie} poster` : ""}
                width={300}
                height={450}
                priority={front}
                draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            {front && movie?.dani_approved && <DaniBadge size={72} />}
          </Box>
        );
      })}
    </Box>
  );
};

export default PosterDeck;
