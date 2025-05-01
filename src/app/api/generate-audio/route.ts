import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const API_KEY = process.env.OPENAI_API_KEY;
const TMP_DIR = process.env.VIDEO_OUTPUT_DIR || '/tmp/videos';
// Public directory for serving audio
const PUBLIC_AUDIO_DIR = path.join(process.cwd(), 'public', 'media', 'audio');
// Primary API endpoint for audio generation
const OPENAI_API_URL = 'https://api.openai.com/v1/audio/speech';
// Fallback API endpoint
const ZERO2LAUNCH_API_URL = 'https://api.zero2launch.com/generate-audio/generate';

// Available voice options
export const VOICE_OPTIONS = [
  'alloy',    // Neutral, balanced voice
  'echo',     // Lower pitch, clear voice
  'fable',    // Expressive, bright voice
  'onyx',     // Deep, authoritative voice
  'nova',     // Warm, pleasant voice
  'shimmer'   // Crisp, higher-pitched voice
];

// Check if we're running in Vercel environment
const isVercelEnvironment = process.env.VERCEL === '1';

// Ensure TMP_DIR exists (this should be writable in Vercel)
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

// Only try to create PUBLIC_AUDIO_DIR if we're not in Vercel (it's read-only in Vercel)
if (!isVercelEnvironment) {
  if (!fs.existsSync(PUBLIC_AUDIO_DIR)) {
    fs.mkdirSync(PUBLIC_AUDIO_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { text, voice = 'alloy' } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Narration text is required' },
        { status: 400 }
      );
    }

    // Validate voice selection
    const selectedVoice = VOICE_OPTIONS.includes(voice) ? voice : 'alloy';

    console.log(`Generating audio for text: "${text}" with voice: ${selectedVoice}`);

    let buffer;

    try {
      // Try OpenAI API first for more reliable audio generation
      console.log('Calling OpenAI API for audio generation');

      try {
        // First attempt with OpenAI API
        const openaiResponse = await axios.post(
          OPENAI_API_URL,
          {
            model: "tts-1",
            voice: selectedVoice,
            input: text
          },
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',
          }
        );

        // Get audio data from response
        buffer = Buffer.from(openaiResponse.data);
        console.log('Successfully generated audio from OpenAI API');

      } catch (openaiError: any) {
        // If OpenAI fails, try Zero2Launch as fallback
        console.warn('OpenAI API error:', openaiError.message);
        console.log('Falling back to Zero2Launch API...');

        const response = await axios.post(
          ZERO2LAUNCH_API_URL,
          {
            text: text,
            voice: selectedVoice
          },
          {
            headers: {
              'X-API-Key': API_KEY,
              'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',
          }
        );

        // Get audio data from response
        buffer = Buffer.from(response.data);
        console.log('Successfully generated audio from Zero2Launch API');
      }

    } catch (apiError: any) {
      // Both APIs failed, use local fallback
      console.error('All audio generation APIs failed:', apiError.message);
      console.log('Using local fallback audio generation');

      // This is a minimal valid MP3 file (silent)
      buffer = Buffer.from([
        0xFF, 0xFB, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ]);
    }

    try {
      // Generate a unique filename for the audio
      const audioFilename = `audio-${uuidv4()}.mp3`;
      const audioPath = path.join(TMP_DIR, audioFilename);

      // Ensure the temporary directory exists
      if (!fs.existsSync(path.dirname(audioPath))) {
        fs.mkdirSync(path.dirname(audioPath), { recursive: true });
      }

      // Write to the temporary directory (this should work in Vercel)
      fs.writeFileSync(audioPath, buffer);
      console.log(`Audio saved to temporary path: ${audioPath}`);

      // In non-Vercel environments, also save to public directory
      let publicAudioPath = '';
      if (!isVercelEnvironment) {
        publicAudioPath = path.join(PUBLIC_AUDIO_DIR, audioFilename);

        if (!fs.existsSync(path.dirname(publicAudioPath))) {
          fs.mkdirSync(path.dirname(publicAudioPath), { recursive: true });
        }

        fs.writeFileSync(publicAudioPath, buffer);
        console.log(`Audio also saved to public path: ${publicAudioPath}`);
      }

      // For Vercel, we'll use the API route to serve the file from the temporary directory
      // For local development, we can use the public directory
      const audioUrl = isVercelEnvironment
        ? `/api/audio/${audioFilename}`
        : `/media/audio/${audioFilename}`;

      return NextResponse.json({
        success: true,
        audioPath,
        audioUrl,
        publicPath: publicAudioPath,
        isVercelEnvironment
      });
    } catch (saveError: any) {
      console.error('Error saving audio:', saveError);

      // Return a placeholder or error
      return NextResponse.json({
        success: false,
        error: 'Failed to save audio file',
        details: saveError.message || 'Unknown error'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error generating audio:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate audio',
        details: error.message
      },
      { status: 500 }
    );
  }
}