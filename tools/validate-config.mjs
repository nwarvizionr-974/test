import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'config', 'invitation.config.js');
const source = fs.readFileSync(configPath, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: configPath });
const c = sandbox.window.INVITATION_CONFIG;
const errors = [];
const warnings = [];

const required = [
  ['event.id', c?.event?.id],
  ['event.date', c?.event?.date],
  ['event.endDate', c?.event?.endDate],
  ['couple.firstName1', c?.couple?.firstName1],
  ['couple.firstName2', c?.couple?.firstName2],
  ['hero.image', c?.hero?.image]
];
required.forEach(([name, value]) => { if (!value) errors.push(`${name} est obligatoire.`); });

for (const [name, value] of [['event.date', c?.event?.date], ['event.endDate', c?.event?.endDate], ['event.rsvpDeadline', c?.event?.rsvpDeadline]]) {
  if (value && Number.isNaN(new Date(value).getTime())) errors.push(`${name} n'est pas une date ISO valide.`);
}

if (c?.event?.date && c?.event?.endDate && new Date(c.event.endDate) <= new Date(c.event.date)) {
  errors.push('event.endDate doit être postérieure à event.date.');
}
if (c?.event?.rsvpDeadline && c?.event?.date && new Date(c.event.rsvpDeadline) >= new Date(c.event.date)) {
  warnings.push('La date limite RSVP est postérieure ou égale au mariage.');
}
if (c?.rsvp?.enabled && !c?.rsvp?.endpoint) warnings.push('Le RSVP est en mode démonstration : aucune URL Apps Script n’est configurée.');
if (c?.music?.enabled && !exists(c.music.src)) errors.push(`Fichier audio introuvable : ${c.music.src}`);

const imagePaths = [c?.hero?.image, c?.dressCode?.image, ...(c?.gallery?.images || []).map((i) => i.src)].filter(Boolean);
imagePaths.forEach((file) => { if (!exists(file)) errors.push(`Image introuvable : ${file}`); });

if (c?.privacy?.accessCodeEnabled && !/^[a-f0-9]{64}$/i.test(c?.privacy?.accessCodeHash || '')) {
  errors.push('privacy.accessCodeHash doit contenir une empreinte SHA-256 de 64 caractères.');
}

console.log('\nValidation de l’invitation\n');
warnings.forEach((item) => console.warn(`⚠ ${item}`));
errors.forEach((item) => console.error(`✖ ${item}`));
if (!errors.length) console.log('✓ Configuration valide.');
process.exitCode = errors.length ? 1 : 0;

function exists(relativePath) {
  if (/^https?:\/\//i.test(relativePath)) return true;
  return fs.existsSync(path.join(root, relativePath));
}
