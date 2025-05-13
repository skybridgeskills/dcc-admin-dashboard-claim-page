import { env } from "$env/dynamic/public";
import type { PageServerLoad } from "./$types";
import * as crypto from 'node:crypto';

export const load: PageServerLoad = async ({ url }): Promise<Config> => {
  const tenantKey = await sha1(url.origin)
  const configUrl = `https://${env.PUBLIC_S3_BUCKET ?? "dcc-brand-6e8f40c02581a52e"}.s3.amazonaws.com/${tenantKey}`;
  console.log(configUrl)
  const config = await (await fetch(configUrl + "/config.json")).json();
  return {
    logo_src: configUrl + "/logo.png",
    sponsor_logo_src: configUrl + "/sponsor_logo.png",
    ...config,
  };
}

async function sha1(str: string): Promise<string> {
  const hash = crypto.createHash('sha1');
  hash.update(str);
  return hash.digest('hex');
}

