#!/bin/sh
set -e
PROJECTS="brederode globalise hooft israels mondriaan oraties republic suriano translatin vangogh"

for PROJECT in $PROJECTS; do
  CONFIG="tailwind.config.${PROJECT}.js"

  if [ ! -f "$CONFIG" ]; then
    echo "WARNING: $CONFIG not found, skipping $PROJECT"
    continue
  fi

  OUTPUT="dist/tailwind-${PROJECT}.css"
  echo "Building tailwind CSS for ${PROJECT}: ${OUTPUT}"
  npx tailwindcss \
      --config "$CONFIG" \
      --input src/tailwind.css \
      --output "$OUTPUT" \
      --minify
done

echo "Done building tailwind css files for: ${PROJECTS}"