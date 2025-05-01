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

export async function POST(request: NextRequest) {
  try {
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

    // Parse request body
    const body = await request.json();
    const { prompts, style } = body;

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json(
        { error: 'At least one prompt is required' },
        { status: 400 }
      );
    }

    // Generate images for each prompt
    const imageResults = await Promise.all(
      prompts.map(async (prompt, index) => {
        try {
          console.log(`Generating image ${index + 1}/${prompts.length} for prompt: "${prompt}"`);

          // Try OpenAI API first
          try {
            console.log(`Generating image ${index + 1} with OpenAI API for prompt: "${prompt.substring(0, 50)}..."`);

            const openaiResponse = await axios.post(
              OPENAI_API_URL,
              {
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                response_format: "b64_json",
                style: style || "vivid"
              },
              {
                headers: {
                  'Authorization': `Bearer ${API_KEY}`,
                  'Content-Type': 'application/json',
                },
                timeout: 30000 // 30 second timeout
              }
            );

            // Extract base64 image data and convert to buffer
            if (openaiResponse.data &&
                openaiResponse.data.data &&
                openaiResponse.data.data[0] &&
                openaiResponse.data.data[0].b64_json) {

              const imageBuffer = Buffer.from(openaiResponse.data.data[0].b64_json, 'base64');

              // Verify the buffer is a valid image (check for JPEG header)
              if (imageBuffer.length < 2 || imageBuffer[0] !== 0xFF || imageBuffer[1] !== 0xD8) {
                console.warn(`Invalid JPEG data received for image ${index + 1}`);
                throw new Error('Invalid JPEG data received from API');
              }

              // Generate a unique filename for the image
              const imageFilename = `image-${uuidv4()}.jpg`;
              const imagePath = path.join(TMP_DIR, imageFilename);

              // Write to the temporary directory (this should work in Vercel)
              fs.writeFileSync(imagePath, imageBuffer);

              // Variables to store paths and URLs
              let publicImagePath = '';
              let imageUrl = '';

              if (!isVercelEnvironment) {
                // In non-Vercel environments, also save to public directory
                publicImagePath = path.join(PUBLIC_IMAGES_DIR, imageFilename);
                fs.writeFileSync(publicImagePath, imageBuffer);

                // Public URL for the image in non-Vercel environments
                imageUrl = `/media/images/${imageFilename}`;
              } else {
                // For Vercel, we'll use the API route to serve the file from the temporary directory
                imageUrl = `/api/images/${imageFilename}`;
              }

              // Verify the file was written correctly
              if (!fs.existsSync(imagePath) || fs.statSync(imagePath).size === 0) {
                throw new Error(`Failed to write image file ${imagePath}`);
              }

              console.log(`Successfully generated image ${index + 1} from OpenAI API (${imageBuffer.length} bytes)`);


              return {
                success: true,
                imagePath,
                imageUrl,
                publicPath: publicImagePath,
                prompt,
                size: imageBuffer.length
              };
            } else {
              console.warn(`Invalid response format from OpenAI API for image ${index + 1}`);
              throw new Error('Invalid response format from OpenAI API');
            }
          } catch (openaiError: any) {
            console.warn(`OpenAI API error for image ${index + 1}:`, openaiError.message);
            throw openaiError; // Re-throw to be caught by the outer catch
          }
        } catch (error: any) {
          console.error(`Error generating image ${index + 1}:`, error.message);

          // Use a placeholder image as fallback
          const placeholderPath = path.join(process.cwd(), 'public', 'placeholder.jpg');
          let imageBuffer;

          if (fs.existsSync(placeholderPath)) {
            imageBuffer = fs.readFileSync(placeholderPath);
          } else {
            // Create a minimal valid JPEG
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

          // Generate a unique filename for the placeholder image
          const imageFilename = `placeholder-${uuidv4()}.jpg`;
          const imagePath = path.join(TMP_DIR, imageFilename);

          // Write to the temporary directory (this should work in Vercel)
          fs.writeFileSync(imagePath, imageBuffer);

          // Variables to store paths and URLs
          let publicImagePath = '';
          let imageUrl = '';

          if (!isVercelEnvironment) {
            // In non-Vercel environments, also save to public directory
            publicImagePath = path.join(PUBLIC_IMAGES_DIR, imageFilename);
            fs.writeFileSync(publicImagePath, imageBuffer);

            // Public URL for the image in non-Vercel environments
            imageUrl = `/media/images/${imageFilename}`;
          } else {
            // For Vercel, we'll use the API route to serve the file from the temporary directory
            imageUrl = `/api/images/${imageFilename}`;
          }

          return {
            success: false,
            error: error.message,
            imagePath,
            imageUrl,
            publicPath: publicImagePath,
            isPlaceholder: true,
            prompt
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      images: imageResults
    });
  } catch (error: any) {
    console.error('Error in generate-multiple-images:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate images',
        details: error.message
      },
      { status: 500 }
    );
  }
}
