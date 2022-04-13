#!/usr/bin/env bash
set -x
set -e

cd /usr/src/app/textrepo
pip install -r requirements.txt

if [[ ! -v TEXTREPO_HOST ]]; then
    echo "TEXTREPO_HOST is not set"
fi
if [[ ! -v TEXT_STORE_PATH ]]; then
    echo "TEXT_STORE_PATH is not set"
fi
VERSION_ID=$(python ./import-text-store.py)

echo "VERSION_ID: [${VERSION_ID}]"

cd /usr/src/app
pip install -r requirements.txt
pip install .

if [[ ! -v ANNO_STORE_PATH ]]; then
    echo "ANNO_STORE_PATH is not set"
fi
python ./scripts/convert_to_web_annotations.py $ANNO_STORE_PATH --textrepo-base-url http://localhost:8000/textrepo

python ./scripts/export_to_elucidate.py -e http://eltav:8080/annotation -c "$VERSION_ID"

