import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    console.log("Sending request to Gemini API...");
    console.log("Prompt:", prompt);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return res.status(response.status).json({ error: errorData.error || "Failed to fetch suggestion from Gemini." });
    }

    const geminiRes = await response.json();
    const suggestion = geminiRes.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestion found.";

    console.log("Suggestion:", suggestion);
    res.json({ suggestion });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Gemini API error:", error.message);
    } else {
      console.error("Gemini API error:", error);
    }
    res.status(500).json({ error: "Failed to fetch suggestion from Gemini." });
  }
});

export default router;