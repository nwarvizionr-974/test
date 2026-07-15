# Configuration client

Le fichier principal est `config/invitation.config.js`.

Modifiez les valeurs, mais conservez les noms des propriétés et les accolades.

## Principales zones

- `event` : date, fin de l’événement, date limite RSVP et fuseau horaire ;
- `couple` : prénoms et monogramme ;
- `sections` : affichage ou masquage des sections ;
- `theme` : couleurs et polices ;
- `hero`, `announcement`, `locations`, `schedule`, `dressCode`, `gallery`, `quote` : contenus ;
- `rsvp` : formulaire et adresse du Google Apps Script ;
- `music` : musique facultative ;
- `privacy` : code d’accès facultatif.

Après chaque modification, exécutez :

```bash
node tools/validate-config.mjs
```
