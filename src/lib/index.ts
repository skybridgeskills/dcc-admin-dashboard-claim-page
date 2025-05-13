import { env } from "$env/dynamic/public";
import * as crypto from 'node:crypto';

export async function getTenantConfig(origin: string) {
  const tenantKey = await sha1(origin)
  const configUrl = `https://${env.PUBLIC_S3_BUCKET ?? "dcc-brand-6e8f40c02581a52e"}.s3.amazonaws.com/${tenantKey}`;
  const config = await (await fetch(configUrl + "/config.json")).json();
  return { config, configUrl };
}

async function sha1(str: string): Promise<string> {
  const hash = crypto.createHash('sha1');
  hash.update(str);
  return hash.digest('hex');
}
