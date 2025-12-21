// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'YMHC Crisis Resources Directory',
  tagline: 'Supporting students, families, educators, and professionals',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://crisis.ymhc.ngo',
  baseUrl: '/',

  organizationName: 'Youth Mental Health Canada',
  projectName: 'crisis-support-directory',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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
        title: 'YMHC Crisis Directory',
        logo: {
          alt: 'YMHC Logo',
          src: 'img/logo.svg', // Ensure we have a logo or use text
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: 'Directory',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'YMHC',
            items: [
              {
                label: 'YMHC Home',
                href: 'https://ymhc.ngo',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Youth Mental Health Canada. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
