# RSVP avec Google Sheets

1. Créez une feuille Google Sheets.
2. Ouvrez `Extensions` → `Apps Script`.
3. Copiez le contenu de `backend/google-apps-script/Code.gs`.
4. Remplacez `SPREADSHEET_ID` par l’identifiant de votre feuille.
5. Déployez le script comme application Web accessible à toute personne disposant du lien.
6. Copiez l’URL du déploiement dans :

```javascript
rsvp: {
  endpoint: "URL_DU_GOOGLE_APPS_SCRIPT"
}
```

Testez une réponse avant d’envoyer l’invitation aux invités.
