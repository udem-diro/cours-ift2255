// Collection de contenu Starlight : seules les pages de src/content/docs/ (le guide de l'API)
// sont servies par Starlight ; les pages de src/pages/ restent inchangées.
import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  // Traductions de l'interface Starlight (vide : on garde les libellés français par défaut)
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
