#!/bin/sh
set -xe

PROJECTS="brederode globalise hooft israels mondriaan oraties republic suriano translatin vangogh"

for PROJECT in $PROJECTS; do
  CONFIG="tailwind.config.${PROJECT}.js"

  if [ ! -f "$CONFIG" ]; then
    echo "WARNING: $CONFIG not found, skipping $PROJECT"
    continue
  fi

  PROJECT_CSS="src/projects/${PROJECT}/project.css"
  OUTPUT_CSS="dist/${PROJECT}.css"

  INPUT_CSS=$PROJECT_CSS
  if [ ! -f "$PROJECT_CSS" ]; then
    echo "No project.css found for ${PROJECT}"
    exit 1
  fi

  echo "Building ${OUTPUT_CSS}"
  npx tailwindcss \
    --config "$CONFIG" \
    --input "$INPUT_CSS" \
    --output "$OUTPUT_CSS" \
    --minify

done

echo "Done building css files for: ${PROJECTS}"