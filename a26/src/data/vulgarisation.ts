// Contenu de la page « Vulgarisation » (bonus du cours), séparé de la mise en page.
// Une valeur `null` s'affiche « à confirmer » : remplacez-la par la valeur définitive.

export const infos = {
  bonus: null as string | null, // ex. "Jusqu'à 3 % de la note finale"
  equipe: null as string | null, // ex. "Seul ou en équipe de 2"
  dateSujet: null as string | null, // ex. "30 octobre 2026"
  dateRemise: null as string | null, // ex. "4 décembre 2026"
  modalites: null as string | null, // ex. "Par courriel à l'équipe enseignante"
  diffusion: null as string | null, // ex. "Avec votre accord, les meilleures productions pourront être publiées sur ce site."
  ia: null as string | null, // ex. "Permise, à condition de déclarer comment elle a été utilisée."
};

export const formats = [
  {
    titre: "Capsule",
    duree: "8 à 10 minutes",
    texte:
      "S'attaquer à une notion floue du génie logiciel, souvent employée mais rarement définie, et la rendre claire pour des étudiants du baccalauréat.",
    attendus: [
      "partir d'une confusion ou d'une idée reçue fréquente sur la notion",
      "en proposer une définition utilisable, à la portée d'un étudiant du baccalauréat",
      "l'illustrer par un exemple et un contre-exemple concrets",
      "montrer ce qu'elle change dans un projet réel",
      "un support au choix (vidéo, animation, tableau blanc filmé…) et les sources citées à la fin",
    ],
  },
  {
    titre: "Critique d'un système existant",
    duree: null as string | null, // forme et longueur à confirmer
    texte:
      "Analyser un logiciel ou un service réel sous l'angle du génie logiciel : ce qu'il cherche à accomplir, les choix qu'il laisse voir, ses forces et ses faiblesses.",
    attendus: [
      "les intentions et les exigences que le système semble servir",
      "les choix de conception visibles, et ce qu'ils révèlent",
      "des forces et des faiblesses appuyées sur des observations",
      "des améliorations proposées, et leur coût probable",
    ],
  },
];

export const etapes = [
  { titre: "Proposer un sujet", texte: "Titre, format, public visé, angle choisi et premières sources." },
  { titre: "Attendre la validation", texte: "Le sujet peut être accepté, précisé ou refusé ; un sujet trop large est souvent recentré." },
  { titre: "Produire", texte: "Réaliser la capsule ou la critique, en gardant le public visé en tête." },
  { titre: "Remettre", texte: "Déposer la production avec ses sources et, le cas échéant, la déclaration d'usage de l'IA." },
];

export const criteres = [
  { titre: "Exactitude", texte: "Les notions sont justes ; les simplifications ne deviennent pas des erreurs." },
  { titre: "Clarté pour le public visé", texte: "Le vocabulaire, le rythme et les exemples conviennent au public annoncé." },
  { titre: "Lien avec le génie logiciel", texte: "Le sujet est traité avec les notions du cours, pas seulement décrit." },
  { titre: "Esprit critique et nuance", texte: "Les affirmations sont appuyées, et leurs limites reconnues." },
  { titre: "Qualité de la réalisation", texte: "Son, image ou texte soignés ; une structure facile à suivre." },
  { titre: "Sources", texte: "Les idées et les médias empruntés sont cités." },
];

export const sujets = {
  capsule: [
    "Couplage, cohésion et leurs conséquences",
    "Qu'est-ce que la qualité d'un logiciel ?",
    "Les biais dans l'analyse et la conception",
    "La dette technique",
    "Pourquoi tant de projets logiciels dépassent leurs délais",
    "À quoi sert un test ?",
    "L'UML est-il encore utile ?",
  ],
  critique: ["Un portail étudiant", "Une application de transport en commun", "Un outil de prise de rendez-vous en ligne"],
};

export const regles = [
  "La production est originale ; les idées, images, extraits et musiques empruntés sont cités et utilisés dans le respect de leurs droits.",
  "Les personnes filmées ou enregistrées ont donné leur accord.",
  "Une critique porte sur un système, pas sur les personnes qui l'ont conçu.",
];
