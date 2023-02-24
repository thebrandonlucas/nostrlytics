import { kindMap } from './constants';
import type { Event } from 'nostr-tools';

type CountMap = Record<keyof typeof kindMap, number>;

export function getKindCounts(events: Event[]) {
	const map: CountMap = <CountMap>{};
	Object.keys(kindMap).map((kind) => {
		const k = parseInt(kind) as keyof typeof kindMap;
		map[k] = 0;
	});
	events.forEach((event) => {
		map[event.kind]++;
	});
	return map;
}
