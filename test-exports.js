// Simple script to test exports
const fs = require('fs');
const path = require('path');

// Read the ffmpeg.ts file
const ffmpegPath = path.join(__dirname, 'src', 'utils', 'ffmpeg.ts');
const ffmpegContent = fs.readFileSync(ffmpegPath, 'utf8');

// Check for export statements
const exportStatements = ffmpegContent.match(/export\s+(const|function|interface|type|class)\s+(\w+)/g) || [];

console.log('Found exports in ffmpeg.ts:');
exportStatements.forEach(exp => {
  console.log(`- ${exp}`);
});

// Read the sequence-ffmpeg.ts file
const sequencePath = path.join(__dirname, 'src', 'utils', 'sequence-ffmpeg.ts');
const sequenceContent = fs.readFileSync(sequencePath, 'utf8');

// Check for import statements
const importStatements = sequenceContent.match(/import\s+.*\s+from\s+['"]\.\/ffmpeg['"]/g) || [];

console.log('\nFound imports in sequence-ffmpeg.ts:');
importStatements.forEach(imp => {
  console.log(`- ${imp}`);
});

console.log('\nTest completed.');
