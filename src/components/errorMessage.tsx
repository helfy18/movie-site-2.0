import { Box, Button, Typography } from "@mui/material";

interface Props {
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
}

const ErrorMessage = ({
  message = "Something went wrong.",
  onRetry,
  compact = false,
}: Props) => (
  <Box
    className={`flex flex-col justify-center items-center w-full gap-4 ${
      compact ? "py-4" : "h-[80vh]"
    }`}
  >
    <Typography>{message}</Typography>
    {onRetry && (
      <Button
        onClick={onRetry}
        sx={{
          borderRadius: "0.5rem",
          color: "secondary.main",
          outline: "1px solid",
          px: 4,
        }}
      >
        Try again
      </Button>
    )}
  </Box>
);

export default ErrorMessage;
