/**
 * FICHIER PRINCIPAL À MODIFIER POUR CHAQUE CLIENT
 * ------------------------------------------------
 * Le site est généré automatiquement depuis cet objet.
 * Conserver la structure et modifier uniquement les valeurs.
 */
window.INVITATION_CONFIG = {
  event: {
    id: "demo-camille-alexandre-2027",
    language: "fr-FR",
    timezone: "Indian/Reunion",
    date: "2027-11-27T14:30:00+04:00",
    endDate: "2027-11-28T02:00:00+04:00",
    rsvpDeadline: "2027-10-20T23:59:00+04:00"
  },

  couple: {
    firstName1: "Camille",
    firstName2: "Alexandre",
    monogram: "C&A"
  },

  sections: {
    announcement: true,
    countdown: true,
    locations: true,
    schedule: true,
    dressCode: true,
    gallery: true,
    quote: true,
    rsvp: true
  },

  seo: {
    title: "Camille & Alexandre — Notre mariage",
    description: "Nous avons la joie de vous inviter à célébrer notre mariage.",
    shareImage: "assets/images/cover-placeholder.svg",
    indexable: false
  },

  theme: {
    colors: {
      background: "#f7f3ee",
      surface: "#fffdf9",
      text: "#24302b",
      muted: "#6d756f",
      accent: "#8e9b8d",
      accentSoft: "#d9ded6",
      dark: "#24302b",
      light: "#ffffff"
    },
    fonts: {
      display: "'Italiana', serif",
      serif: "'Cormorant Garamond', serif",
      body: "'Inter', sans-serif",
      googleFontsUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&family=Italiana&display=swap"
    }
  },

  hero: {
    kicker: "Nous nous marions",
    intro: "Nous avons le plaisir de vous inviter à célébrer cette journée qui nous est si chère.",
    image: "assets/images/cover-placeholder.svg",
    imageAlt: "Photo de Camille et Alexandre"
  },

  announcement: {
    kicker: "Une nouvelle page s’écrit",
    title: "Entourés de ceux que nous aimons",
    text: "Nous serions heureux de vous compter parmi nous pour partager l’émotion de notre cérémonie, les rires du cocktail et la magie de la soirée."
  },

  locationsIntro: "Deux rendez-vous, une seule et belle histoire.",
  locations: [
    {
      icon: "rings",
      label: "Cérémonie",
      title: "Mairie de Saint-Pierre",
      dateLabel: "Samedi 27 novembre 2027 · 14 h 30",
      address: "Rue Méziaire Guignard, 97410 Saint-Pierre",
      note: "Merci d’arriver 20 minutes avant le début de la cérémonie.",
      mapUrl: "https://maps.google.com/?q=Mairie+de+Saint-Pierre+La+Reunion"
    },
    {
      icon: "glass",
      label: "Réception",
      title: "Le Jardin des Songes",
      dateLabel: "À partir de 17 h 00",
      address: "Adresse à personnaliser, La Réunion",
      note: "Cocktail, dîner et soirée dansante sur place.",
      mapUrl: "https://maps.google.com/"
    }
  ],

  scheduleIntro: "Voici les temps forts imaginés pour vivre pleinement la journée.",
  schedule: [
    { time: "14:00", title: "Accueil des invités", text: "Retrouvons-nous devant la mairie." },
    { time: "14:30", title: "Cérémonie civile", text: "Le moment où nous dirons oui." },
    { time: "16:00", title: "Photos & trajet", text: "Quelques souvenirs avant de rejoindre la réception." },
    { time: "17:00", title: "Cocktail", text: "Bulles, gourmandises et retrouvailles." },
    { time: "19:30", title: "Dîner", text: "À table pour poursuivre la fête." },
    { time: "22:00", title: "Ouverture du bal", text: "La piste n’attendra plus que vous." }
  ],

  dressCode: {
    text: "Élégance naturelle et tons doux. Nous vous invitons à privilégier une tenue chic dans la palette ci-dessous.",
    note: "Le blanc et l’ivoire sont réservés aux mariés.",
    image: "assets/images/dress-placeholder.svg",
    imageAlt: "Inspiration de tenue élégante",
    palette: ["#253a52", "#526c8d", "#8ca2bd", "#c9d3de", "#e8e0d4"]
  },

  gallery: {
    title: "Quelques instants à deux",
    intro: "Une petite sélection de souvenirs avant d’en créer de nouveaux avec vous.",
    images: [
      { src: "assets/images/gallery-1.svg", alt: "Souvenir du couple au bord de l’océan", caption: "Notre première escapade" },
      { src: "assets/images/gallery-2.svg", alt: "Portrait du couple", caption: "Un dimanche ordinaire, ou presque" },
      { src: "assets/images/gallery-3.svg", alt: "Le couple au coucher du soleil", caption: "Là où tout semble possible" },
      { src: "assets/images/gallery-4.svg", alt: "Détail de mains enlacées", caption: "Main dans la main" }
    ]
  },

  quote: {
    text: "Il n’y a qu’un bonheur dans la vie : aimer et être aimé.",
    author: "George Sand"
  },

  rsvp: {
    enabled: true,
    title: "Serez-vous des nôtres ?",
    intro: "Merci de nous répondre afin que nous puissions préparer chaque détail avec attention.",
    maxGuests: 5,
    mealChoices: ["Menu classique", "Menu végétarien", "Menu enfant"],
    collectMealChoice: true,
    endpoint: "",
    mode: "google-apps-script",
    successMessage: "Merci, votre réponse a bien été prise en compte.",
    demoMessage: "Mode démonstration : la réponse a été enregistrée uniquement sur cet appareil. Configurez l’URL Apps Script pour recevoir les RSVP.",
    consentText: "J’accepte que ces informations soient utilisées uniquement pour l’organisation du mariage.",
    privacyContact: "contact@votre-domaine.fr"
  },

  music: {
    enabled: false,
    src: "assets/audio/votre-musique.mp3",
    label: "Notre chanson"
  },

  privacy: {
    accessCodeEnabled: false,
    /** Générer l’empreinte avec docs/GENERER-CODE-ACCES.md */
    accessCodeHash: ""
  },

  footer: {
    text: "Nous avons hâte de célébrer avec vous.",
    credit: "Invitation digitale réalisée avec soin"
  }
};
