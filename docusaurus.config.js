// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Wen的技术乐园',
  tagline: 'Dinosaurs are cool',
  favicon: 'favicon.ico',

  // Set the production url of your site here
  url: 'https://zhangwen.site',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'calvingit', // Usually your GitHub org/user name.
  projectName: 'website', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          sidebarItemsGenerator: async function ({ defaultSidebarItemsGenerator, ...args }) {
            const sidebarItems = await defaultSidebarItemsGenerator(args);
            return reverseSidebarItems(sidebarItems);
          },
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: '最新文章',
          blogSidebarCount: 10,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/calvingit/website/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Wen的技术乐园',
        logo: {
          alt: 'zhangwen.site',
          src: 'logo.svg',
        },
        items: [
          { to: '/blog', label: '博客', position: 'left' },
          {
            type: 'docSidebar',
            sidebarId: 'readingSidebar',
            position: 'left',
            label: '摸鱼精选',
          },
          { to: '/about', label: '关于', position: 'right' },
          {
            href: 'https://github.com/calvingit',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '链接',
            items: [
              {
                label: '博客',
                to: '/blog',
              },
              {
                label: '摸鱼精选',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: '社区',
            items: [
              {
                label: '掘金',
                href: 'https://juejin.cn/user/61228378496782',
              },
              {
                label: 'Github',
                href: 'https://github.com/calvingit',
              },

              {
                label: 'Twitter',
                href: 'https://twitter.com/zhangwen_site',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '关于',
                to: '/about',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Zhang Wen.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['dart', 'ruby'],
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'KAQ9XLK7X1',
        // Public API key: it is safe to commit it
        apiKey: 'eeb5ab1ba5276b3c01865511ba1ca412',
        indexName: 'zhangwen',
        // Optional: see doc section below
        contextualSearch: true,
      },
    }),
};

// Reverse the sidebar items ordering (including nested category items)
function reverseSidebarItems(items) {
  // Reverse items in categories
  const result = items.map((item) => {
    if (item.type === 'category') {
      return { ...item, items: reverseSidebarItems(item.items) };
    }
    return item;
  });
  // Reverse items at current level
  result.reverse();
  return result;
}

export default config;
