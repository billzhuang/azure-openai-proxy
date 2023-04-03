import useReflare from 'reflare';

const handleRequest = async (
  request: Request,
): Promise<Response> => {
  const reflare = await useReflare();

  reflare.push({
    path: '/v1/models',
    methods: ['GET'],
    upstream: {
      domain: 'httpstat.us',
      protocol: 'https',
      onRequest: (request: Request, url: string): Request => {
        let newURL = url.replace('/v1/models', '');
        request = new Request(newURL+'/200', request);
        return request
      },
      onResponse: (response: Response): Response => {
        response = new Response(JSON.stringify({
          "object": "list",
          "data": [
            {
              "id": "gpt-3.5-turbo-0301",
              "object": "model",
              "created": 1677649963,
              "owned_by": "openai",
              "permission": [
                {
                  "id": "modelperm-vrvwsIOWpZCbya4ceX3Kj4qw",
                  "object": "model_permission",
                  "created": 1679602087,
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
        }));

        response.headers.delete('content-type');
        response.headers.set('content-type', 'application/json');

        return response;
      },
    },
  });

  reflare.push({
    path: '/*',
    upstream: {
      domain: 'trygpt.openai.azure.com',
      protocol: 'https',
      onRequest: (request: Request, url: string): Request => {
        // Modifies the URL of the request
        let newURL = url.replace('/v1/', '/openai/deployments/gpt35turbo/');
        if (newURL.indexOf('?') > 0) {
          newURL += '&api-version=2023-03-15-preview'
        } else {
          newURL += '?api-version=2023-03-15-preview'
        }

        request = new Request(newURL, request);
        const token = request.headers.get('Authorization')?.replace('Bearer ', '')
                
        request.headers.set('api-key', token ?? '')
        request.headers.delete('Authorization')        

        return request
      },
    },
  });

  return reflare.handle(request);
};

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
