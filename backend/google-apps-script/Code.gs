const SPREADSHEET_ID = 'REMPLACEZ_PAR_L_IDENTIFIANT_DE_VOTRE_FEUILLE';
const SHEET_NAME = 'RSVP';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const sheet = getSheet_();
    ensureHeaders_(sheet);
    sheet.appendRow([
      new Date(),
      clean_(data.eventId),
      clean_(data.guestName),
      clean_(data.attendance),
      clean_(data.guestCount),
      clean_(data.contact),
      clean_(data.mealChoice),
      clean_(data.allergies),
      clean_(data.message),
      clean_(data.consent),
      clean_(data.submittedAt),
      clean_(data.pageUrl)
    ]);
    return json_({ ok: true });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: String(error) });
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow([
    'Reçu le', 'Événement', 'Nom', 'Présence', 'Nombre', 'Contact',
    'Repas', 'Allergies', 'Message', 'Consentement', 'Date client', 'Page'
  ]);
  sheet.setFrozenRows(1);
}

function clean_(value) {
  const text = String(value == null ? '' : value).trim();
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
