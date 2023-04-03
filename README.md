<h1 align="center">Welcome to azure-openai-proxy 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> 🚀 azure-openai-proxy
> Copy From reflare-demo
## Install wrangler
```dotnetcli
npm install -g wrangler

wrangler login
```

## Install

```sh
npm install && npm run build
```

## Local Development

```sh
npm run build && npm run dev
```

## modify config

| Parameters                 | Description                                                                                                                                                                                                                                                                                                    | Default Value                                                           |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| AZURE_OPENAI_ENDPOINT      | Azure OpenAI Endpoint, usually looks like https://{custom}.openai.azure.com. Required.                                                                                                                                                                                                                         |                                                                         |
| AZURE_OPENAI_APIVERSION    | Azure OpenAI API version. Default is 2023-03-15-preview.                                                                                                                                                                                                                                                       | 2023-03-15-preview                                                      |
| AZURE_OPENAI_MODEL_MAPPER  | A comma-separated list of model=deployment pairs. Maps model names to deployment names. For example, `gpt-3.5-turbo=gpt-35-turbo`, `gpt-3.5-turbo-0301=gpt-35-turbo-0301`. If there is no match, the proxy will pass model as deployment name directly (in fact, most Azure model names are same with OpenAI). | `gpt-3.5-turbo=gpt-35-turbo,gpt-4=gpt-4,gpt-4-32k=gpt-4-32k` |

## Usage

```sh
npm run deploy
```

## Add custom domain
modify `Route` in `wrangler.toml`

```toml
routes = [
	{ pattern = "Your Custom Domain", custom_domain = true },
]
```

## Author

* Github: [@billzhuang](https://github.com/billzhuang)

## Show your support

Give a ⭐️ if this project helped you!
