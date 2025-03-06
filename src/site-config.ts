export const site_title: string = 'Yash\'s Site';
export const blog_title: string = 'Hello, World!';
export const site_description: string = 'Yash\'s website - full of projects, thoughts, ideas and creativity!';

export const maxImageWidth: number = 768;

export const memoizeIndex: boolean = false;

export const markdownitConfig: object = {
  // Enable HTML tags in source
  html: true,

  // Use '/' to close single tags (<br />).
  // This is only for full CommonMark compatibility.
  xhtmlOut: true,

  // Convert '\n' in paragraphs into <br>
  breaks: true,

  // CSS language prefix for fenced blocks. Can be
  // useful for external highlighters.
  langPrefix: 'language-',

  // Autoconvert URL-like text to links
  linkify: true,

  // Enable some language-neutral replacement + quotes beautification
  // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.mjs
  typographer: true,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',
};

export const mathjaxConfig: object = {
  /**
   * Output syntax 'svg' | 'chtml'
   *
   * @default 'svg'
   */
  output: 'svg',

  /**
   * Whether to allow inline math with spaces on ends
   *
   * @description NOT recommended to set this to true, because it will likely break the default usage of $
   *
   * @default false
   */
  allowInlineWithSpace: false,

  /**
   * Whether parsed fence block with math language to display mode math
   *
   * @default false
   */
  mathFence: true,

  /**
   * Enable A11y
   *
   * @default true
   */
  a11y: true,

  /**
   * TeX input options
   */
  tex: {
    inlineMath: [['$', '$']],
    displayMath: [['$$', '$$']],
    processEscapes: true,
  },

  /**
   * Common HTML output options
   */
  chtml: null,

  /**
   * SVG output options
   */
  svg: null,
}

export const DrawIOURL: string = 'https://drawio.devya.sh';
export const forceUnpublishedAsPublished: boolean = false;
