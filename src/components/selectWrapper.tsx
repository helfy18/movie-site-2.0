import { Grid2, IconButton, MenuItem, Select } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { handleSelectChange, menuProps, selectSx } from "./selectShared";

interface selectWrapperProps {
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  options: string[];
  title: string;
}

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
          onChange={(event) => handleSelectChange(event, setSelected)}
          className="w-full text-secondary"
          MenuProps={menuProps}
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
          sx={selectSx}
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
