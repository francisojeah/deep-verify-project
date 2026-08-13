#!/usr/bin/env bash
# Push the detection service to the Hugging Face Space.
#
# The Space is a separate git repo that needs app.py at its root, so the
# microservice directory is mirrored into a clone rather than pushed as a
# subtree. Requires the SSH key to be unlocked:
#
#   ssh-add ~/.ssh/id_ed25519_personal
#
set -euo pipefail

SPACE="${SPACE:-francisojeah/deep-verify}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/web-apps/deep-verify-model-microservice"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

export GIT_SSH_COMMAND="ssh -o IdentitiesOnly=no"

echo "Cloning space $SPACE"
git clone --quiet "git@hf.co:spaces/$SPACE" "$WORK/space"

echo "Mirroring service"
# .gitattributes is the Space's own: it routes binaries (the YuNet .onnx) to LFS,
# and HF rejects pushes that carry them as plain blobs. Never delete it.
rsync -a --delete \
  --exclude '.git' \
  --exclude '.gitattributes' \
  --exclude '.venv' \
  --exclude '__pycache__' \
  --exclude '.pytest_cache' \
  --exclude 'benchmarks/.sample-cache' \
  "$SRC/" "$WORK/space/"

cd "$WORK/space"
git add -A
if git diff --cached --quiet; then
  echo "No changes to deploy."
  exit 0
fi

git -c user.name=francisojeah -c user.email=ojeahfrancis@gmail.com \
  commit -q -m "Deploy detection service from $(git -C "$ROOT" rev-parse --short HEAD)"
git push --quiet origin main

echo "Deployed. Build log: https://huggingface.co/spaces/$SPACE"
echo "App URL:  https://${SPACE/\//-}.hf.space"
