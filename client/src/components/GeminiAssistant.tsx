import { useState } from "react";
import {
  Box,
  Typography,
  InputBase,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import WidgetWrapper from "../components/WidgetWrapper";

const GeminiAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const { palette } = useTheme();
  const primary = palette.primary.main;
  const medium = palette.grey[500];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setSuggestion("");

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/gemini`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setSuggestion(data.suggestion);
    } catch (err) {
      console.error("Error fetching suggestion:", err);
      setSuggestion("⚠️ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WidgetWrapper>
      <Typography
        variant="h5"
        fontWeight="600"
        sx={{
          color: primary,
          mb: "1rem",
          textAlign: "center", // Center the text horizontally
        }}
      >
        Need help writing your post? 🤖
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          flexDirection: "column", // Stack items vertically
          mb: "1rem", // Add spacing below the title
        }}
      >
        <InputBase
          placeholder="Describe your idea or ask Gemini to help..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{
            width: "100%",
            backgroundColor: palette.background.paper,
            borderRadius: "0.75rem",
            padding: "1rem",
            mb: "1rem",
            border: `1px solid ${medium}`,
          }}
          multiline
          rows={4}
        />
        <Button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          sx={{
            width: "100%",
            backgroundColor: primary,
            color: palette.background.paper,
            padding: "0.75rem",
            borderRadius: "0.75rem",
            "&:hover": {
              backgroundColor: palette.primary.dark,
            },
            mb: "1rem",
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Generate Suggestion"}
        </Button>
        {suggestion && (
          <Box
            sx={{
              backgroundColor: palette.background.paper,
              borderRadius: "1rem",
              padding: "1.5rem",
              mt: "1.5rem",
              border: `1px solid ${primary}`,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add a subtle shadow
            }}
          >
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                color: primary,
                mb: "1rem",
                textAlign: "center", // Center the title
              }}
            >
              Suggested Post
            </Typography>
            <Typography
              sx={{
                color: palette.text.primary,
                fontSize: "1rem",
                lineHeight: "1.5rem",
                textAlign: "left", // Justify the text for better readability
                whiteSpace: "pre-wrap",
                wordBreak: "break-word"
              }}
            >
              {suggestion}
            </Typography>
          </Box>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default GeminiAssistant;