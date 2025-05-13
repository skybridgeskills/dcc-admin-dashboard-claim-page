import { getTenantConfig } from "$lib";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }): Promise<App.Config> => {
  const { config, configUrl } = await getTenantConfig(url.origin)
  return {
    logo_src: configUrl + "/logo.png",
    sponsor_logo_src: configUrl + "/sponsor_logo.png",
    ...config,
  };
}

