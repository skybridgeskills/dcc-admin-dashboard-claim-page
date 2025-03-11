import { defineConfig, passthroughImageService } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import svelte from "@astrojs/svelte"

// https://astro.build/config
const config = {
  integrations: [tailwind(), svelte()],
  image: {
    service: passthroughImageService()
  }
}

export default defineConfig(config);
