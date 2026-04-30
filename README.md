# Textannoviz

The `main` branch is the most up-to-date branch. Clone this branch if you want the most recent version of Textannoviz.

## Development

### First time

- Install dependencies

  ```
  npm ci
  ```

- Rename `.env.example` to `.env`

### Start

```
npm start
```

- Open http://localhost:5173/ in browser

### Run dev container

To build and run a docker image locally, with a proxy and project config endpoint, run `docker:build:dev`:

```shell
npm run docker:build:dev
cd deploy/dev
docker compose up
```

Open: http://localhost:5183/app/
