# API / Website SDK

## Goals:

* Write content using Jupyter notebooks
* Support Jupyter features (markdown, attachments, code)
* Support custom components
* Support pagination

## Additional goals:

* Pagination
* Rich metadata
* Client-side or static site generation rendering (mix, prefer SSG)

## Current Features

* Write content using Jupyter notebooks
* Support Jupyter features (markdown, attachments, code)
* Support custom components
* SSG with some client side rendering where SSG not possible

## Next Features to Add

* Pagination
* Better metadata

## Pagination

Pagination will be one of the more complicated features to implement.

Goal with pagination: have multiple notebooks, one per page.

How we can accomplish this? Metadata?

```toml
article = '/blog/article-name' # will be used as the path
pageno = 1
title = 'short title'
subtitle = 'some more details, in title format'
published = true | false
publishedOn = 'date'
lastModifiedOn = 'date'
```

We need to better parse notebooks to support the 

