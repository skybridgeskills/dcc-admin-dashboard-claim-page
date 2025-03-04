import { defineConfig, envField } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
const config = {
    integrations: [tailwind()],
}

export default defineConfig(config);
