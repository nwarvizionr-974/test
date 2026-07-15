# Connecter le RSVP à Google Sheets

## Étape 1 — Créer le tableau

1. Créez un Google Sheet vide.
2. Ouvrez **Extensions > Apps Script**.
3. Remplacez le contenu par `backend/google-apps-script/Code.gs`.
4. Dans `CONFIG`, remplacez `EVENT_ID` par la valeur exacte de `event.id` dans `config/invitation.config.js`.
5. Facultatif : indiquez une adresse dans `NOTIFICATION_EMAIL` pour recevoir un e-mail à chaque réponse.

## Étape 2 — Déployer le script

1. Cliquez sur **Déployer > Nouveau déploiement**.
2. Choisissez **Application web**.
3. Exécuter en tant que : **Moi**.
4. Qui a accès : l’option permettant aux invités d’appeler le formulaire sans compte Google.
5. Autorisez le script puis copiez l’URL se terminant par `/exec`.

## Étape 3 — Relier le site

Dans `config/invitation.config.js` :

```js
rsvp: {
  endpoint: "COLLEZ_ICI_URL_APPS_SCRIPT_EXEC",
  mode: "google-apps-script"
}
```

## Étape 4 — Tester

Envoyez une réponse test depuis le site publié. Un onglet `RSVP` est automatiquement créé dans le Google Sheet.

## Limite importante

Le navigateur utilise une requête `no-cors` pour améliorer la compatibilité avec Apps Script. Il peut confirmer que l’envoi est parti, mais ne peut pas lire la réponse du serveur. Vérifiez toujours la première réponse directement dans le Google Sheet avant livraison au client.
