import { Box, Typography } from "@mui/material";
import { NewsletterForm } from "../(site)/components/NewsletterForm";

export default function SubscribePage() {
  return (
    <Box
      component="main"
      id="content"
      className="flex flex-col items-center gap-6 p-4 text-center"
    >
      <Typography variant="h4" className="font-semibold">
        Stay Updated
      </Typography>
      <Typography className="max-w-2xl">
        Subscribe for new resources and research updates. We’ll never share your
        email.
      </Typography>
      <NewsletterForm source="subscribe-page" />
      <Typography variant="body2" color="text.secondary">
        We respect your privacy. Unsubscribe anytime.
      </Typography>
    </Box>
  );
}
