/**
 * BACKEND RSVP — GOOGLE APPS SCRIPT
 * Collez ce fichier dans Extensions > Apps Script depuis votre Google Sheet.
 */

const CONFIG = {
  SHEET_NAME: 'RSVP',
  EVENT_ID: 'demo-camille-alexandre-2027',
  NOTIFICATION_EMAIL: '',
  ALLOWED_ORIGIN_LABEL: 'Invitation digitale'
};

const HEADERS = [
  'Horodatage serveur',
  'Identifiant événement',
  'Nom et prénom',
  'Présence',
  'Nombre de personnes',
  'Contact',
  'Choix du repas',
  'Allergies / régime',
  'Message',
  'Consentement',
  'Horodatage navigateur',
  'Page',
  'Navigateur'
];

function doGet() {
  return jsonResponse({ ok: true, service: CONFIG.ALLOWED_ORIGIN_LABEL });
}

function doPost(e) {
  try {
    const payload = parsePayload(e);
    validatePayload(payload);
    const sheet = getOrCreateSheet();

    sheet.appendRow([
      new Date(),
      sanitize(payload.eventId),
      sanitize(payload.guestName),
      payload.attendance === 'yes' ? 'Présent' : 'Absent',
      sanitize(payload.guestCount),
      sanitize(payload.contact),
      sanitize(payload.mealChoice),
      sanitize(payload.dietary),
      sanitize(payload.message),
      payload.consent === 'on' ? 'Oui' : 'Non',
      sanitize(payload.submittedAt),
      sanitize(payload.pageUrl),
      sanitize(payload.userAgent)
    ]);

    if (CONFIG.NOTIFICATION_EMAIL) sendNotification(payload);
    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: error.message });
  }
}

function parsePayload(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error('Requête vide.');
  return JSON.parse(e.postData.contents);
}

function validatePayload(payload) {
  if (payload.website) throw new Error('Spam détecté.');
  if (payload.eventId !== CONFIG.EVENT_ID) throw new Error('Événement inconnu.');
  if (!payload.guestName || String(payload.guestName).trim().length < 2) throw new Error('Nom manquant.');
  if (!['yes', 'no'].includes(payload.attendance)) throw new Error('Présence invalide.');
  if (payload.consent !== 'on') throw new Error('Consentement manquant.');
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.autoResizeColumns(1, HEADERS.length);
  }
  return sheet;
}

function sendNotification(payload) {
  const presence = payload.attendance === 'yes' ? 'présent(e)' : 'absent(e)';
  const subject = `Nouveau RSVP — ${payload.guestName}`;
  const body = [
    `${payload.guestName} sera ${presence}.`,
    `Nombre de personnes : ${payload.guestCount || '-'}`,
    `Contact : ${payload.contact || '-'}`,
    `Repas : ${payload.mealChoice || '-'}`,
    `Allergies / régime : ${payload.dietary || '-'}`,
    `Message : ${payload.message || '-'}`
  ].join('\n');
  MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
}

function sanitize(value) {
  const text = String(value || '').trim().slice(0, 2000);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
