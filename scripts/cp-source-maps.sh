#!/usr/bin/env bash
set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: cp-source-maps.sh <image-name> <output-dir>"
  exit 1
fi

IMAGE="$1"
OUTPUT_DIR="$2"
CONTAINER_NAME="tmp-$$"

docker create --name "$CONTAINER_NAME" "$IMAGE"
mkdir -p "$OUTPUT_DIR"
docker cp "$CONTAINER_NAME":/sourcemaps/. "$OUTPUT_DIR"/
docker rm "$CONTAINER_NAME"

echo "Source maps extracted to $OUTPUT_DIR:"
ls -la "$OUTPUT_DIR" | grep js.map