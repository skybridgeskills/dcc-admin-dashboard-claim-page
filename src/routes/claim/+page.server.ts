import { getTenantConfig } from '$lib';
import type { PageServerLoad } from '../$types';

import QRCode from 'qrcode';
export const load: PageServerLoad = async ({ url, parent }) => {
	const token = url.searchParams.get('token');
  const { config, configUrl } = await getTenantConfig(url.origin)
  const config_ =  {
    logo_src: configUrl + "/logo.png",
    sponsor_logo_src: configUrl + "/sponsor_logo.png",
    ...config,
  };

	const res = await fetch(`${config.api}/get-credential-links`, {
		headers: { Authorization: `Bearer ${token}` }
	});

	if(!res.ok) {
		console.log(res) // TODO take this out
		throw Error("Error with response")
	}

	const {
		links,
		metadata: { credentialName, earnerName, awardedDate: _awardedDate, issuedDate: _issuedDate }
	} = (await res.json()) as {
		links: {
			retrievalId: string;
			directDeepLink: string;
			vprDeepLink: string;
			chapiVPR: {
				challenge: string;
				domain: string;
				interact: {
					service: [{ serviceEndpoint: string; type: string }, { type: string }];
				};
				query: { type: string };
			};
		}[];
		metadata: {
			credentialName: string;
			earnerName: string;
			awardedDate: string;
			issuedDate: string;
		};
	};
	const awardedDate = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	}).format(new Date(_awardedDate));
	const issuedDate = new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	}).format(new Date(_issuedDate));

	const qrDeepLink = links[0]?.directDeepLink;

	const qrDataUri = await QRCode.toDataURL(qrDeepLink);

	return {
		token,
		qrDataUri,
		qrDeepLink,
		links,
		credentialName,
		info1: `Awarded to ${earnerName} on ${awardedDate}`,
		info2: `Issued on ${issuedDate}`,
		earnerName,
		awardedDate,
		issuedDate,
		...config_,
	};
};
