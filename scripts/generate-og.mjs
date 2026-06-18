import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

mkdirSync('public', { recursive: true });

await sharp('src/assets/portrait.jpg')
  .resize(1200, 630, { fit: 'cover', position: 'top' })
  .jpeg({ quality: 82 })
  .toFile('public/og.jpg');

console.log('Wrote public/og.jpg');
