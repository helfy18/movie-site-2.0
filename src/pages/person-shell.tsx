import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import PersonDetail from "@/components/personDetail";
import { loadPerson } from "@/pages/person/[name]";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";

// Served for any /person/<name> that was not pre-rendered (see public/_redirects).
// router.asPath carries the real URL once hydration has finished.
const nameFromPath = (path: string) => {
  const match = path.match(/\/person\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const PersonShell = () => {
  const router = useRouter();
  const name = router.isReady ? nameFromPath(router.asPath) : null;

  const query = useQuery({
    queryKey: ["person-shell", name],
    queryFn: () => loadPerson(name as string),
    enabled: name !== null,
  });

  const missing = router.isReady && name === null;
  if (missing || query.isError || (query.isSuccess && !query.data)) {
    return (
      <Layout pageTitle="Person not found">
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <Typography
          sx={{ color: "secondary.main", textAlign: "center", mt: 8 }}
        >
          No rated movies for this person.
        </Typography>
      </Layout>
    );
  }
  if (!query.data) {
    return (
      <Layout pageTitle="Loading">
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <Spinner />
      </Layout>
    );
  }
  return <PersonDetail {...query.data} />;
};

export default PersonShell;
