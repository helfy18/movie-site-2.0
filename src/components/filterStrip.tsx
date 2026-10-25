import {
  Box,
  Button,
  Chip,
  Divider,
  ListSubheader,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useMemo, useState } from "react";
import {
  buildGenreFilter,
  byName,
  generateDecades,
  sortUniverses,
} from "./filters";
import { menuProps } from "./selectShared";

interface Props {
  filterTypes: AllType;
  values: MovieListQuery;
  resultCount: number;
  onChange: (values: MovieListQuery) => void;
}

type ListKey =
  | "genre"
  | "universe"
  | "decade"
  | "provider"
  | "studio"
  | "director"
  | "year"
  | "holiday";

const LABELS: Record<ListKey, string> = {
  genre: "Genre",
  universe: "Universe",
  decade: "Decade",
  provider: "Provider",
  studio: "Studio",
  director: "Director",
  year: "Year",
  holiday: "Holiday",
};

// Strip membership: the first five on desktop, genre, universe and provider
// on phones. Everything else lives behind "All filters".
const STRIP: ListKey[] = ["genre", "universe", "decade", "provider", "studio"];
const PHONE_STRIP: ListKey[] = ["genre", "universe", "provider"];
const PANEL: ListKey[] = ["director", "year", "holiday"];

const pillSx = {
  borderRadius: "999px",
  bgcolor: "background.paper",
  color: "text.secondary",
  fontSize: "0.9rem",
  height: 36,
  "& .MuiSelect-select": { py: 0.75, pl: 1.75, pr: "32px !important" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
  "&.active .MuiOutlinedInput-notchedOutline": {
    borderColor: "secondary.main",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "secondary.main" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "secondary.main",
  },
  "& .MuiSvgIcon-root": { color: "text.disabled" },
};

const PillSelect = ({
  label,
  value,
  onChange,
  display = (v) => v,
  children,
  sx,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  display?: (value: string) => string;
  children: React.ReactNode;
  sx?: object;
}) => (
  <Select
    multiple
    displayEmpty
    value={value}
    onChange={(event) => {
      const next = event.target.value;
      onChange(typeof next === "string" ? next.split(",") : next);
    }}
    className={value.length > 0 ? "active" : undefined}
    MenuProps={menuProps}
    renderValue={(selected) => (
      <>
        <Box component="span" sx={{ color: "text.disabled" }}>
          {label}{" "}
        </Box>
        <Box
          component="span"
          sx={{
            fontWeight: 600,
            color: selected.length > 0 ? "secondary.main" : "text.secondary",
          }}
        >
          {selected.length === 0
            ? "Any"
            : selected.length === 1
              ? display(selected[0])
              : `${selected.length} selected`}
        </Box>
      </>
    )}
    sx={{ ...pillSx, ...sx }}
  >
    {children}
  </Select>
);

const Toggle = ({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) => (
  <Button
    onClick={onClick}
    aria-pressed={on}
    sx={{
      borderRadius: "999px",
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.9rem",
      px: 1.75,
      height: 36,
      flex: "none",
      border: "1px solid",
      borderColor: on ? "secondary.main" : "background.paper",
      bgcolor: on ? "secondary.main" : "transparent",
      color: on ? "#1c1917" : "text.disabled",
      "&:hover": { bgcolor: on ? "secondary.main" : "background.paper" },
    }}
  >
    {label}
  </Button>
);

const clean = (query: MovieListQuery): MovieListQuery => {
  const next: MovieListQuery = {};
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value) ? value.length > 0 : Boolean(value))
      (next as Record<string, unknown>)[key] = value;
  }
  return next;
};

const FilterStrip = ({ filterTypes, values, resultCount, onChange }: Props) => {
  const [open, setOpen] = useState(false);

  const genres = useMemo(
    () => buildGenreFilter(filterTypes.genre),
    [filterTypes.genre],
  );
  const universes = useMemo(
    () => sortUniverses(filterTypes.universes),
    [filterTypes.universes],
  );
  const options: Record<ListKey, string[]> = useMemo(
    () => ({
      genre: [...genres.Popular, ...genres.More],
      universe: universes.flatMap((u) => [
        u.fieldValue,
        ...u.subUniverses.map((sub) => sub.fieldValue),
      ]),
      decade: generateDecades(filterTypes.year),
      provider: filterTypes.provider.map((p) => String(p.provider_id)),
      studio: [...filterTypes.studio].sort(byName),
      director: filterTypes.director.map((d) => d.fieldValue).sort(byName),
      year: [...filterTypes.year].sort((a, b) => b - a).map(String),
      holiday: [...filterTypes.holiday].sort(byName),
    }),
    [filterTypes, genres, universes],
  );
  const providerName = (id: string) =>
    filterTypes.provider.find((p) => String(p.provider_id) === id)
      ?.provider_name ?? id;
  const display = (key: ListKey, value: string) =>
    key === "provider" ? providerName(value) : value;

  const { min: runtimeMin, max: runtimeMax } = filterTypes.runtime[0] ?? {
    min: 0,
    max: 300,
  };
  const runtime = values.runtime ?? [runtimeMin, runtimeMax];
  const rating = values.rating ?? [0, 100];

  const set = (patch: Partial<MovieListQuery>) =>
    onChange(clean({ ...values, ...patch }));
  const remove = (key: ListKey, value: string) =>
    set({ [key]: (values[key] ?? []).filter((v) => v !== value) });

  const menu = (key: ListKey) =>
    key === "universe"
      ? universes.flatMap((u) =>
          u.subUniverses.length > 1
            ? [
                <ListSubheader key={`h-${u.fieldValue}`}>
                  {u.fieldValue}
                </ListSubheader>,
                ...[...u.subUniverses]
                  .sort((a, b) => byName(a.fieldValue, b.fieldValue))
                  .map((sub) => (
                    <MenuItem key={sub.fieldValue} value={sub.fieldValue}>
                      {sub.fieldValue}
                    </MenuItem>
                  )),
                <MenuItem key={u.fieldValue} value={u.fieldValue}>
                  All {u.fieldValue}
                </MenuItem>,
                <Divider key={`d-${u.fieldValue}`} />,
              ]
            : [
                <MenuItem key={u.fieldValue} value={u.fieldValue}>
                  {u.fieldValue}
                </MenuItem>,
              ],
        )
      : options[key].map((option) => (
          <MenuItem key={option} value={option}>
            {display(key, option)}
          </MenuItem>
        ));

  const select = (key: ListKey, sx?: object) => (
    <PillSelect
      key={key}
      label={LABELS[key]}
      value={values[key] ?? []}
      onChange={(next) => set({ [key]: next })}
      display={(v) => display(key, v)}
      sx={sx}
    >
      {menu(key)}
    </PillSelect>
  );
  const stripOnly = (key: ListKey) => ({
    display: {
      xs: PHONE_STRIP.includes(key) ? "inline-flex" : "none",
      md: "inline-flex",
    },
  });
  const panelOnly = (key: ListKey) => ({
    display: { xs: "inline-flex", md: "none" },
  });

  const chips: { key: string; label: string; onDelete: () => void }[] = [
    ...[...STRIP, ...PANEL].flatMap((key) =>
      (values[key] ?? []).map((value) => ({
        key: `${key}-${value}`,
        label: display(key, value),
        onDelete: () => remove(key, value),
      })),
    ),
    ...(values.free
      ? [
          {
            key: "free",
            label: "Free to watch",
            onDelete: () => set({ free: undefined }),
          },
        ]
      : []),
    ...(values.dani_approved
      ? [
          {
            key: "dani",
            label: "Dani approved",
            onDelete: () => set({ dani_approved: undefined }),
          },
        ]
      : []),
    ...(values.rating
      ? [
          {
            key: "rating",
            label: `Score ${rating[0]} to ${rating[1]}`,
            onDelete: () => set({ rating: undefined }),
          },
        ]
      : []),
    ...(values.runtime
      ? [
          {
            key: "runtime",
            label: `${runtime[0]} to ${runtime[1]} min`,
            onDelete: () => set({ runtime: undefined }),
          },
        ]
      : []),
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          flexWrap: { xs: "nowrap", md: "wrap" },
          overflowX: { xs: "auto", md: "visible" },
          pb: { xs: 0.5, md: 0 },
          mx: { xs: -2, md: 0 },
          px: { xs: 2, md: 0 },
          "& > *": { flex: "none" },
        }}
      >
        {STRIP.map((key) => select(key, stripOnly(key)))}
        <Toggle
          label="Free"
          on={Boolean(values.free)}
          onClick={() => set({ free: values.free ? undefined : true })}
        />
        <Toggle
          label="Dani approved"
          on={Boolean(values.dani_approved)}
          onClick={() =>
            set({ dani_approved: values.dani_approved ? undefined : true })
          }
        />
        <Button
          onClick={() => setOpen((previous) => !previous)}
          color="secondary"
          endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            ml: { md: "auto" },
            textTransform: "none",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          All filters
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          mt: 1.5,
          color: "text.disabled",
          fontSize: "0.9rem",
        }}
      >
        <span>
          Showing{" "}
          <Box component="b" sx={{ color: "text.secondary" }}>
            {resultCount.toLocaleString()}
          </Box>{" "}
          movies
        </span>
        {chips.map((chip) => (
          <Chip
            key={chip.key}
            label={chip.label}
            onDelete={chip.onDelete}
            variant="outlined"
            size="small"
            sx={{
              color: "text.secondary",
              borderColor: "background.paper",
              "& .MuiChip-deleteIcon": { color: "text.disabled" },
            }}
          />
        ))}
        {chips.length > 0 && (
          <Button
            size="small"
            color="secondary"
            onClick={() => onChange({})}
            sx={{ textTransform: "none", fontWeight: 600, minWidth: 0 }}
          >
            Clear
          </Button>
        )}
      </Box>

      {open && (
        <Box
          sx={{
            mt: 1.5,
            p: 2,
            borderRadius: "12px",
            bgcolor: "#2f2a27",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: "12px 16px",
            alignItems: "center",
          }}
        >
          {select("decade", panelOnly("decade"))}
          {select("studio", panelOnly("studio"))}
          {PANEL.map((key) => select(key))}
          <Box sx={{ px: 1 }}>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Score {rating[0]} to {rating[1]}
            </Typography>
            <Slider
              size="small"
              color="secondary"
              min={0}
              max={100}
              value={rating}
              onChange={() => {}}
              onChangeCommitted={(_, value) => {
                const [low, high] = value as number[];
                set({
                  rating: low === 0 && high === 100 ? undefined : [low, high],
                });
              }}
              valueLabelDisplay="auto"
            />
          </Box>
          <Box sx={{ px: 1 }}>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Runtime {runtime[0]} to {runtime[1]} min
            </Typography>
            <Slider
              size="small"
              color="secondary"
              min={runtimeMin}
              max={runtimeMax}
              value={runtime}
              onChange={() => {}}
              onChangeCommitted={(_, value) => {
                const [low, high] = value as number[];
                set({
                  runtime:
                    low === runtimeMin && high === runtimeMax
                      ? undefined
                      : [low, high],
                });
              }}
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FilterStrip;
