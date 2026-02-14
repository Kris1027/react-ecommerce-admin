import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: process.env.API_URL
    ? `${process.env.API_URL}/docs-json`
    : 'http://localhost:3000/docs-json',
  output: 'src/api/generated',
  plugins: [
    '@hey-api/client-fetch',
    '@hey-api/sdk',
    '@hey-api/typescript',
    {
      name: '@tanstack/react-query',
      queryOptions: true,
      mutationOptions: true,
    },
    'zod',
  ],
});
