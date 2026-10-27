// Énoncé de la phase 2 du projet de session (Conception). Données affichées par src/pages/projet/phase-2.astro.

export const config = {
  cours: "IFT2255",
  titre: "Génie logiciel",
  projet: "Concevoir une plateforme de planification des études",
  phase: "Phase 2",
  phaseNom: "Conception",
  equipe: "3 à 4 personnes",
  duree: "3 semaines",
  debut: "lundi 26 octobre 2026",
  remise: "Dimanche 14 novembre 2026",
  quotaQuestions: "1 question ou retour par semaine et par équipe",
  fenetreQuestions: "du lundi au vendredi",
  guideApi: "/guide-api/",
};

export const fenetres = [
  { n: 1, ouverture: "vendredi 16 octobre", fermeture: "mardi 20 octobre" },
  { n: 2, ouverture: "vendredi 23 octobre", fermeture: "mardi 27 octobre" },
  { n: 3, ouverture: "vendredi 30 octobre", fermeture: "mardi 3 novembre" },
];

export const acquis = [
  { code: "Exigences", detail: "Les exigences retenues, rattachées aux objectifs O1 à O6." },
  { code: "A1", detail: "Le diagramme de cas d'utilisation et ses fiches." },
  { code: "A2", detail: "Les cinq flux principaux, en diagrammes d'activités." },
  { code: "A3", detail: "Le modèle C4 (niveaux 1 et 2)." },
];

export const termes = [
  { terme: "Modèle du domaine", def: "Représentation des concepts du monde réel et de leurs relations (programme, cours, session, préalable), telle qu'une personne du milieu les décrirait. Il ne dit rien du logiciel." },
  { terme: "Modèle de conception", def: "Représentation des classes du logiciel lui-même. Il reprend souvent des concepts du domaine, mais en ajoute (un service, un cache, un adaptateur) et en transforme d'autres pour des raisons techniques." },
  { terme: "Multiplicité", def: "Nombre d'objets qui peuvent participer à une association, noté aux extrémités du lien : 1, 0..1, 1..*, *. Par exemple, un plan de session contient 0..* cours." },
  { terme: "Composant", def: "Au sens du modèle C4, un regroupement de fonctionnalités derrière une interface bien définie, à l'intérieur d'un conteneur. Ce n'est ni une classe ni un fichier, mais une unité de responsabilité." },
  { terme: "Critère d'acceptation", def: "Condition vérifiable qui permet de dire qu'une exigence est satisfaite. Il se formule de façon à ce que deux personnes différentes arrivent au même verdict." },
  { terme: "Cache", def: "Copie locale de données obtenues d'une source externe, conservée pour éviter de la solliciter à nouveau, au risque que la copie ne soit plus à jour." },
  { terme: "Migration", def: "Transformation de données déjà sauvegardées pour les rendre compatibles avec une nouvelle version du modèle." },
  { terme: "Cas limite", def: "Situation à la frontière de ce qui est permis : exactement le plafond de crédits, une liste vide, une date d'échéance atteinte à la minute près. C'est souvent là que les erreurs se cachent." },
  { terme: "Jeu de données d'essai", def: "Ensemble de données préparé pour exécuter des cas de test : un relevé, un programme, un horaire. Il est décrit assez précisément pour qu'une autre personne puisse le reconstituer." },
  { terme: "Release étiquetée", def: "Version du dépôt GitHub marquée par une étiquette (tag) à une date donnée. Elle fige l'état du projet, même si la branche principale continue d'évoluer." },
  { terme: "Matrice de traçabilité", def: "Tableau qui relie les éléments de deux artefacts, par exemple chaque exigence aux cas de test qui la vérifient, pour rendre visibles les trous et les doublons." },
];

export const artefacts = [
  {
    code: "B1",
    titre: "Modèle C4 (niveau 3)",
    quoi: "La décomposition en composants d'au moins un conteneur de votre niveau 2.",
    exigences: [
      "Choisissez le conteneur qui porte la logique de planification et justifiez ce choix en quelques phrases. Vous pouvez en décomposer un second si cela éclaire votre conception.",
      "Chaque composant a une responsabilité nommée en une phrase. <br> <b>Conseil :</b> Un composant dont on ne peut pas dire ce qu'il fait sans énumérer ses méthodes est probablement mal découpé.",
      "Les relations doivent toutes avoir une étiquette (court descriptif) qui indique ce qui circule et par quel moyen.",
      "Le niveau 3 doit rester cohérent avec le niveau 2 : les échanges avec les autres conteneurs et les systèmes externes y réapparaissent, rattachés au composant qui les prend en charge.",
      "Chacun des cinq flux de la phase 1 (<b style='color: var(--bleu)'>A2</b>) doit pouvoir se suivre d'un composant à l'autre. Indiquez-le dans la matrice de traçabilité.",
    ],
  },
  {
    code: "B2",
    titre: "Diagramme de classes",
    quoi: "Le modèle de conception du système visé (approx. 15 classes) : le modèle et les services qui l'exploitent.",
    exigences: [
      "Périmètre : les classes du modèle (cours, session,...) et les services qui les manipulent (planification, validation, accès aux sources de données), quel que soit le conteneur qui les héberge.",
      "Vous pouvez laisser de côté les classes propres à la présentation (dans l'interface utilisateur) et les classes purement utilitaires (ex: formattage, lecture variable environnementale, lecture / écriture de fichiers log).",
      "Respect du formalisme UML : Attributs typés, méthodes avec signature complète, associations avec leurs multiplicités, et héritage ou composition lorsqu'ils sont justifiés.",
      "Distinguez le modèle du domaine, qui décrit les concepts du monde universitaire, du modèle de conception, qui décrit votre logiciel. La vue principale contient au moins trois classes absentes du modèle du domaine (un service, un adaptateur de source, une règle…). Expliquez au moins deux de ces écarts.",
      "Les règles du programme apparaissent quelque part : plafond de crédits, préalables, blocs de cours. Montrez dans quelles classes elles vivent, et non seulement qu'elles existent.",
      "Les classes se rattachent aux composants de B1. Une classe sans composant, ou un composant sans classe, signale une incohérence à résoudre.",
      "Si vous dépassez 15 classes, présentez une vue principale de 15 classes au plus, et placez le reste en annexe.",
    ],
  },
  {
    code: "B3",
    titre: "Spécifications de tests",
    quoi: "De 15 à 25 cas de test spécifiés, et les critères d'acceptation des exigences retenues.",
    exigences: [
      "Chaque exigence reçoit au moins un critère d'acceptation vérifiable.",
      "Chaque cas de test précise son objectif, l'exigence qu'il vérifie, ses préconditions, ses données d'entrée, les étapes, et le résultat attendu.",
      "La couverture comprend des cas nominaux, des cas limites et des cas d'échec.",
      "Les jeux de données d'essai sont décrits, et réalistes.",
      "Les tests n'ont pas à être automatisés à cette phase.",
    ],
  },
  {
    code: "B4",
    titre: "Modèle de données",
    quoi: "Les données de votre système, leur parcours, et la stratégie qui encadre leur exploitation, leur sauvegarde et leur récupération.",
    exigences: [
      "Classez vos données en trois catégories : données d'échange, données de préservation et données de présentation.",
          "Repérez ce qui est conservé : dans le diagramme de classes (B2), marquez les classes dont les objets doivent être conservés d'une visite à l'autre, et dites où chacune l'est (navigateur, serveur, fichier). Signalez aussi toute donnée conservée sous une autre forme, par exemple une copie des réponses de l'API.",
          "Suivez le parcours d'une donnée : pour au moins deux informations importantes, par exemple un cours et son horaire, ou un plan de session, montrez son parcours de la source jusqu'à l'affichage, avec ses transformations (mapping, validation, conservation, présentation).",
          "Regroupez les données par responsabilité, et rattachez chaque regroupement au composant de B1 qui en est responsable.",
    ],
    // parties: [
    //   {
    //     titre: "Analyse et stratégie",
    //     exigences: [
    //       "Sources : pour chacune, ce qu'elle fournit, ce qu'elle ne fournit pas, et ce que votre système fait quand elle est indisponible ou incohérente (mise en cache, message à la personne utilisatrice). Appuyez-vous sur des requêtes réellement effectuées.",
    //       "Sauvegarde : distinguez les données reconstituables à partir des sources de celles qui n'existent nulle part ailleurs, comme les intentions de planification ou les appréciations. Pour ces dernières, précisez où et quand elles sont enregistrées.",
    //       "Récupération : décrivez un scénario de récupération, au choix : changement d'appareil, effacement du navigateur ou panne du serveur.",
    //     ],
    //   },
    // ],
  },
];

export const etapes = [
  {
    n: 1,
    nom: "Structurer",
    quand: "semaine du 16 octobre",
    but: "Passer des exigences à une structure : quels composants, quelles classes.",
    taches: [
      "Révisez au besoin vos artefacts de phase 1, en le signalant.",
      "Produisez une première version de B1 et de B2, et vérifiez leur cohérence mutuelle.",
      "Explorez l'API Planifium à l'aide du guide publié sur le site du cours, et le fichier Excel des calendriers.",
    ],
  },
  {
    n: 2,
    nom: "Confronter aux données",
    quand: "semaine du 23 octobre",
    but: "Mesurer ce que les sources réelles permettent, et ce qu'elles ne permettent pas.",
    taches: [
      "Établissez le modèle de données (B4) à partir de requêtes réellement effectuées, pas de la documentation seule.",
      "Ajustez B2 en conséquence : les données réelles invalident souvent une partie du modèle initial.",
      "Rédigez l'analyse et la stratégie de B4 : exploitation des sources, sauvegarde, récupération.",
    ],
  },
  {
    n: 3,
    nom: "Vérifier",
    quand: "semaine du 30 octobre",
    but: "Rendre la conception vérifiable, et en montrer la cohérence.",
    taches: [
      "Rédigez B3 et les critères d'acceptation.",
      "Établissez la matrice de traçabilité.",
      "Publiez la release, mettez à jour le README, et finalisez le rapport.",
    ],
  },
];

export const ponderations = [
  {
    titre: "Rapport de conception",
    format: "PDF",
    poids: 75,
    quoi: "Artefacts B1 à B4, matrice de traçabilité, révisions apportées à la phase 1, et décisions de conception justifiées.",
  },
  {
    titre: "Dépôt GitHub avec release",
    format: "Release étiquetée et README",
    poids: 25,
    quoi: "Fichiers sources des diagrammes, jeux de données d'essai, et, si le prototype progresse, son état à la date de remise.",
  },
];

export const contenuRapport = [
  "Les révisions apportées aux artefacts de phase 1, et leur raison.",
  "Les cinq artefacts B1 à B4.",
  "La matrice de traçabilité.",
  "Les principales décisions de conception, chacune avec l'alternative écartée et la raison.",
  "Ce que votre conception ne traite pas encore, et pourquoi.",
];

export const contenuReadme = [
  "L'état du projet à la fin de la phase 2.",
  "L'emplacement des fichiers sources des diagrammes et des jeux de données d'essai.",
  "Si le prototype a progressé : comment le lancer, et ce qui a changé depuis la phase 1.",
  "La composition de l'équipe et la répartition du travail pendant la phase 2.",
  "Les outils d'assistance logicielle utilisés, et pour quelles parties.",
];

export const tracabilite = [
  { de: "Exigence", vers: "Critères d'acceptation et cas de test de B3" },
  { de: "Exigence", vers: "Classes de B2 qui la portent" },
  { de: "Flux de A2", vers: "Composants de B1 traversés" },
  { de: "Composant de B1", vers: "Classes de B2" },
  { de: "Source de B4", vers: "Composant de B1 qui la consomme" },
];

export const criteres = [
  {
    titre: "Cohérence entre les artefacts",
    poids: "20 %",
    description: "Les cinq artefacts s'intègrent bien l'un dans l'autre et communique plusieurs facettes d'un même système. La matrice de traçabilité est complète et les exceptions sont expliqués."
  },
  {
    titre: "Qualité de la conception",
    poids: "30 %",
    description: "Les composants et modules ont des responsabilités claires et maximise la cohésion du système. Les relations et abstractions sont pertinentes et minimisent le couplage au sein du système et avec les systèmes externes.",
    bas: "Un diagramme de classes qui recopie le domaine, ou des composants nommés d'après des technologies plutôt que des responsabilités.",
  },
  {
    titre: "Spécification des tests",
    poids: "25 %",
    description: "Les critères d'acceptation permettent un verdict sans ambiguïté. Les cas de test couvrent les échecs, pas seulement les scénarios réussis.",
    bas: "Des cas de test qui reformulent les exigences, sans données ni résultat attendu précis.",
  },
  {
    titre: "Défense des choix",
    poids: "15 %",
    description: "Chaque décision importante présente l'alternative écartée ou justifie le choix retenu.",
    bas: "Des choix présentés comme allant de soi.",
  },
  {
    titre: "Qualité du rapport et documentation",
    poids: "5 %",
    description: "Chaque décision importante nomme l'alternative écartée et ce qu'elle aurait coûté.",
    bas: "Des choix présentés comme allant de soi.",
  },
  {
    titre: "Travail d'équipe",
    poids: "5 %",
    description: "Chaque décision importante nomme l'alternative écartée et ce qu'elle aurait coûté.",
    bas: "Des choix présentés comme allant de soi.",
  },
];

export const horsSujet = [
  "Le fonctionnement de l'API Planifium, documenté dans le guide du site du cours.",
  "Les notions de modélisation vues en classe, comme la notation UML ou les niveaux du modèle C4.",
  "Toute question dont la réponse se trouve dans les documents publics de l'université.",
];

export const pistes = [
  "Quelles données de planification les personnes étudiantes perdent-elles le plus souvent, et comment les reconstituent-elles ?",
  "Quand une règle de programme change en cours de cheminement, qu'arrive-t-il aux plans déjà établis ?",
  "Quelles informations du dossier sont fiables, et lesquelles faut-il toujours revérifier ?",
  "Qu'est-ce qui rendrait un plan invalide sans que la personne s'en aperçoive ?",
];

export const apprentissages = [
  "Découper un système en composants aux responsabilités claires.",
  "Distinguer le modèle du domaine du modèle de conception, et justifier les écarts entre les deux.",
  "Concevoir avec des sources de données imparfaites, que l'on ne contrôle pas.",
  "Rendre une exigence vérifiable, et spécifier des tests qui couvrent aussi les échecs.",
  "Maintenir la cohérence entre plusieurs artefacts, et la démontrer par la traçabilité.",
];

// Exemple affiché sous B3 : un critère vérifiable à côté d'un critère vague.
export const exempleCritere = {
  exigence: "Le plan de session signale tout dépassement du plafond de crédits.",
  vague: "Le système avertit clairement l'étudiant quand il prend trop de crédits.",
  verifiable: "Quand le total des crédits du plan dépasse le plafond de la session, une alerte apparaît dans le plan, nomme le plafond et l'écart en crédits, et le plan reste enregistré.",
  pourquoi: "« Clairement » et « trop » laissent chaque personne juger à sa façon. La seconde formulation dit quand l'alerte apparaît, ce qu'elle contient et ce qui ne doit pas se produire : deux personnes arrivent au même verdict.",
};

// Gabarit de fiche de cas de test, avec un exemple rempli.
export const gabaritCasTest = [
  { champ: "Identifiant", exemple: "CT-07" },
  { champ: "Type", exemple: "Cas limite" },
  { champ: "Objectif", exemple: "Vérifier l'alerte quand un ajout fait dépasser le plafond de crédits." },
  { champ: "Exigence vérifiée", exemple: "E-04, critère CA-04.1" },
  { champ: "Préconditions", exemple: "Jeu d'essai J-02 : plafond de 15 crédits pour la session ; le plan contient déjà 12 crédits." },
  { champ: "Données d'entrée", exemple: "Ajout de deux cours de 3 crédits chacun." },
  { champ: "Étapes", exemple: "1. Ouvrir le plan de la session. 2. Ajouter le premier cours. 3. Ajouter le second cours." },
  { champ: "Résultat attendu", exemple: "Aucune alerte après l'étape 2 (15 crédits, à la limite). Après l'étape 3, une alerte indique un plafond de 15 crédits et un écart de 3 crédits ; les deux cours restent dans le plan." },
];

// Gabarit de matrice de traçabilité (lignes d'exemple).
export const gabaritMatrice = {
  colonnes: ["Exigence", "Critères", "Cas de test", "Classes (B2)", "Composants (B1)"],
  lignes: [
    ["E-04", "CA-04.1", "CT-07, CT-08", "PlanSession, RegleCredits", "Validation du plan"],
    ["E-09", "CA-09.1, CA-09.2", "CT-12", "SourceHoraires, CacheHoraires", "Accès aux horaires"],
    ["E-11", "CA-11.1", "(aucun)", "Appreciation", "Suivi des activités"],
  ],
  note: "La dernière ligne montre une case vide : elle doit être accompagnée d'une explication dans le rapport (par exemple, un test reporté à la phase 3 et pourquoi).",
};

// Modalités. null : affiché « à confirmer » sur la page.
export const modalites = {
  depot: "Archive (.zip ou .rar) contenant le PDF, les assets et les artéfacts produits" as string | null,              // où déposer le PDF
  etiquette: "phase-2" as string | null,     // étiquette de la release
  longueur: "10 pages (excluant les diagrammes)" as string | null,           // limite de pages du rapport
  formatsDiagrammes: "Image PNG ou SVG lisible créée avec un outil de modélisation : Visual Paradigm, StarUML ou Draw.io (Diagrams.net)." as string | null,
  poidsPhase: null as string | null,         // poids de la phase dans la note du cours
  retourPhase1: null as string | null,       // date du retour sur la phase 1
  regleQuestions: null as string | null,     // pénalité sans question et source non conseillère : reconduites ?
  releve: null as string | null,             // forme du relevé de notes que traite B4
};
