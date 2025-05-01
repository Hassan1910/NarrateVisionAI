const fs = require('fs');

// Read the JSON file
const videoContent = JSON.parse(fs.readFileSync('./consistency-video-content.json', 'utf8'));

// Extract the narration text (all voiceovers combined)
const fullNarration = videoContent.scenes
  .map(scene => scene.voiceover)
  .join(' ');

// Extract visual descriptions for each scene
const visualDescriptions = videoContent.scenes.map(scene => scene.visual_description);

// Extract on-screen text for each scene
const onScreenText = videoContent.scenes.map(scene => scene.on_screen_text);

// Add the closing quote if it exists
if (videoContent.closing_quote) {
  const quoteText = `${videoContent.closing_quote.text} - ${videoContent.closing_quote.author}`;
  onScreenText[onScreenText.length - 1] += ` ${quoteText}`;
}

// Output the results
console.log('=== FULL NARRATION ===');
console.log(fullNarration);
console.log('\n=== VISUAL DESCRIPTIONS (for image generation) ===');
visualDescriptions.forEach((desc, i) => {
  console.log(`Scene ${i + 1}: ${desc}`);
});
console.log('\n=== ON-SCREEN TEXT ===');
onScreenText.forEach((text, i) => {
  console.log(`Scene ${i + 1}: ${text}`);
});

// Create a combined prompt for each scene (for better image generation)
console.log('\n=== COMBINED PROMPTS FOR IMAGE GENERATION ===');
videoContent.scenes.forEach((scene, i) => {
  const prompt = `${scene.visual_description} The mood is motivational and inspiring.`;
  console.log(`Scene ${i + 1}: ${prompt}`);
});
