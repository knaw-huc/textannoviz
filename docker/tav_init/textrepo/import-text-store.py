#! /usr/bin/env python3

import json
import requests
import os

def main():
    repo = os.environ['TEXTREPO_HOST']
    store = os.environ['TEXT_STORE_PATH']
    url = repo+"/rest/types"
    headers = {'Content-Type': 'application/json'}

    data = {'name':'anchor','mimetype':'application/json+anchor'}
    requests.post(url, headers=headers, json=data)

    with open(store) as file:
        store = json.load(file)
        for res in store['_resources']:
            external_id = res['resource_id']
            task = repo + "/task/import/documents/" + external_id + "/anchor"
            req = requests.Request('POST', url=task, params={'allowNewDocument': 'true'},
                                   files = {'contents': (external_id, json.dumps(res))}).prepare()
            with requests.Session() as sess:
                resp = sess.send(req)
                if(resp.status_code != 200 and resp.status_code != 201):
                    raise Exception('Expected 200 or 201 but got {code}'.format(code=resp.status_code))
                version_id = resp.json().get('versionId')
                print(version_id)

if __name__ == "__main__":
    main()
