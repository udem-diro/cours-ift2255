// Contenu de la page d'accueil, séparé de la mise en page pour être modifié facilement.

/** État du projet, affiché dans la bande de l'en-tête. */
export const projetEnCours = "Phase 2 du projet à venir : conception";

/**
 * Messages clés (bandeaux), à la manière des diapositives.
 * Dans les textes, **passage** met un passage clé en évidence (accent orange, avec parcimonie).
 */
export const messages = {
  questions: "Comprendre une exigence, c'est comprendre pourquoi elle doit exister.",
  thematiques: "On passe d'une demande exprimée à une compréhension structurée du travail réel.",
};

/** L'exemple de l'en-tête : de l'intention à l'exigence (présentation 02, Exigences). */
export const echelle = [
  {
    terme: "Intention",
    question: "Ce que l'on cherche à accomplir",
    texte:
      "Favoriser l'apprentissage intégral, l'autonomie, l'encadrement, la collaboration et l'essor des talents de chacun.",
  },
  {
    terme: "Demande",
    question: "Ce qui est demandé",
    texte: "Faites une application qui génère automatiquement mon horaire.",
  },
  {
    terme: "Besoin",
    question: "Ce qui manque vraiment",
    texte:
      "Construire un parcours cohérent avec ses objectifs, en comprenant les exigences de son programme, avec l'appui de ses conseillers.",
  },
  {
    terme: "Exigence",
    question: "Ce que le système doit faire, de façon vérifiable",
    texte:
      "Pour chaque cours envisagé, le système indique si les préalables sont satisfaits, manquants ou à vérifier, et explique pourquoi.",
  },
];

/** Les questions qui traversent le cours. */
export const questions = [
  {
    question: "Pourquoi cette exigence existe-t-elle ?",
    texte:
      "Une exigence stabilise une intention dans un contexte réel. **Comprendre ce qu'elle protège** permet de juger si elle est juste, et de la défendre quand les choix deviennent difficiles.",
  },
  {
    question: "Dans quelle activité le système s'inscrit-il ?",
    texte:
      "Un logiciel prend rarement place dans une action isolée : il s'insère dans une boucle de travail qui existe déjà. C'est dans cette boucle que naissent les besoins, et que le système aura un effet réel.",
  },
  {
    question: "Que montre ce modèle, et pour qui ?",
    texte:
      "Un logiciel ne se voit pas et se comprend mal d'un seul regard. Un modèle en donne une vue simplifiée, choisie pour un usage et un public précis : **aucun modèle ne montre tout**.",
  },
  {
    question: "Que faudra-t-il changer demain ?",
    texte:
      "Les besoins évoluent, les données aussi. Une conception aux modules cohésifs et faiblement couplés rend ces changements possibles sans tout reprendre.",
  },
  {
    question: "Ai-je pris assez de recul ?",
    texte:
      "Nos biais orientent nos choix **plus souvent qu'on le pense**. Relire, décomposer de nouveau un problème et questionner ses décisions font partie du travail de conception.",
  },
];

/** Le parcours d'apprentissage, relié aux phases du projet. */
export const etapes = ["Comprendre", "Analyser", "Modéliser", "Concevoir", "Réaliser et vérifier", "Livrer"];

export const phases = [
  { num: 1, titre: "Analyse et exigences", debut: 1, fin: 2, etat: "Livrée le 2 octobre 2026" },
  { num: 2, titre: "Conception", debut: 3, fin: 4, etat: "Commence bientôt", enCours: true },
  { num: 3, titre: "Implémentation et tests", debut: 5, fin: 5 },
  { num: 4, titre: "Automatisation et déploiement", debut: 6, fin: 6 },
];

export interface Thematique {
  titre: string;
  texte: string;
  notions: string[];
}

export interface Groupe {
  theme: string;
  couleur: string;
  aVenir?: boolean;
  thematiques: Thematique[];
}

/** Les thématiques étudiées, regroupées selon les thèmes de la carte des concepts. */
export const groupes: Groupe[] = [
  {
    theme: "Fondements",
    couleur: "#1b2437",
    thematiques: [
      {
        titre: "Introduction au génie logiciel",
        texte:
          "Un logiciel est d'abord un artéfact conceptuel, c'est-à-dire une construction de l'esprit qui décrit une solution avant d'exister en code. Le concevoir, c'est concevoir un usage, malgré un objet invisible, complexe et discontinu.",
        notions: ["rôle de l'ingénieur", "artéfact conceptuel", "invisibilité, complexité, discontinuité", "espace mental"],
      },
    ],
  },
  {
    theme: "Processus de développement",
    couleur: "#1098AD",
    thematiques: [
      {
        titre: "Modèles de développement",
        texte:
          "S'organiser pour aboutir à une solution : chaque modèle répond à des contraintes différentes de ressources, de clarté des intentions et d'incertitude.",
        notions: ["cascade et modèle en V", "itératif et incrémental", "prototypage", "facteurs de choix"],
      },
    ],
  },
  {
    theme: "Exigences et analyse",
    couleur: "#4263EB",
    thematiques: [
      {
        titre: "Compréhension des exigences",
        texte:
          "Passer d'une demande exprimée à une compréhension structurée du travail réel : l'intention, le besoin, puis l'exigence qui rend le tout vérifiable.",
        notions: ["intention", "cycle d'activités", "cueillette des besoins", "persona", "exigences fonctionnelles et non fonctionnelles", "priorisation"],
      },
      {
        titre: "Cas d'utilisation",
        texte:
          "Exprimer les besoins dans un langage que les clients comprennent : qui interagit avec le système, pour quoi faire, et où s'arrêtent ses frontières.",
        notions: ["acteurs", "inclusion et extension", "généralisation", "frontières du système"],
      },
      {
        titre: "Analyse",
        texte:
          "Étudier le domaine dans lequel le système fonctionnera, remonter aux causes réelles d'un problème, puis structurer les exigences et borner la conception.",
        notions: ["compréhension du domaine", "analyse des causes", "exigences conceptuelles et physiques", "diagramme d'activité"],
      },
    ],
  },
  {
    theme: "Modélisation et conception",
    couleur: "#0CA678",
    thematiques: [
      {
        titre: "Modélisation",
        texte:
          "Un modèle est une représentation simplifiée d'un système, choisie pour l'étudier ou le communiquer. UML en offre plusieurs vues complémentaires.",
        notions: ["abstraction", "UML", "vues 4+1", "diagrammes de structure et de comportement"],
      },
      {
        titre: "Modèle de données",
        texte:
          "Modéliser les données dans leur contexte : d'où elles viennent, comment elles sont transformées, et à quoi elles servent dans l'application.",
        notions: ["données d'échange, de préservation et de présentation", "transformation (mapping)", "prototypage", "C4"],
      },
      {
        titre: "Conception",
        texte:
          "Structurer la solution indépendamment de son implémentation, en comprendre les forces et les faiblesses, et préparer les changements à venir.",
        notions: ["architecture", "modularité", "couplage et cohésion", "réutilisation", "conception évolutive", "diagramme de séquence"],
      },
      {
        titre: "Diagramme de classes",
        texte:
          "Décrire la structure statique d'un logiciel orienté objet : ses classes, leurs responsabilités et leurs relations.",
        notions: ["classes et visibilité", "associations et cardinalités", "agrégation et composition", "classes abstraites"],
      },
    ],
  },
  {
    theme: "À venir",
    couleur: "#9aa3b5",
    aVenir: true,
    thematiques: [
      {
        titre: "Spécification et implémentation",
        texte: "Du modèle au code : écrire du code que d'autres peuvent lire, réviser et faire évoluer.",
        notions: ["pratiques de codage", "refactoring", "gestion de versions"],
      },
      {
        titre: "Vérification et validation",
        texte: "S'assurer que le système fonctionne comme prévu, et qu'il répond bien au besoin initial : deux questions distinctes.",
        notions: ["tests unitaires", "tests d'intégration", "stratégies de test"],
      },
      {
        titre: "Automatisation et déploiement",
        texte: "Livrer régulièrement et sans surprise, grâce à des pipelines et des tests automatisés.",
        notions: ["intégration continue", "déploiement", "amélioration continue"],
      },
    ],
  },
];

/** Liens du projet de session et des ressources. */
export const liens = [
  { titre: "Énoncé de la phase 1", href: "/projet/phase-1/", texte: "Analyse et exigences, livrée le 2 octobre 2026." },
  { titre: "Guide de l'API Planifium", href: "/guide-api/", texte: "Exploiter l'API du projet en JavaScript, Python ou Java." },
  // { titre: "Carte des concepts", href: "/carte/", texte: "Les concepts du cours et leurs liens, phase par phase." },
];
