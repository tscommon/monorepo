import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { DocusaurusPluginTypeDocApiOptions } from 'docusaurus-plugin-typedoc-api/lib/types';
import { globSync } from 'fs';
import path from 'path';
import { themes as prismThemes } from 'prism-react-renderer';

const projectRoot = path.join(__dirname, '..', '..');

const packages = globSync('packages/*', { cwd: projectRoot }).filter((dir) => !(dir === 'packages/docs'));

const config: Config = {
  title: 'TypeScript Common',
  tagline: 'A set of primitives for TypeScript projects',
  favicon: 'img/favicon-32x32.png',

  // Set the production url of your site here
  url: 'https://tscommon.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/monorepo/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tscommon', // Usually your GitHub org/user name.
  projectName: 'monorepo', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/tscommon/monorepo/tree/main/packages/docs',
          sidebarCollapsed: false,
          sidebarCollapsible: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'TypeScript Common',
      logo: {
        alt: 'TS Common Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'html',
          position: 'right',
          value:
            '<a target="_blank" rel="noopener noreferrer" href="https://codecov.io/gh/tscommon/monorepo" style="display: block; margin-top: 9px;"><img src="https://codecov.io/gh/tscommon/monorepo/graph/badge.svg?token=I222OQNV9L"/></a>',
        },
        {
          href: 'https://github.com/tscommon/monorepo',
          label: 'GitHub',
          position: 'right',
        },
        {
          to: 'api',
          label: 'API',
          position: 'left',
        },
      ],
    },
    docs: {
      sidebar: {
        autoCollapseCategories: false,
      },
    },
    prism: {
      theme: prismThemes.vsLight,
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'theme-code-block-error-line',
          line: 'expect-error-next-line',
        },
      ],
    },
    colorMode: {
      disableSwitch: true,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    [
      'docusaurus-plugin-typedoc-api',
      {
        projectRoot,
        packages,
        readmes: false,
        changelogs: false,
        typedocOptions: {
          excludeProtected: true,
          excludeInternal: true,
          excludePrivate: true,
          hideGenerator: true,
        },
      } satisfies Partial<DocusaurusPluginTypeDocApiOptions>,
    ],
  ],
};

export default config;
