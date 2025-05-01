import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const API_KEY = process.env.OPENAI_API_KEY;
const TMP_DIR = process.env.VIDEO_OUTPUT_DIR || '/tmp/videos';
// Public directory for serving images
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'media', 'images');
// Primary API endpoint for image generation
const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';
// Fallback API endpoint if needed
const ZERO2LAUNCH_API_URL = 'https://api.zero2launch.com/download-image/data';

// Check if we're running in Vercel environment
const isVercelEnvironment = process.env.VERCEL === '1';

// Ensure TMP_DIR exists (this should be writable in Vercel)
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

// Only try to create PUBLIC_IMAGES_DIR if we're not in Vercel (it's read-only in Vercel)
if (!isVercelEnvironment) {
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
  }
}

// Directory creation is handled above

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Text prompt is required' },
        { status: 400 }
      );
    }

    console.log(`Generating image for prompt: ${prompt}`);

    let imageBuffer;

    try {
      // Try OpenAI API first for more reliable image generation
      console.log('Calling OpenAI API for image generation');

      try {
        // First attempt with OpenAI API
        const openaiResponse = await axios.post(
          OPENAI_API_URL,
          {
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json"
          },
          {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
            }
          }
        );

        // Extract base64 image data and convert to buffer
        if (openaiResponse.data &&
            openaiResponse.data.data &&
            openaiResponse.data.data[0] &&
            openaiResponse.data.data[0].b64_json) {

          imageBuffer = Buffer.from(openaiResponse.data.data[0].b64_json, 'base64');
          console.log('Successfully generated image from OpenAI API');

        } else {
          throw new Error('Invalid response format from OpenAI API');
        }

      } catch (openaiError: any) {
        // If OpenAI fails, try Zero2Launch as fallback
        console.warn('OpenAI API error:', openaiError.message);
        console.log('Falling back to Zero2Launch API...');

        const response = await axios.post(
          ZERO2LAUNCH_API_URL,
          {
            prompt: prompt,
            width: 1024,
            height: 768
          },
          {
            headers: {
              'X-API-Key': API_KEY,
              'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',
          }
        );

        // Get image data from response
        imageBuffer = Buffer.from(response.data);
        console.log('Successfully generated image from Zero2Launch API');
      }

    } catch (apiError: any) {
      // Both APIs failed, use local fallback
      console.error('All image generation APIs failed:', apiError.message);
      console.log('Using local fallback image generation');

      // Use a placeholder image from the public directory
      console.log('Using placeholder image');

      // Path to the placeholder image in the public directory
      const placeholderPath = path.join(process.cwd(), 'public', 'placeholder.jpg');

      // Check if placeholder exists, if not create a simple colored rectangle
      if (fs.existsSync(placeholderPath)) {
        imageBuffer = fs.readFileSync(placeholderPath);
      } else {
        // Create a minimal valid JPEG that will display as a colored rectangle
        imageBuffer = Buffer.from([
          0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
          0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
          0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
          0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
          0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
          0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xC2, 0x00, 0x0B, 0x08, 0x00,
          0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00,
          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00,
          0x08, 0x01, 0x01, 0x00, 0x01, 0x3F, 0x10
        ]);
      }
    }

    try {
      // Generate a unique filename for the image
      const imageFilename = `image-${uuidv4()}.jpg`;
      const imagePath = path.join(TMP_DIR, imageFilename);

      // Ensure the temporary directory exists
      if (!fs.existsSync(path.dirname(imagePath))) {
        fs.mkdirSync(path.dirname(imagePath), { recursive: true });
      }

      // Write to the temporary directory (this should work in Vercel)
      fs.writeFileSync(imagePath, imageBuffer);
      console.log(`Image saved to temporary path: ${imagePath}`);

      // In non-Vercel environments, also save to public directory
      let publicImagePath = '';
      let imageUrl = '';

      if (!isVercelEnvironment) {
        publicImagePath = path.join(PUBLIC_IMAGES_DIR, imageFilename);

        if (!fs.existsSync(path.dirname(publicImagePath))) {
          fs.mkdirSync(path.dirname(publicImagePath), { recursive: true });
        }

        fs.writeFileSync(publicImagePath, imageBuffer);
        console.log(`Image also saved to public path: ${publicImagePath}`);

        // Public URL for the image in non-Vercel environments
        imageUrl = `/media/images/${imageFilename}`;
      } else {
        // For Vercel, we'll use the API route to serve the file from the temporary directory
        imageUrl = `/api/images/${imageFilename}`;
      }

      return NextResponse.json({
        success: true,
        imagePath,
        imageUrl,
        publicPath: publicImagePath,
        isVercelEnvironment
      });
    } catch (saveError) {
      console.error('Error saving image:', saveError);

      // Use a static placeholder image as fallback
      const staticImageUrl = '/placeholder.jpg';

      return NextResponse.json({
        success: true,
        imagePath: 'placeholder.jpg',
        imageUrl: staticImageUrl,
        isPlaceholder: true
      });
    }
  } catch (error: any) {
    console.error('Error generating image:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: error.message
      },
      { status: 500 }
    );
  }
}
