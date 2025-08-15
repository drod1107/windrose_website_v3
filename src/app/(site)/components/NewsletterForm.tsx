"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  hp: z.string().max(0).optional(),
});

type NewsletterFormProps = {
  source?: string;
};

export const NewsletterForm = ({ source }: NewsletterFormProps) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const formData = {
      email,
      hp: (e.currentTarget.elements.namedItem("hp") as HTMLInputElement)?.value,
    };
    const result = schema.safeParse(formData);
    if (!result.success) {
      setError("Enter a valid email.");
      return;
    }
    if (result.data.hp) {
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (res.ok) {
        setMessage("Thanks for subscribing!");
        setEmail("");
      } else {
        setError("Subscription failed.");
      }
    } catch {
      setError("Subscription failed.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col items-center gap-4"
      noValidate
    >
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
      />
      <input
        data-testid="hp"
        type="text"
        name="hp"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />
      {error && <Typography color="error">{error}</Typography>}
      {message && (
        <Typography sx={{ color: "success.main" }}>{message}</Typography>
      )}
      <Button type="submit" variant="contained">
        Subscribe
      </Button>
    </Box>
  );
};
