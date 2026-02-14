import { client } from '@/api/generated/client.gen';
import { env } from '@/config/env';

client.setConfig({
  baseUrl: env.VITE_API_URL,
});
