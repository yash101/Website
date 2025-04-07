# 🚀 Modern SSG Blogging Platform using Jupyter Notebooks

## ✨ Key Features

- **Cost-Effective**: Deploy to S3 or any static hosting for pennies
- **Interactive Development**: Full Jupyter/JupyterLab interface support
- **Lightning Fast**: Most content is static-site generated (SSG), so serve it off a CDN and achieve blazing fast performance!
- **Simple Workflow**: Just write notebooks, commit, and deploy
- **Embeds**: Strong embeds so you can add a ton of interactability into your pages
- **React-based**: Create custom components, embeds and so much more without adding a ton of complexity or performance impact

Oh, and did I say *performance*? Most content, especially all your markdown content and code blocks are statically rendered using server components only!

## JavaScript? 🤢

Since basic content is fully SSG (static site generated) through the magic of Next.js, your pages should render even with JavaScript disabled! Insane, right!

Obviously, any interactive blocks (such as embeds) won't render.

## 💡 Why Use This Platform?

- **For Writers**: Focus on content, not configuration
- **For Developers**: Full Python/React environments at your fingertips
- **For Business**: Minimal hosting costs with significant flexibility

## 📘 Content Creation

Write your content in Jupyter notebooks using:

- Rich text formatting (markdown or HTML)
- Code blocks with syntax highlighting (upcoming)
- Interactive visualization
- Mathematical equations
- Strong embed system
- And much more!

## Getting Started

First, build notebooks (this is a separate step currently, and we are still identifying how to integrate it more into next.js)

```bash
npm run prebuild
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
# or
next dev
# or
npx next dev
```

Open [http://localhost:3000](http://localhost:3000) or the address Next.js is listening on with your browser to see the result.

## Writing content

Add notebooks into the `/notebooks` directory. It doesn't matter where in the `/notebooks` directory - whether it is in a subdirectory or not. Update `_site-structure.json` with metadata on how your site is structured.

See documentation below on the format of notebooks and `_site-structure.json`

## 📝 Creating Articles

Article
: a set of pages on a topic
: each page is a separate Jupyter notebook with the same `root` and same `name`. These fields are also used to create the URL.

Articles are a collection of Jupyter notebooks, each having the same `root` and `name` fields in their metadata.

1. **Metadata Cell (TOML)**:

  ```toml
  root = 'some-base-url'
  name = 'some-article'
  title = 'Some Article'
  subtitle = 'Page one of Some Article'
  page = 1
  isPublished = true
  authors = 'yash101'

  lastModifiedOn = '2025-02-07T20:56:17.277Z'
  publishedOn = '2025-02-07T00:00:00.277Z'
  ```

  - More metadata fields may be added in the future.
  - Date format should be JavaScript compatible (ISO 8601 recommended)

2. **Hero Content Cell**:

  - The second cell of the first page is the *hero content*. This is rendered in the preview in a `Blog` view.
  - This is not rendered in the first page of an article
  - Perfect for article introductions or summaries

## 🗂️ Post Organization & `_site-structure.json`

**_site-structure.json**:

```json
{
  "roots": {
    "pages": {
      "menuTitle": "Pages",
      "rootType": "Pages",
      "displayArticlesInMenu": true,
      "pageTitle": "Pages",
      "linkInMenu": false
    },
    "deep-dive": {
      "linkInMenu": true,
      "menuTitle": "Deep Dives",
      "rootType": "Blog",
      "displayArticlesInMenu": true,
      "pageTitle": "Deep Dives by Yash"
    }
  }
}
```

This is an excerpt of what I use on my own website.

* Each `root` is a base in the URL of the website.
  * Example, articles in the root `pages` would be `/pages/{article_name}/{page_number}`
  * Example, articles in the root `deep-dives` would be `/deep-dives/{article_name}/{page_number}`

* `linkInMenu`: whether to link the root to `/{root}`
* `menuTitle`: Title to display in the Menu
* `rootType`: `Blog` OR `Pages`
  * `Blog`: display a blog view at `/{root}` showing the articles, their hero section, and a list of the pages
  * `Pages`: currently implemented as a `404 error`
* `displayArticlesInMenu`: whether to list articles under the `root` in the sidebar or menu

Website link: [devya.sh](https://devya.sh); GitHub: [yash101:Website](https://github.com/yash101/Website)

## 🧙‍♂️ Magic Commands

JupyNext supports cell magic commands that control how cells are processed during compilation:

- `#%hidden` or `#%delete` - Cell won't be rendered in the final output
- `//%hidden` or `//%delete` - Alternative syntax for JavaScript/TypeScript cells

Place magic commands at the beginning of a cell, one command per line.

## ⚡️ Hosting

* Static export: this project is, by default, a next `export` project. Using `next build` or `npm run build` will statically export as an SSG site
* Vercel/Netlify: Connect your repository for automatic deployments
* Cloudflare Pages: Use `ci.sh` or `npm run ci-build`. Configuration below:
  * Build command: `npm run ci-build`
  * Build output: `out`
  * Environment variables:
    * `NODE_VERSION` is `v22.13.0`
    * `SKIP_DEPENDENCY_INSTALL` is `1` since some of the dependencies used *"don't support"* React 19.

