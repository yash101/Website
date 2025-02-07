#!/usr/bin/env bash

npm install --force
mkdir -p public/monaco
cp -r node_modules/monaco-editor/min/vs public/monaco/
cp -r node_modules/monaco-editor/min-maps/ public/min-maps
npm run build
