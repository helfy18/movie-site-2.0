import {
  Grid2,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import ClearIcon from "@mui/icons-material/Clear";

interface selectWrapperProps {
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  options: string[];
  title: string;
}

export const sxProp = {
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: "secondary.main", // Sets border color to secondary color
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "secondary.main", // Ensures border remains secondary color when focused
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "secondary.light",
  },
  color: "secondary.main",
};

export const getMenuProps = () => {
  return {
    sx: {
      "&& .Mui-selected": {
        fontWeight: "bold",
      },
    },
  };
};

export const handleChange = (
  event: SelectChangeEvent<string[]>,
  setter: Dispatch<SetStateAction<string[]>>
) => {
  const value = event.target.value;
  setter(typeof value === "string" ? value.split(",") : value);
};

export default function SelectWrapper({
  selected,
  setSelected,
  options,
  title,
}: selectWrapperProps) {
  return (
    <Grid2 size={{ xs: 12, md: 6 }} className="py-0 px-2">
      <div className="text-center">{title}</div>
      <div className="flex items-center gap-2">
        <Select
          multiple
          value={selected}
          onChange={(event) => handleChange(event, setSelected)}
          className="w-full text-secondary"
          MenuProps={getMenuProps()}
          displayEmpty
          renderValue={(selected) => {
            if (selected.length === 0) {
              return (
                <span className="text-secondary text-opacity-20">
                  Ex: {options[0]}, {options[1]}
                </span>
              );
            }
            return selected.join(", ");
          }}
          sx={sxProp}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        {selected.length > 0 && (
          <IconButton
            onClick={() => setSelected([])}
            aria-label="clear selection"
          >
            <ClearIcon color="secondary" />
          </IconButton>
        )}
      </div>
    </Grid2>
  );
}
