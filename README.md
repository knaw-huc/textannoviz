# Textannoviz

The `main` branch is the most up-to-date branch. Clone this branch if you want the most recent version of Textannoviz.

## Development

### First time

- Install dependencies

  ```
  npm ci --force
  ```

  Note: The `--force` is necessary due to Mirador depending on an older version of React.

- Rename `.env.example` to `.env`

### Start

```
npm start
```

- Open http://localhost:5173/ in browser

## Debug production build

Docker images include source maps, stored at `/sourcemaps`.

To debug a deployment:

- Extract source maps from image: `./scripts/cp-source-maps.sh <image> <output-dir>`
- Use in chrome debugger:
  - Check js and sourcemap hashes match
  - (Optional) Break on start: sources > event listener breakpoints > script > script first statement
  - Attach map to index: Sources > `index-<hash>.js` > right click > Add source map > `file:///absolute/path/to/index-<hash>.js.map`
  - Docs: https://developer.chrome.com/docs/devtools/developer-resources#load
