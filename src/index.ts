import useReflare from 'reflare';

declare global {
  const AZURE_OPENAI_MODEL_MAPPER: string
  const AZURE_OPENAI_ENDPOINT: string
  const AZURE_OPENAI_APIVERSION: string
}

const handleRequest = async (
  request: Request,
): Promise<Response> => {
  const reflare = await useReflare();

  const AzureOpenAIModelMapper: { [key: string]: string } = {};

  // Don't know how to do this in a better way
  let jsonPayload = {} as { [key: string]: any };
  try {
    jsonPayload = (await request.clone().json()) as { [key: string]: any };
  }
  catch (e) {
  }

  if (AZURE_OPENAI_MODEL_MAPPER) {
    const pairs = AZURE_OPENAI_MODEL_MAPPER.split(',');

    for (const pair of pairs) {
      const info = pair.split('=');

      if (info.length !== 2) {
        console.error(`error parsing AZURE_OPENAI_MODEL_MAPPER, invalid value ${pair}`);
      }

      AzureOpenAIModelMapper[info[0]] = info[1];
    }
  }

  reflare.push({
    path: '/v1/models',
    methods: ['GET'],
    upstream: {
      domain: 'httpstat.us',
      protocol: 'https',
      onRequest: (request: Request, url: string): Request => {
        const newURL = url.replace('/v1/models', '') + '/200';
        return new Request(newURL, request);
      },
      onResponse: (response: Response): Response => {
        const responseData = JSON.stringify({
          "object": "list",
          "data": [
            {
              "id": "gpt-3.5-turbo-0301",
              "object": "model",
              "created": 1677649963,
              "owned_by": "openai",
              "permission": [
                {
                  "id": "modelperm-abcde",
                  "object": "model_permission",
                  "created": 1679602000,
                  "allow_create_engine": false,
                  "allow_sampling": true,
                  "allow_logprobs": true,
                  "allow_search_indices": false,
                  "allow_view": true,
                  "allow_fine_tuning": false,
                  "organization": "*",
                  "group": null,
                  "is_blocking": false
                }
              ],
              "root": "gpt-3.5-turbo-0301",
              "parent": null
            }
          ]
        });

        response = new Response(responseData);
        response.headers.set('content-type', 'application/json');

        return response;
      },
    },
  });

  reflare.push({
    path: '/*',
    upstream: {
      domain: AZURE_OPENAI_ENDPOINT,
      protocol: 'https',
      onRequest: (request: Request, url: string): Request => {
        const modelValue = jsonPayload.model;
        const deployment = AzureOpenAIModelMapper[modelValue];

        if (!deployment) {
          console.error(`error parsing AZURE_OPENAI_MODEL_MAPPER, invalid model ${modelValue}`);
        }

        const newURL = url.replace('/v1/', `/openai/deployments/${deployment}/`) + (url.includes('?') ? '&' : '?') + `api-version=${AZURE_OPENAI_APIVERSION}`;
        const token = request.headers.get('Authorization')?.replace('Bearer ', '');

        request = new Request(newURL, request);
        request.headers.set('api-key', token ?? '');
        request.headers.delete('Authorization');

        return request
      },
    },
  });

  return reflare.handle(request);
};

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
