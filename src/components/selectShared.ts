import { SelectChangeEvent } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

export const selectSx = {
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: "secondary.main",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "secondary.main",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "secondary.light",
  },
  color: "secondary.main",
};

export const menuProps = {
  sx: {
    "&& .Mui-selected": {
      fontWeight: "bold",
    },
  },
};

export const handleSelectChange = (
  event: SelectChangeEvent<string[]>,
  setter: Dispatch<SetStateAction<string[]>>,
) => {
  const value = event.target.value;
  setter(typeof value === "string" ? value.split(",") : value);
};
