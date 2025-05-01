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
    return new NextResponse('File not found', { status: 404 });
  }

  // Read file and return as response
  const fileBuffer = fs.readFileSync(filePath);

  // Determine content type based on file extension
  const ext = path.extname(filename).toLowerCase();
  let contentType = 'application/octet-stream';

  if (ext === '.jpg' || ext === '.jpeg') {
    contentType = 'image/jpeg';
  } else if (ext === '.png') {
    contentType = 'image/png';
  } else if (ext === '.mp3') {
    contentType = 'audio/mpeg';
  } else if (ext === '.mp4') {
    contentType = 'video/mp4';
  }

  // Return file with appropriate headers
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'public, max-age=300',
    },
  });
}
