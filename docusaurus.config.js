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

  headTags: [
    {tagName: 'link', attributes: {rel: 'alternate', type: 'text/plain', title: 'llms.txt', href: '/llms.txt'}},
    {tagName: 'link', attributes: {rel: 'ai-catalog', href: '/.well-known/ai-catalog.json'}},
    {tagName: 'link', attributes: {rel: 'api-catalog', href: '/.well-known/api-catalog'}},
  ],

  clientModules: ['./src/clientModules/webmcp.js'],

  plugins: [
    [
      'docusaurus-plugin-llms',
      {
        generateMarkdownFiles: true,
        excludeImports: true,
        removeDuplicateHeadings: true,
        description:
          'Directory of Canadian crisis lines and mental health support services, nationwide and by province/territory. Not a crisis service: in an emergency call 9-1-1, or call/text 9-8-8.',
      },
    ],
    [
      'docusaurus-plugin-mcp-server',
      {
        server: {name: 'crisis-resources', version: '1.0.0'},
        skills: {dir: 'skills'},
      },
    ],
    [
      './plugins/agent-discovery.js',
      {
        mcpServerName: 'crisis-resources',
        mcpServerVersion: '1.0.0',
        representativeQueries: [
          'suicide crisis line in Canada',
          'youth mental health helpline Ontario',
          'Indigenous crisis support line',
          'ligne de prévention du suicide Québec',
          'mental health crisis team Alberta',
        ],
      },
    ],
  ],

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
