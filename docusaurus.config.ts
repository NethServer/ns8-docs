import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'NethServer 8 documentation',
  tagline: 'NethServer 8 is an application server designed for small offices and medium enterprises',
  favicon: 'img/favicon.ico',

  // Custom fields for theme configuration
  customFields: {
    productVersion: '8',
  },

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: false,
  },

  // Set the production url of your site here
  // Production: https://docs.nethserver.org with root baseUrl
  // Development: GitHub pages deployment
  url: process.env.NODE_ENV === 'production'
    ? 'https://docs.nethserver.org'
    : 'https://nethserver.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'NethServer', // Usually your GitHub org/user name.
  projectName: 'ns8-docs', // Usually your repo name.
  deploymentBranch: 'gh-pages', // The branch that GitHub pages will deploy from.
  trailingSlash: false, // Set to true if you want to add a trailing slash to all URLss

  onBrokenLinks: 'warn',

  // Markdown configuration
  markdown: {
    // Treat .md as CommonMark and .mdx as MDX. The docs are converted from
    // reStructuredText and may contain bare angle brackets / braces that are
    // not valid MDX, so CommonMark parsing keeps the build robust.
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it'],
    path: 'i18n',
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'en',
      },
      it: {
        label: 'Italian',
        direction: 'ltr',
        htmlLang: 'it-IT',
        calendar: 'gregory',
        path: 'it',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/NethServer/ns8-docs/blob/main'
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '',
      logo: {
        alt: 'NethServer 8',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'administratorManualSidebar',
          position: 'left',
          label: 'Administrator manual',
        },
        {
          type: 'docSidebar',
          sidebarId: 'userManualSidebar',
          position: 'left',
          label: 'User manual',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/NethServer/ns8-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Administrator manual',
              to: '/docs/administrator-manual',
            },
            {
              label: 'User manual',
              to: '/docs/user-manual',
            },
            {
              label: 'Tutorial',
              to: '/docs/tutorial',
            },
            {
              label: 'Developer manual',
              href: 'https://nethserver.github.io/ns8-core/',
            },
          ],
        },
        {
          title: 'Legacy docs',
          items: [
            {
              html: `
                <div class="legacy-docs-link-container">
                NethServer 7
                  <a class="footer__link-item" href="/en/v7/" target="_blank">en</a>
                  <a class="footer__link-item" href="/it/v7/" target="_blank"> it</a>
                </div>
              `,
            },
            {
              html: `
                <div class="legacy-docs-link-container">
                NethServer 6
                  <a class="footer__link-item" href="/en/v6/" target="_blank">en</a>
                  <a class="footer__link-item" href="/it/v6/" target="_blank"> it</a>
                </div>
              `,
            },
            {
              html: `
                <div class="legacy-docs-link-container">
                  <a class="footer__link-item" href="/projects/nethserver-devel/en/latest/" target="_blank">Developer manual 7</a>
                </div>
              `,
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/NethServer/ns8-docs',
            },
            {
              label: 'NethServer website',
              href: 'https://www.nethserver.org',
            },
            {
              label: 'NethServer Community',
              href: 'https://community.nethserver.org',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Nethesis`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
