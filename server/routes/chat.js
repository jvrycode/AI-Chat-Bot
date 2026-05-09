const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const Groq = require('groq-sdk');

const upload = multer({ dest: os.tmpdir() });

// Get conversation history
router.get('/conversation/:id', (req, res) => {
  const { id } = req.params;
  // In a real app, you'd fetch from a database
  res.json({ messages: [] });
});

// Create new conversation
router.post('/conversation', (req, res) => {
  const conversationId = Date.now().toString();
  res.json({ conversationId });
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Audio transcription endpoint
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Groq requires a read stream with a known file extension in the filename
    // Multer saves without extension in tmpdir, so we rename it temporarily
    const originalPath = req.file.path;
    const newPath = `${originalPath}.webm`; // Assuming webm from browser MediaRecorder
    fs.renameSync(originalPath, newPath);

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(newPath),
      model: "whisper-large-v3",
      response_format: "json",
      language: "en", // Force English to prevent Chinese hallucinations from noise
    });

    // Cleanup temp file
    fs.unlinkSync(newPath);

    res.json({ text: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    // Cleanup on error too
    if (req.file && fs.existsSync(req.file.path)) {
       fs.unlinkSync(req.file.path);
    }
    if (req.file && fs.existsSync(`${req.file.path}.webm`)) {
       fs.unlinkSync(`${req.file.path}.webm`);
    }
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

module.exports = router;
