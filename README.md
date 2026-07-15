# Invitation digitale de mariage — version corrigée

Modèle statique, responsive et réutilisable pour GitHub Pages.

## Correctif du problème de code d’accès

Cette version supprime la cause du comportement récurrent observé dans Messenger : l’ancien service worker conservait parfois une ancienne configuration.

Désormais :

- aucun service worker n’est enregistré ;
- les anciens caches `invitation-digitale-*` sont supprimés automatiquement ;
- les fichiers `config/invitation.config.js`, `assets/js/app.js` et `assets/css/styles.css` sont chargés avec une adresse unique à chaque ouverture ;
- le code d’accès ne peut s’activer qu’avec `accessCodeEnabled: true` **et** une empreinte SHA-256 valide de 64 caractères ;
- une valeur incorrecte comme `"1234"` dans `accessCodeHash` ne bloque plus le site.

## Démarrage rapide

1. Modifiez `config/invitation.config.js`.
2. Remplacez les images dans `assets/images/`.
3. Vérifiez la configuration avec :

```bash
node tools/validate-config.mjs
```

4. Testez localement :

```bash
python -m http.server 8080
```

5. Déposez tout le contenu du dossier à la racine du dépôt GitHub.

## Désactiver le code d’accès

```javascript
privacy: {
  accessCodeEnabled: false,
  accessCodeHash: ""
}
```

## Activer le code d’accès

Générez d’abord une empreinte :

```bash
node tools/generate-access-hash.mjs "VotreCode"
```

Puis utilisez :

```javascript
privacy: {
  accessCodeEnabled: true,
  accessCodeHash: "empreinte_sha256_de_64_caracteres"
}
```

## Confidentialité

GitHub Pages publie un site statique accessible sur Internet. Le code d’accès est une barrière visuelle, pas une authentification forte. Ne placez jamais de secrets, de mots de passe réutilisés ou de données sensibles dans le dépôt.
