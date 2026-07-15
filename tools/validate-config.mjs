import fs from 'node:fs';
import vm from 'node:vm';

const path = new URL('../config/invitation.config.js', import.meta.url);
const source = fs.readFileSync(path, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: 'invitation.config.js' });

const config = sandbox.window.INVITATION_CONFIG;
const errors = [];
const warnings = [];

if (!config || typeof config !== 'object') errors.push('window.INVITATION_CONFIG est absent.');
if (!config?.event?.id) errors.push('event.id est requis.');
if (!Number.isFinite(new Date(config?.event?.date).getTime())) errors.push('event.date est invalide.');
if (!config?.couple?.firstName1 || !config?.couple?.firstName2) errors.push('Les deux prénoms sont requis.');
if (!config?.hero?.image) errors.push('hero.image est requis.');

const privacy = config?.privacy || {};
if (privacy.accessCodeEnabled === true) {
  const hash = String(privacy.accessCodeHash || '').trim();
  if (!/^[a-f0-9]{64}$/i.test(hash)) {
    errors.push('Le code d’accès est activé, mais accessCodeHash n’est pas une empreinte SHA-256 valide de 64 caractères.');
  }
} else if (privacy.accessCodeHash) {
  warnings.push('accessCodeHash est renseigné alors que le code est désactivé. Il est préférable de laisser une chaîne vide.');
}

for (const image of config?.gallery?.images || []) {
  if (!image.src) errors.push('Une image de galerie ne possède pas de chemin src.');
  if (!image.alt) warnings.push(`Texte alternatif manquant pour ${image.src || 'une image de galerie'}.`);
}

if (errors.length) {
  console.error('\nConfiguration invalide :');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Configuration valide.');
warnings.forEach((warning) => console.warn(`Avertissement : ${warning}`));
