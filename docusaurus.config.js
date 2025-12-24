// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Crisis Resources Directory',
  tagline: 'Supporting students, families, educators, and professionals',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://crisis.ymhc.ngo',
  baseUrl: '/',

  organizationName: 'Youth Mental Health Canada',
  projectName: 'crisis-support-directory',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/', // Serve docs at the site root
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Crisis Resources',
        logo: {
          alt: 'YMHC Logo',
          src: 'img/logo.png', // Ensure we have a logo or use text
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: 'Directory',
          },
          {
            label: 'Exit Site',
            href: 'https://www.google.com/search?q=weather+tomorrow&ie=UTF-8',
            position: 'right',
            className: 'exit-site-button',
            target: '_self',
            rel: 'nofollow',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'About',
            items: [
              {
                label: 'About This Website',
                to: '/about',
              },
              {
                label: 'Contribute',
                to: '/about/contribute',
              },
              {
                label: 'YMHC Home',
                href: 'https://ymhc.ngo',
              },
            ],
          },
          {
            title: 'Legal',
            items: [
              {
                label: 'Terms of Service',
                to: '/about/terms-of-service',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Youth Mental Health Canada.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
