import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Fragment, memo, useState } from "react";
import { Box } from "@mui/system";
import {
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from "@mui/material";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "routes";
import { useAddFeedback } from "@infrastructure/apis/api-management/useFeedback";
import { FeedbackAddDTO } from "@infrastructure/apis/client";
import { toast } from "react-toastify";

// Enum for satisfaction values
export enum SatisfactionEnum {
  VeryHappy = "VeryHappy",
  Happy = "Happy",
  Neutral = "Neutral",
  Unhappy = "Unhappy"
}

export const FeedbackPage = memo(() => {
  const [feedbackText, setFeedbackText] = useState("");
  const [satisfaction, setSatisfaction] = useState<SatisfactionEnum | "">("");
  const [wouldRecommend, setWouldRecommend] = useState(false);
  const navigate = useNavigate();
  const addFeedback = useAddFeedback();

  const handleSubmit = () => {
    if (!feedbackText.trim() || !satisfaction) return;

    const feedback: FeedbackAddDTO = {
      text: feedbackText,
      satisfaction: satisfaction,
      wouldRecommend: wouldRecommend,
    };

    addFeedback.mutate(feedback, {
      onSuccess: () => {
        toast("Feedback added!");
        navigate(AppRoute.UserFiles)},
    });

    // Reset form
    setFeedbackText("");
    setSatisfaction("");
    setWouldRecommend(false);
  };

  return (
    <Fragment>
      <Seo title="MobyLab Web App | Feedback" />
      <WebsiteLayout viewingTorrent={false} text="Feedback">
        <Box sx={{ padding: "30px 50px" }}>
          <ContentCard>
            <Typography variant="h5" gutterBottom>
              We value your feedback!
            </Typography>

            <Stack spacing={3} mt={2}>
              <TextField
                label="Your Feedback"
                multiline
                minRows={4}
                fullWidth
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />

              <FormControl component="fieldset">
                <FormLabel component="legend">How satisfied are you with our site?</FormLabel>
                <RadioGroup
                  value={satisfaction}
                  onChange={(e) => setSatisfaction(e.target.value as SatisfactionEnum)}
                  row
                >
                  {Object.values(SatisfactionEnum).map((value) => (
                    <FormControlLabel
                      key={value}
                      value={value}
                      control={<Radio />}
                      label={value.replace(/([A-Z])/g, " $1").trim()}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={wouldRecommend}
                    onChange={(e) => setWouldRecommend(e.target.checked)}
                  />
                }
                label="Would you recommend our site to a friend?"
              />

              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!feedbackText.trim() || !satisfaction}
                >
                  Submit Feedback
                </Button>
              </Stack>
            </Stack>
          </ContentCard>
        </Box>
      </WebsiteLayout>
    </Fragment>
  );
});
