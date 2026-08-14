#!/usr/bin/env bash
# Publish the client to GitHub Pages.
#
# Pages serves a project site from /<repo>/, so the bundle is built with a
# matching base path and the router is given the same basename. 404.html is a
# copy of index.html because Pages has no rewrite rule for client-side routes.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/web-apps/deep-verify-frontend"
REPO="$(git -C "$ROOT" remote get-url origin | sed -E 's#.*/([^/]+)\.git$#\1#')"
BRANCH="gh-pages"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "Building for /$REPO/"
cd "$SRC"
VITE_BASE_PATH="/$REPO/" npm run build

cp dist/index.html dist/404.html
touch dist/.nojekyll

echo "Publishing to $BRANCH"
cp -R dist/. "$WORK/"
cd "$WORK"
git init -q
git checkout -qb "$BRANCH"
git add -A
git -c user.name=francisojeah -c user.email=ojeahfrancis@gmail.com \
  commit -q -m "Deploy client from $(git -C "$ROOT" rev-parse --short HEAD)"
git push -q --force "$(git -C "$ROOT" remote get-url origin)" "$BRANCH"

echo "Deployed. https://francisojeah.github.io/$REPO/"
