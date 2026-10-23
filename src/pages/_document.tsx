import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentInitialProps,
} from "next/document";
import { colors } from "@/styles/tokens";

class AppDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    // Temporary diagnostics: log who is driving server renders, so the
    // once-a-minute burst in the Netlify function log can be identified.
    // Remove once the culprit is known.
    if (ctx.req) {
      console.log(
        `render ${ctx.req.url} ua=${ctx.req.headers["user-agent"] ?? "-"} ip=${
          ctx.req.headers["x-nf-client-connection-ip"] ??
          ctx.req.headers["x-forwarded-for"] ??
          "-"
        }`,
      );
    }
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <meta name="theme-color" content={colors.background} />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content="JD Movies" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
