import { useState } from "react";
 

const GeminiAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="p-4 bg-white border rounded shadow max-w-xl mx-auto my-6">
      <h2 className="text-xl font-semibold mb-2">Need help writing your post?</h2>
      <textarea
        className="w-full border p-2 rounded mb-2"
        rows={4}
        placeholder="Describe your idea or ask Gemini to help..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Generate Suggestion"}
      </button>

      {suggestion && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <strong>Suggested Post:</strong>
          <p>{suggestion}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;