import { defineConfig, passthroughImageService } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
const config = {
  integrations: [tailwind()],
  image: {
    service: passthroughImageService()
  }
}

export default defineConfig(config);
