# Gestion du cache

L’ancienne version utilisait un service worker qui pouvait afficher une configuration obsolète lorsque le réseau intégré à Messenger échouait momentanément.

La version corrigée applique quatre protections :

1. suppression automatique des anciennes inscriptions de service worker pour le dossier du site ;
2. suppression des caches dont le nom commence par `invitation-digitale` ;
3. chargement de la configuration, du JavaScript et du CSS avec un identifiant unique à chaque ouverture ;
4. service worker `sw.js` de désinstallation, conservé uniquement pour neutraliser une installation ancienne.

Il n’est plus nécessaire d’ajouter manuellement `?v=2`, `?v=3`, etc. à l’adresse du site.

## Page de secours

En cas de navigateur particulièrement persistant, ouvrez une fois :

```text
https://votre-adresse.github.io/votre-depot/reset-cache.html
```

La page supprime les anciens caches, désinscrit le service worker puis revient automatiquement à l’invitation.
