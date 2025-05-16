import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Typography, Box, Stack, Paper } from "@mui/material";
import { Fragment, memo } from "react";
import { Seo } from "@presentation/components/ui/Seo";

export const ContactUsPage = memo(() => {
  return (
    <Fragment>
      <Seo title="Torrentville | Contact Us" />
      <WebsiteLayout>
        <Box sx={{ padding: "50px 20px", textAlign: "center" }}>
          <Stack spacing={5} alignItems="center">
            <Typography variant="h3" fontWeight="bold">
              Contact Us
            </Typography>
            <Typography variant="h6" maxWidth="700px">
              Need to reach an admin? Here’s how you can get in touch (or not).
            </Typography>

            <Stack spacing={3} maxWidth="600px" width="100%">
              <Paper elevation={3} sx={{ padding: 3, textAlign: "left" }}>
                <Typography variant="h5" fontWeight="medium">
                  Admin
                </Typography>
                <Typography variant="body1"><strong>Email:</strong> admin@default.com</Typography>
                <Typography variant="body1"><strong>Phone:</strong> REDACTED</Typography>
                <Typography variant="body1" mt={1}>
                  <strong>Additional Info:</strong> Just leave a feedback and it will reach him.
                </Typography>
              </Paper>

              <Paper elevation={3} sx={{ padding: 3, textAlign: "left" }}>
                <Typography variant="h5" fontWeight="medium">
                  Miron
                </Typography>
                <Typography variant="body1"><strong>Email:</strong> victor.boiangiu@stud.acs.pub.ro</Typography>
                <Typography variant="body1"><strong>Phone:</strong> 0771 000 000</Typography>
                <Typography variant="body1" mt={1}>
                  <strong>Additional Info:</strong> Would prefer not to be contacted.
                </Typography>
              </Paper>
            </Stack>
          </Stack>
        </Box>
      </WebsiteLayout>
    </Fragment>
  );
});
