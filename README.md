# 🚀 Modern Blogging Platform with Jupyter Notebooks

## ✨ Key Features

- **Cost-Effective**: Deploy to S3 or any static hosting for pennies
- **Interactive Development**: Full Jupyter/JupyterLab interface support
- **VS Code Integration**: Write content in your favorite IDE
- **Lightning Fast**: Static site generation for optimal performance
- **Simple Workflow**: Just write notebooks, commit, and deploy

Oh, and did I say *performance*? Oh yeah this is blazing fast since everything gets statically rendered through the magic of Next.js!

## 💡 Why Use This Platform?

- **For Writers**: Focus on content, not configuration
- **For Developers**: Full Python/React environment at your fingertips
- **For Business**: Minimal hosting costs with maximum flexibility

## 📘 Content Creation

Write your content in Jupyter notebooks using:
- Rich text formatting
- Code blocks with syntax highlighting (upcoming)
- Interactive visualizations (upcoming)
- Mathematical equations (upcoming)
- And much more!

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Writing content

Add notebooks into the `notebooks/pages` and `notebooks/blogs` directories. Run `npm prebuild` to compile the jupyter notebooks.

Transform your ideas into beautiful, interactive content using the power of Jupyter notebooks and Next.js! This platform combines the simplicity of WordPress with the cost-effectiveness of static site generation.

## 📝 Creating Articles

Articles are created using Jupyter notebooks. Each article consists of specific cells:

1. **Metadata Cell (TOML)**:
  ```toml
  title = "Your Article Title"
  description = "Brief description of your article"
  published = "2024-01-01T00:00:00Z"
  tags = ["tag1", "tag2"]
  ```

2. **Hero Content Cell**:
  - This cell appears on the blog homepage and article preview
  - Gets removed from the main article view
  - Perfect for article introductions or summaries

## 🗂️ Post Organization

- Posts are automatically sorted by `published` date on the homepage
- Date format should be JavaScript compatible (ISO 8601 recommended)
- Sort behavior can be customized in `src/app/ipynb/prebuild.js`
- Future improvements planned for more flexible sorting options. Currently, there is no way to hide a post or page without removing it.
