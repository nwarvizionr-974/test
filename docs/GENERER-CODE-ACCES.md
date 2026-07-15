# Générer un code d'accès

Le code d’accès empêche surtout l’ouverture accidentelle. Ce n’est pas une protection forte : le site reste statique et public sur GitHub Pages.

1. Choisissez un code suffisamment long.
2. Dans la console du navigateur, exécutez :

```js
crypto.subtle.digest('SHA-256', new TextEncoder().encode('VOTRE-CODE'))
  .then(buffer => console.log([...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2,'0')).join('')))
```

3. Copiez le résultat dans `privacy.accessCodeHash`.
4. Passez `privacy.accessCodeEnabled` à `true`.
