import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Fragment, memo, useState } from "react";
import { Box } from "@mui/system";
import {
  Typography,
  TextField,
  Button,
  Stack
} from "@mui/material";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { useMatch, useNavigate } from "react-router-dom";
import { useGetTorrent } from "@infrastructure/apis/api-management/useTorrent";
import { useAddComment } from "@infrastructure/apis/api-management/useComment";

export const AddCommentPage = memo(() => {
  const match = useMatch("/add-comment/:id");
  const torrentId = match?.params.id ?? null;

  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const addComment = useAddComment();
  const torrent = useGetTorrent(torrentId);

  const handleSubmit = async () => {
    if (torrentId && commentText.trim()) {
      addComment.mutate({
        text: commentText,
        torrentId,
      }, {
        onSuccess: () => {
          navigate(`/view-torrent/${torrentId}`);
        }
      });
    }
  };

  const torrentName = torrent.data?.response?.name ?? "Loading...";

  return (
    <Fragment>
      <Seo title="MobyLab Web App | Add Comment" />
      <WebsiteLayout viewingTorrent={true} text="Adding Comment">
        <Box sx={{ padding: "30px 50px" }}>
          <ContentCard>
            <Typography variant="h5" gutterBottom>
              Add a Comment
            </Typography>

            <Stack spacing={3} mt={2}>
              <TextField
                label="Torrent Name"
                value={torrentName}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
              />

              <TextField
                label="Your Comment"
                multiline
                minRows={4}
                fullWidth
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />

              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!commentText.trim() || addComment.isPending}
                >
                  Publish
                </Button>
              </Stack>
            </Stack>
          </ContentCard>
        </Box>
      </WebsiteLayout>
    </Fragment>
  );
});