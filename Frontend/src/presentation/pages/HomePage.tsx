import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Typography, Box, Stack } from "@mui/material";
import { Fragment, memo } from "react";
import { Seo } from "@presentation/components/ui/Seo";

export const HomePage = memo(() => {
  return (
    <Fragment>
      <Seo title="Torrentville | Home" />
      <WebsiteLayout>
        <Box sx={{ padding: "50px 20px", textAlign: "center" }}>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h2" fontWeight="bold">
              Welcome to Torrentville
            </Typography>
            <Typography variant="h6" maxWidth="600px">
              A community-driven platform where users can upload, share, and discover torrents together.
            </Typography>
          </Stack>
        </Box>
      </WebsiteLayout>
    </Fragment>
  );
});
