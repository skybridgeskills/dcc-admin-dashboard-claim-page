import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const basePath = import.meta.env.BASE_PATH

// https://astro.build/config
const config = {
    integrations: [tailwind()]
}
if (basePath) config.base = basePath

export default defineConfig(config);
