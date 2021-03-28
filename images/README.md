# Images

> This folder contains images (original and optimized).

<!-- toc -->

- [Development](#development)

<!-- tocstop -->

Even though the optimized images are just a build artifact,
they are stored in project history because generating them takes a long time.
And I don't wait to waste CI time (and wait for it) an hour for each commit/PR.

## Development

```sh
$ npm ci
$ # optionally: npm run clean
$ npm run build
```
