import { Box, CircularProgress } from "@mui/material";

const Spinner = () => {
  return (
    <Box className="flex justify-center items-center h-[80vh] w-full">
      <CircularProgress color="secondary" />
    </Box>
  );
};

export default Spinner;
