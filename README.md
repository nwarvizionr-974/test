# Invitation digitale de mariage — One page

Modèle complet, responsive et réutilisable pour créer des invitations de mariage sous forme de site one page hébergé sur GitHub Pages.

## Fonctionnalités

- couverture immersive et animations au défilement ;
- configuration centralisée par client ;
- compte à rebours ;
- ajout au calendrier au format ICS ;
- lieux avec itinéraires ;
- programme chronologique ;
- dress code et palette ;
- galerie avec visionneuse ;
- musique facultative ;
- formulaire RSVP ;
- connexion Google Sheets via Apps Script ;
- code d’accès dissuasif facultatif ;
- mode hors ligne léger ;
- déploiement automatique GitHub Pages.

## Démarrage rapide

1. Ouvrez `config/invitation.config.js` et remplacez les données de démonstration.
2. Remplacez les images dans `assets/images/`.
3. Lancez `node tools/validate-config.mjs`.
4. Testez localement avec un petit serveur HTTP.
5. Configurez le RSVP avec `docs/RSVP-GOOGLE-SHEETS.md`.
6. Publiez avec `docs/MISE-EN-LIGNE-GITHUB.md`.

### Tester localement

Depuis le dossier du projet :

```bash
python -m http.server 8080
```

Puis ouvrez `http://localhost:8080`.

## Documentation

- [Configuration client](docs/CONFIGURATION-CLIENT.md)
- [RSVP Google Sheets](docs/RSVP-GOOGLE-SHEETS.md)
- [Mise en ligne GitHub](docs/MISE-EN-LIGNE-GITHUB.md)
- [Code d’accès](docs/GENERER-CODE-ACCES.md)
- [Checklist de livraison](docs/CHECKLIST-LIVRAISON.md)
- [Modèle d’information RSVP](docs/MENTIONS-RGPD-MODELE.md)

## Structure

```text
assets/                  styles, scripts, images et audio
backend/google-apps-script/  backend RSVP à coller dans Apps Script
config/                  fichier à modifier pour chaque client
docs/                    guides opérationnels
.github/workflows/       déploiement automatique GitHub Pages
index.html               structure du site
sw.js                    cache hors ligne
```

## Confidentialité

GitHub Pages publie un site statique accessible sur Internet. Ne placez jamais dans ce dépôt une liste privée d’invités, des informations médicales détaillées, des mots de passe ou des secrets d’API. Le code d’accès inclus est une barrière de confort, pas une authentification forte.

## Licence

Le code est fourni sous licence MIT. Les photos, polices, musiques et contenus ajoutés par chaque client restent soumis à leurs propres droits.
