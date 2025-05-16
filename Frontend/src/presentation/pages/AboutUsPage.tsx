import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Typography, Box, Stack, Paper } from "@mui/material";
import { Fragment, memo } from "react";
import { Seo } from "@presentation/components/ui/Seo";

export const AboutUsPage = memo(() => {
  return (
    <Fragment>
      <Seo title="Torrentville | About Us" />
      <WebsiteLayout>
        <Box sx={{ padding: "50px 20px", textAlign: "center" }}>
          <Stack spacing={5} alignItems="center">
            <Typography variant="h3" fontWeight="bold">
              About Us
            </Typography>
            <Typography variant="h6" maxWidth="700px">
              Torrentville is maintained by a small but dedicated team of administrators who keep the platform running smoothly.
            </Typography>

            <Stack spacing={3} maxWidth="600px" width="100%">
              <Paper elevation={3} sx={{ padding: 3, textAlign: "left" }}>
                <Typography variant="h5" fontWeight="medium">
                  Admin
                </Typography>
                <Typography variant="body1">
                  Anonymous admin, details undisclosed.
                </Typography>
              </Paper>

              <Paper elevation={3} sx={{ padding: 3, textAlign: "left" }}>
                <Typography variant="h5" fontWeight="medium">
                  Miron
                </Typography>
                <Typography variant="body1">
                  Would really like to be done with his college degree already.
                </Typography>
              </Paper>
            </Stack>
          </Stack>
        </Box>
      </WebsiteLayout>
    </Fragment>
  );
});
