![Header](https://raw.githubusercontent.com/xiaoyang-sde/reflare/master/.github/img/header.jpg)

:rocket: The template to deploy Reflare to [Cloudflare Workers](https://developers.cloudflare.com/workers/). The `src/index.ts` file contains the route definitions of Reflare. The documentation of Reflare can be found [here](https://github.com/xiaoyang-sde/reflare).

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xiaoyang-sde/reflare-template)

## Installation

[Install `wrangler` CLI](https://github.com/cloudflare/wrangler#installation) and authorize `wrangler` with Cloudflare account.

```console
npm install -g wrangler

wrangler login
```

Generate a new project from [reflare-template](https://github.com/xiaoyang-sde/reflare-template) and install the dependencies.

```console
npm init cloudflare reflare-app https://github.com/xiaoyang-sde/reflare-template
cd reflare-app
npm install
```

Edit or add route definitions in `src/index.ts`. Please read the examples and route definition section below for more details.

- Run `npm run dev` to preview Reflare with local development server provided by [Miniflare](https://miniflare.dev).
- Run `npm run deploy` to publish Reflare on Cloudflare Workers.
