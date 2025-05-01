import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// Check if FFmpeg is installed
const isFFmpegInstalled = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const process = spawn('ffmpeg', ['-version']);

    process.on('error', () => {
      resolve(false);
    });

    process.on('close', (code) => {
      resolve(code === 0);
    });
  });
};

export async function GET(request: NextRequest) {
  try {
    // Check if we're running in Vercel production environment
    const isVercelProduction = process.env.VERCEL === '1';

    // Check if the environment variable is set to show the warning
    const showWarningEnv = process.env.SHOW_FFMPEG_WARNING === 'true';

    // Skip the check if we're in Vercel production or if the warning is disabled
    if (isVercelProduction || !showWarningEnv) {
      return NextResponse.json({
        showWarning: false,
        ffmpegInstalled: true,
        environment: isVercelProduction ? 'vercel' : 'development'
      });
    }

    // Only perform the check in development environment
    const ffmpegInstalled = await isFFmpegInstalled();

    // Return the result
    return NextResponse.json({
      showWarning: !ffmpegInstalled,
      ffmpegInstalled,
      environment: 'development'
    });

  } catch (error: any) {
    console.error('Error checking FFmpeg status:', error);

    // In case of error, don't show the warning
    return NextResponse.json({
      showWarning: false,
      error: error.message
    });
  }
}
