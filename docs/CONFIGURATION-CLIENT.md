# Configuration d'une invitation client

Toute la personnalisation courante se fait dans `config/invitation.config.js`.

## 1. Dupliquer le dépôt

Créez un dépôt par mariage afin d’isoler les photos, le domaine et les réponses RSVP.

## 2. Modifier les informations

Les blocs principaux sont :

- `event` : date, heure, fuseau et date limite RSVP ;
- `couple` : prénoms et monogramme ;
- `theme` : couleurs et typographies ;
- `hero`, `announcement`, `locations`, `schedule` : contenu éditorial ;
- `dressCode` : consignes et palette ;
- `gallery` : photos et légendes ;
- `rsvp` : paramètres du formulaire ;
- `music` : activation et fichier audio ;
- `privacy` : code d’accès dissuasif ;
- `footer` : phrase finale et crédit.

## 3. Remplacer les images

Déposez les fichiers dans `assets/images/`, puis modifiez les chemins dans la configuration. Utilisez de préférence WebP ou AVIF. Les noms de fichiers ne doivent pas comporter d’espace ni d’accent.

## 4. Vérifier les liens

Testez chaque bouton d’itinéraire, la date du calendrier et le formulaire RSVP sur téléphone.

## 5. Activer la musique

Ajoutez un fichier audio libre de droits ou fourni avec les autorisations nécessaires dans `assets/audio/`, puis définissez :

```js
music: {
  enabled: true,
  src: "assets/audio/notre-musique.mp3",
  label: "Notre chanson"
}
```

La musique ne démarre pas automatiquement : les navigateurs imposent une action de l’utilisateur.
