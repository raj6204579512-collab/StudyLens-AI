const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const { YoutubeTranscript } = require("youtube-transcript");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Cache by videoId so re-submitting the same video is instant
const lectureCache = new Map();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to StudyLens AI Backend!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "StudyLens API is working!" });
});

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timed out")), ms)
    ),
  ]);
}

// Register a student
app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, password, examPreference } = req.body;

    if (!fullName || !email || !password || !examPreference) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    if (!["JEE", "NEET"].includes(examPreference)) {
      return res.status(400).json({ message: "Choose JEE or NEET." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "This email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      examPreference,
    });

    return res.status(201).json({
      message: "Account created successfully!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        examPreference: user.examPreference,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "This email is already registered." });
    }
    console.error("Registration error:", error.message);
    return res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

// Login a student
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Login configuration is incomplete." });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        examPreference: user.examPreference,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Login failed. Please try again." });
  }
});

// Fetch YouTube Title, Author, Description & Keywords (max 3s)
async function getVideoDetails(videoId) {
  let title = "";
  let author = "";
  let description = "";
  let keywords = "";

  try {
    const [oembedRes, pageRes] = await Promise.allSettled([
      withTimeout(
        fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`),
        3000
      ),
      withTimeout(
        fetch(`https://www.youtube.com/watch?v=${videoId}`, {
          headers: { "User-Agent": "Mozilla/5.0" },
        }),
        3000
      ),
    ]);

    if (oembedRes.status === "fulfilled" && oembedRes.value.ok) {
      const data = await oembedRes.value.json();
      title = data.title || "";
      author = data.author_name || "";
    }

    if (pageRes.status === "fulfilled" && pageRes.value.ok) {
      const html = await pageRes.value.text();
      const descMatch = html.match(/<meta name="description" content="([^"]*)"/i);
      const kwMatch = html.match(/<meta name="keywords" content="([^"]*)"/i);
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);

      if (descMatch) description = descMatch[1];
      if (kwMatch) keywords = kwMatch[1];
      if (!title && titleMatch) {
        title = titleMatch[1].replace(/\s*-\s*YouTube$/i, "").trim();
      }
    }
  } catch {
    // Ignore metadata errors
  }

  return {
    title: title || `YouTube Lecture (${videoId})`,
    author: author || "Educator",
    description,
    keywords,
  };
}

// Fetch YouTube transcript (max 3s)
async function getFastTranscript(videoId) {
  try {
    const chunks = await withTimeout(YoutubeTranscript.fetchTranscript(videoId), 3000);
    if (Array.isArray(chunks) && chunks.length > 0) {
      return chunks.map((c) => c.text).join(" ").slice(0, 8000).trim();
    }
    return "";
  } catch {
    return "";
  }
}

function safeParseJSON(rawText) {
  const cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response could not be parsed as JSON.");
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    const fixedBackslashes = jsonMatch[0].replace(/\\(?!["\\/bfnrtu])/g, "\\\\");
    return JSON.parse(fixedBackslashes);
  }
}

// Call Gemini AI using gemini-3-flash-preview first, with 8192 output tokens
async function callGeminiAI(prompt) {
  const candidateModels = [
    "gemini-3-flash-preview",
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
  ];

  let lastError = null;
  for (const modelName of candidateModels) {
    try {
      console.log(`Generating with Gemini model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
          maxOutputTokens: 8192,
        },
      });

      const result = await model.generateContent(prompt);
      const raw = result.response.text();
      return { parsed: safeParseJSON(raw), modelName };
    } catch (err) {
      lastError = err;
      console.warn(`Model ${modelName} failed:`, err.message);
    }
  }

  throw lastError || new Error("No working Gemini model found for this API key.");
}

// Process a YouTube lecture -> Real Gemini AI Notes, Formulas & MINIMUM 20 MCQs
app.post("/api/lectures/process", async (req, res) => {
  try {
    const { lectureUrl } = req.body;

    if (!lectureUrl || typeof lectureUrl !== "string") {
      return res.status(400).json({ message: "Please provide a YouTube lecture URL." });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(lectureUrl.trim());
    } catch {
      return res.status(400).json({ message: "Invalid lecture URL." });
    }

    const allowedHosts = [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "youtu.be",
      "www.youtu.be",
    ];

    if (parsedUrl.protocol !== "https:" || !allowedHosts.includes(parsedUrl.hostname)) {
      return res.status(400).json({ message: "Please provide a valid HTTPS YouTube URL." });
    }

    const videoId = parsedUrl.hostname.includes("youtu.be")
      ? parsedUrl.pathname.slice(1).split("/")[0]
      : parsedUrl.searchParams.get("v");

    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return res.status(400).json({ message: "Could not find a valid YouTube video ID." });
    }

    if (lectureCache.has(videoId)) {
      return res.status(200).json(lectureCache.get(videoId));
    }

    // Fetch transcript and video metadata in parallel
    const [fullText, details] = await Promise.all([
      getFastTranscript(videoId),
      getVideoDetails(videoId),
    ]);

    const { title: videoTitle, author: videoAuthor, description, keywords } = details;
    console.log(`Processing video: "${videoTitle}" (${videoId})`);

    const contextSource = [
      `Video Title: "${videoTitle}" by ${videoAuthor}`,
      keywords ? `Keywords: ${keywords}` : "",
      description ? `Description: ${description}` : "",
      fullText
        ? `Transcript:\n${fullText}`
        : `(Captions not available; generate complete study notes, formulas, and at least 20 MCQs specifically for the topic "${videoTitle}".)`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const prompt = `You are an expert JEE/NEET teacher. Generate study notes, formulas, and AT LEAST 20 MCQs STRICTLY AND EXCLUSIVELY for this exact lecture topic: "${videoTitle}".
Return ONLY valid JSON with this exact format:
{
  "notes": ["point 1", "point 2"],
  "formulas": ["formula — what it represents"],
  "mcqs": [
    {
      "question": "...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "difficulty": "Easy",
      "explanation": "1-sentence explanation"
    }
  ]
}

Strict Rules:
1. Every single note, formula, and MCQ MUST be 100% about "${videoTitle}" (do NOT include unrelated chapters or subjects).
2. Generate 12 clear, high-yield study notes (1-2 sentences each).
3. Generate 8-10 key formulas/laws/equations specifically from "${videoTitle}".
4. MANDATORY: The "mcqs" array MUST contain AT LEAST 20 questions (20 to 22 MCQs) covering Easy, Medium, and Hard difficulty levels on "${videoTitle}".
5. Each MCQ's "answer" field MUST exactly match one of the 4 strings in its "options" array.
6. Use plain Unicode symbols (Δ, θ, π, √, ², ³, ∫, →) instead of LaTeX backslashes.

Lecture Input:
${contextSource}`;

    const { parsed } = await callGeminiAI(prompt);
    let mcqs = Array.isArray(parsed.mcqs) ? parsed.mcqs : [];

    // Guarantee at least 20 MCQs: if AI returned fewer than 20, fetch the remaining questions
    if (mcqs.length < 20) {
      const needed = 20 - mcqs.length;
      console.log(`Topping up ${needed} more MCQs to guarantee 20+ questions...`);
      const topUpPrompt = `Generate ${needed + 2} additional unique JEE/NEET MCQs strictly on the topic "${videoTitle}".
Return ONLY valid JSON:
{
  "mcqs": [
    {
      "question": "...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "difficulty": "Medium",
      "explanation": "1-sentence explanation"
    }
  ]
}`;
      try {
        const { parsed: extra } = await callGeminiAI(topUpPrompt);
        if (extra && Array.isArray(extra.mcqs)) {
          mcqs = [...mcqs, ...extra.mcqs];
        }
      } catch (topUpErr) {
        console.warn("Top-up MCQ call skipped:", topUpErr.message);
      }
    }

    const responsePayload = {
      message: `Notes & ${mcqs.length} MCQs generated for "${videoTitle}"!`,
      videoId,
      notes: parsed.notes || [],
      formulas: parsed.formulas || [],
      mcqs,
    };

    lectureCache.set(videoId, responsePayload);
    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error("Lecture processing error:", error.message);
    return res.status(500).json({
      message: `AI Error: ${error.message}`,
    });
  }
});

async function startServer() {
  const PORT = process.env.PORT || 5000;

  // 1. Pehle Port start hoga taaki Render turant LIVE ho jaye
  app.listen(PORT, () => {
    console.log(`StudyLens AI server running on port ${PORT}`);
  });

  // 2. Fir MongoDB connect hoga bina crash kiye
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected successfully!");
    } else {
      console.warn("MONGO_URI not provided.");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

startServer();