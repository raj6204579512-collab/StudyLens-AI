const router = require("express").Router();
const { YoutubeTranscript } = require("youtube-transcript");
const Anthropic = require("@anthropic-ai/sdk");
const requireAuth = require("../middleware/auth");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function extractVideoId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

router.post("/generate", requireAuth, async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = extractVideoId(url || "");

    if (!videoId) {
      return res.status(400).json({ error: "Could not read a video ID from that URL." });
    }

    let transcriptChunks;
    try {
      transcriptChunks = await YoutubeTranscript.fetchTranscript(videoId);
    } catch (err) {
      return res.status(422).json({
        error: "This video has no captions available.",
      });
    }

    const fullText = transcriptChunks.map((c) => c.text).join(" ").slice(0, 15000);

    const completion = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Return ONLY valid JSON: {"notes":[...],"formulas":[...],"mcqs":[{"question":"...","options":["A","B","C","D"],"answer":"A"}]}\n\nTranscript:\n${fullText}`,
        },
      ],
    });

    const raw = completion.content[0].text;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    res.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong generating notes." });
  }
});

module.exports = router;