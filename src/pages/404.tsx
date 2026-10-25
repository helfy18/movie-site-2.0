import Layout from "@/components/layout";
import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

const NotFoundPage = () => {
  const router = useRouter();
  const [text, setText] = useState("");

  return (
    <Layout pageTitle="Not Found">
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          const search = text.trim();
          router.push(
            search
              ? { pathname: "/movie-grid", query: { search } }
              : "/movie-grid",
          );
        }}
        sx={{
          textAlign: "center",
          maxWidth: 420,
          mx: "auto",
          pt: { xs: 6, md: 12 },
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontWeight: 700, color: "text.secondary", mb: 0.5 }}
        >
          Not rated yet
        </Typography>
        <Typography sx={{ color: "text.disabled", mb: 3 }}>
          I haven&apos;t seen this one. Looking for something else?
        </Typography>
        <TextField
          fullWidth
          autoFocus
          placeholder="Search for title, actor, director"
          value={text}
          onChange={(event) => setText(event.target.value)}
          color="secondary"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="secondary" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </Layout>
  );
};

export default NotFoundPage;
