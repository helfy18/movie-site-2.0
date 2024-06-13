import { ApiProvider } from "@/contexts/apiContext";
import "@/styles/globals.css";
import theme from "@/styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApiProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </ApiProvider>
  );
}
