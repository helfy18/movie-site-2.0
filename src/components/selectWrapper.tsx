import { Grid, IconButton, MenuItem, Select } from "@mui/material";
import { Dispatch, ReactNode, SetStateAction } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { handleSelectChange, menuProps, selectSx } from "./selectShared";

interface Props {
  title: string;
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  options?: string[];
  placeholder?: string;
  renderValue?: (selected: string[]) => ReactNode;
  children?: ReactNode;
}

export default function SelectWrapper({
  title,
  selected,
  setSelected,
  options = [],
  placeholder = `Ex: ${options[0]}, ${options[1]}`,
  renderValue = (value) => value.join(", "),
  children,
}: Props) {
  return (
    <Grid size={{ xs: 12, md: 6 }} className="py-0 px-2">
      <div className="text-center">{title}</div>
      <div className="flex items-center gap-2">
        <Select
          multiple
          value={selected}
          onChange={(event) => handleSelectChange(event, setSelected)}
          className="w-full text-secondary"
          MenuProps={menuProps}
          displayEmpty
          renderValue={(value) =>
            value.length === 0 ? (
              <span className="text-secondary/20">{placeholder}</span>
            ) : (
              renderValue(value)
            )
          }
          sx={selectSx}
        >
          {children ??
            options.map((option) => (
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
    </Grid>
  );
}
