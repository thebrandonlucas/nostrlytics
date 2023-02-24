import { kindToTitle } from './constants';
import { Kind, nip05, nip19, type Event } from 'nostr-tools';

type CountMap = Record<keyof typeof kindToTitle, number>;

export function getKindCounts(events: Event[]) {
	const map: CountMap = <CountMap>{};
	Object.keys(kindToTitle).map((kind) => {
		const k = parseInt(kind) as keyof typeof kindToTitle;
		map[k] = 0;
	});
	events.forEach((event) => {
		map[event.kind]++;
	});
	return map;
}

// Check that user entered valid pubkey, npub, or nip-05
export async function getPubkey(userId: string) {
	const rxHex = /^[0-9a-fA-F]{64}$/;
	const rxNpub = /^npub[0-9A-Za-z]{59}$/;
	// Match emails, subdomains, or just the domain if the user is default (i.e. "_" user)
	const rxNip05 = /^([a-zA-Z0-9_-]+@)?[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*?\.[a-zA-Z]{2,18}$/;
	if (rxHex.test(userId)) {
		return userId;
	} else if (rxNpub.test(userId)) {
		return nip19.decode(userId).data.toString();
	} else if (rxNip05.test(userId)) {
		const result = await nip05.queryProfile(userId);
		if (!result) {
			throw new Error(
				`Failed to retrieve nip-05 identifier: "${userId}". Are you sure you spelled it correctly?`
			);
		}
		return result.pubkey;
	}
	throw new Error(`Oops! "${userId}" doesn't match hex pubkey, npub, or nip-05`);
}

export function filterEvents(kind: Kind, events: Event[]) {
	console.log({ events });
	return events.filter((e) => kind === e.kind);
}
