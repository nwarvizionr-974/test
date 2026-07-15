# Mise en ligne sur GitHub Pages

## Dépôt neuf

1. Créez un dépôt GitHub.
2. Ajoutez tous les fichiers de ce dossier à la racine du dépôt.
3. Vérifiez que la branche principale s’appelle `main`.
4. Dans **Settings > Pages**, choisissez **GitHub Actions** comme source.
5. Poussez un commit sur `main`.
6. Ouvrez l’onglet **Actions** pour suivre le déploiement.

Le workflow `.github/workflows/deploy-pages.yml` publie automatiquement le site.

## Domaine personnalisé

Configurez d’abord le domaine dans **Settings > Pages > Custom domain**, puis ajoutez les enregistrements DNS demandés par GitHub chez votre registrar. Activez ensuite **Enforce HTTPS** lorsque l’option devient disponible.

## Après chaque modification

Un simple commit sur `main` déclenche un nouveau déploiement.
