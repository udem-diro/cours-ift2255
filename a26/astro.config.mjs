// @ts-check
import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    site: 'https://udem-ift2255-a26.netlify.app',
    integrations: [
        // Starlight ne sert que le guide de l'API (src/content/docs/guide-api/ -> /guide-api/...) ;
        // les autres pages du site (src/pages/) gardent leur propre mise en page.
        starlight({
            title: "Guide de l'API Planifium",
            logo: { src: './src/assets/logo-ift2255.png', alt: 'IFT2255' },
            defaultLocale: 'root',
            locales: { root: { label: 'Français', lang: 'fr' } },
            disable404Route: true, // ne remplace pas la page 404 du site
            customCss: ['./src/styles/guide-api.css'],
            sidebar: [
                { label: '← Site du cours IFT2255', link: '/' },
                { label: 'Démarrer', items: [{ autogenerate: { directory: 'guide-api/demarrer' } }] },
                { label: 'Comprendre les données', items: [{ autogenerate: { directory: 'guide-api/donnees' } }] },
                { label: 'Guides pratiques', items: [{ autogenerate: { directory: 'guide-api/guides' } }] },
                { label: 'Référence', items: [{ autogenerate: { directory: 'guide-api/reference' } }] },
                { label: 'Limites à connaître', slug: 'guide-api/limites' },
            ],
        }),
        react(),
    ]
});
