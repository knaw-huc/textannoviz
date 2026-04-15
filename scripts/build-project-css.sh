#!/bin/sh
set -xe

PROJECTS="brederode globalise hooft israels mondriaan oraties republic suriano translatin vangogh"
TAILWIND_CSS="src/tailwind.css"

for PROJECT in $PROJECTS; do
  CONFIG="tailwind.config.${PROJECT}.js"

  if [ ! -f "$CONFIG" ]; then
    echo "WARNING: $CONFIG not found, skipping $PROJECT"
    continue
  fi

  PROJECT_CSS="src/projects/${PROJECT}/project.css"
  MERGED_CSS=$(mktemp)
  OUTPUT_CSS="dist/${PROJECT}.css"

  cat "$TAILWIND_CSS" > "$MERGED_CSS"
  if [ -f "$PROJECT_CSS" ]; then
    cat "$PROJECT_CSS" >> "$MERGED_CSS"
  fi
  echo "Building ${OUTPUT_CSS}"

  npx tailwindcss \
    --config "$CONFIG" \
    --input "$MERGED_CSS" \
    --output "$OUTPUT_CSS" \
    --minify

  rm -f "$MERGED_CSS"
done

echo "Done building css files for: ${PROJECTS}"