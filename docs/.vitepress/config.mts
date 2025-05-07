import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Planifium documentation",
  description: "Le planificateur académique est un outil (application web) de planification d’horaires et de cheminements visant à aider les étudiants dans leur parcours universitaire.",
  locales: {
    root: {
      label: 'Francais',
      lang: 'fr'
    },
    en: {
      label: 'English',
      lang: 'en', // optional, will be added  as `lang` attribute on `html` tag
      // other locale specific properties...
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Wiki', link: '/wiki/general' }
    ],

    sidebar: [
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'General', link: '/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/api-examples' }
      //   ]
      // },
      {
        text: 'Wiki',
        items: [
          { text: 'General', link: '/wiki/general' },
          { text: 'Exigences', link: '/wiki/requirements' },
          { text: 'Source de données', link: '/wiki/data-sources' },
          { text: 'Infrastructure', 
            items: [
              { text: 'Parseur', link: '/wiki/data-sources' },
              { text: 'Base de données', link: '/wiki/database' },
              { text: 'Services API', link: '/wiki/api-services' },
            ]
           },
          { text: 'Application', link: '/wiki/application' },
        ]
      }
    ],

    editLink: {
      pattern: 'https://github.com/udem-diro/planificateur-academique/edit/main/docs/:path'
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/udem-diro/planificateur-academique' }
    ]
  }
})
