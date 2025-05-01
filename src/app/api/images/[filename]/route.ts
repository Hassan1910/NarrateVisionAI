import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TMP_DIR = process.env.VIDEO_OUTPUT_DIR || '/tmp/videos';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  // Use params in a way that doesn't trigger the warning
  const { filename } = params;

  // Security check to prevent directory traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  const filePath = path.join(TMP_DIR, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);

    // Return a placeholder SVG instead of a 404 error
    const placeholderPath = path.join(process.cwd(), 'public', 'placeholder.svg');

    if (fs.existsSync(placeholderPath)) {
      const placeholderBuffer = fs.readFileSync(placeholderPath);
      return new NextResponse(placeholderBuffer, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Length': placeholderBuffer.length.toString(),
          'Cache-Control': 'public, max-age=300',
        },
      });
    }

    return new NextResponse('File not found', { status: 404 });
  }

  try {
    // Read file and return as response
    const fileBuffer = fs.readFileSync(filePath);

    // Verify the buffer is not empty
    if (fileBuffer.length === 0) {
      throw new Error('Empty file');
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': getContentType(filename),
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);

    // Return a placeholder SVG instead of an error
    const placeholderPath = path.join(process.cwd(), 'public', 'placeholder.svg');

    if (fs.existsSync(placeholderPath)) {
      const placeholderBuffer = fs.readFileSync(placeholderPath);
      return new NextResponse(placeholderBuffer, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Length': placeholderBuffer.length.toString(),
          'Cache-Control': 'public, max-age=300',
        },
      });
    }

    return new NextResponse('Error reading file', { status: 500 });
  }

// Helper function to determine content type
function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();

  if (ext === '.jpg' || ext === '.jpeg') {
    return 'image/jpeg';
  } else if (ext === '.png') {
    return 'image/png';
  } else if (ext === '.svg') {
    return 'image/svg+xml';
  } else if (ext === '.mp3') {
    return 'audio/mpeg';
  } else if (ext === '.mp4') {
    return 'video/mp4';
  } else if (ext === '.webp') {
    return 'image/webp';
  } else if (ext === '.gif') {
    return 'image/gif';
  }

  return 'application/octet-stream';
}
}
