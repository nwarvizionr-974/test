# Code d’accès

## Désactivation

La configuration suivante ouvre toujours l’invitation directement :

```javascript
privacy: {
  accessCodeEnabled: false,
  accessCodeHash: ""
}
```

## Activation

Générez l’empreinte du code :

```bash
node tools/generate-access-hash.mjs "VotreCode"
```

Copiez le résultat :

```javascript
privacy: {
  accessCodeEnabled: true,
  accessCodeHash: "...64 caractères hexadécimaux..."
}
```

Le site est volontairement configuré en mode sécurisé contre les erreurs :

- `false`, `"false"`, `0` ou une valeur absente n’activent jamais l’écran ;
- un hash vide ou invalide n’active jamais l’écran ;
- écrire le code en clair, par exemple `"1234"`, n’active jamais l’écran.
