import {
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Slider,
  Theme,
  useTheme,
} from "@mui/material";
import { useState } from "react";

interface fitersProps {
  filterTypes: AllType;
}

function buildGenreFilter(genres: FilterType[]) {
  // Data management for the genre filter
  let genreStrings = genres
    .sort((a, b) => b.totalCount - a.totalCount)
    .map((genre) => genre.fieldValue);
  var popularGenres = genreStrings.slice(1, 11).sort((a, b) => {
    return a.localeCompare(b);
  });
  var moreGenres = genreStrings.slice(11).sort((a, b) => {
    return a.localeCompare(b);
  });
  return { Popular: popularGenres, More: moreGenres };
}

function generateDecades(years: number[]) {
  return Array.from(
    new Set(
      years.map((year) => {
        const start = Math.floor(year / 10) * 10;
        const end = start + 9;
        return `${start}-${end}`;
      })
    )
  );
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function Filters({ filterTypes }: fitersProps) {
  console.log(filterTypes);
  console.log(buildGenreFilter(filterTypes?.genre));
  console.log(generateDecades(filterTypes.year));

  const theme = useTheme();
  const [personName, setPersonName] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Grid xs={12} md={6} item={true} key={`director-12`}>
      <div key={`director-select-picker`} style={{ textAlign: "center" }}>
        Director
      </div>
      <div>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-name-label">Name</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {names.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </Grid>
  );
}
