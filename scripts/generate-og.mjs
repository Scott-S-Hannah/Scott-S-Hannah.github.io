// Stub OG image generator — creates a minimal 1200x630 placeholder og.jpg.
// Replace with a real canvas/SVG renderer in a later task.
import { writeFileSync, existsSync } from 'node:fs';

const OUT = 'public/og.jpg';

// If og.jpg already exists, skip generation so we don't overwrite a real image.
if (existsSync(OUT)) {
  console.log(`og.jpg already exists — skipping generation.`);
  process.exit(0);
}

try {
  const sharp = (await import('sharp')).default;
  const width = 1200;
  const height = 630;
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" fill="#f5f0e8"/>
      <text x="80" y="340" font-family="serif" font-size="64" font-weight="bold" fill="#1a1410">Dr Scott Hannah</text>
      <text x="80" y="420" font-family="serif" font-size="36" fill="#4a4540">Exercise Physiologist</text>
    </svg>`,
  );
  await sharp(svg).jpeg({ quality: 90 }).toFile(OUT);
  console.log(`Generated ${OUT}`);
} catch (err) {
  // If sharp is unavailable, write a tiny 1x1 white JPEG so the build
  // can continue without error.
  console.warn(`sharp failed (${err.message}); writing minimal placeholder.`);
  // Minimal valid JPEG (1x1 white pixel, base64 encoded)
  const tinyJpeg = Buffer.from(
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U' +
    'HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAABAAEDASIA' +
    'AhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAU' +
    'AQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A' +
    'JQAB/9k=',
    'base64',
  );
  writeFileSync(OUT, tinyJpeg);
  console.log(`Wrote placeholder ${OUT}`);
}
