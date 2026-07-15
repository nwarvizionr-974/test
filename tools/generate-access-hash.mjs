import { createHash } from 'node:crypto';

const code = process.argv[2];
if (!code) {
  console.error('Usage : node tools/generate-access-hash.mjs "VotreCode"');
  process.exit(1);
}

console.log(createHash('sha256').update(code, 'utf8').digest('hex'));
