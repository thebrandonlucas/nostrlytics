<script lang="ts">
	import { Kind, nip05, relayInit, type Event } from 'nostr-tools';
	import { onMount } from 'svelte';
	import KindBar from '../charts/KindBar.svelte';
	import { getUnixTime, subDays } from 'date-fns';

	// rt
	let pubkey = '3f503eef50d5b9f73af8d44ed380e4a3090e2c63631bffa9cd919bea38356a64';
	// fj
	// let pubkey = '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d';
	// let relayName = 'wss://eden.nostr.land';
	let relayName = 'wss://relay.snort.social';
	// let relayName = 'wss://nostr.milou.lol';
	// let relayName = 'wss://relay.nvote.co';

	let kindCounts: { kind: Kind; count: number }[] = [];

	onMount(async () => {
		const relay = relayInit(relayName);
		relay.on('connect', () => {
			console.log(`connected to ${relay.url}`);
		});
		relay.on('error', () => {
			alert(`failed to connect to ${relay.url}`);
		});
		await relay.connect();

		// let sub = relay.sub([
		// 	{
		// 		kinds: [1],
		// 		authors: [pubkey]
		// 	}
		// ]);

		// for when you want to continuously listen for new events
		// sub.on('event', (event: Event) => {
		// 	console.log('got event:', event);
		// });
		// Close subscription if relay notifies that we have all the events
		// sub.on('eose', () => {
		// 	console.log('all events sent, closing sub');
		// 	sub.unsub();
		// });

		const events = await relay.list([{ kinds: [1], authors: [pubkey] }]);

		console.log({ events });

		formatBarData(events);

		relay.close();
	});

	// Object.values on an enum returns a list of [name: string | value: any], where the
	// first half (0, (array.length / 2) - 1) are the <name>values and the
	// second half ((array.length / 2), array.length - 1) are the <value> values
	// This converts the Kind enum to an object of { kindName: kindValue }, i.e. { Metadata: 0, Text: 1, ... }
	const kindNamesValues = Object.values(Kind) as Array<string | number>;
	const kindMap: Record<string, number> = {};
	for (let i = 0; i < kindNamesValues.length / 2; i++) {
		const key = kindNamesValues[i];
		const valueIdx = kindNamesValues.length / 2 + i;
		// if we index correctly, first half is always string and second half always number
		const value = kindNamesValues[valueIdx] as number;
		kindMap[key] = value;
	}

	console.log({ kindMap });

	function formatBarData(events: Event[]) {
		// match the count of each kind to it's kind
		let kindCounts: Record<string, number> = {};
		Object.values(Kind).forEach((kind) => {
			kindCounts[kind] = 0;
		});
		events.forEach((event) => kindCounts[event.kind]++);

		console.log({ kindCounts });
		// kindCounts = kinds.map((kind) => {
		// 	let count = 0;
		// 	events.forEach((event) => event.kind === kind && count++);
		// 	return { kind, count };
		// });

		// console.log({ kindCounts });

		// console.log({ notes });
	}
</script>

<p>Pubkey</p>
<input bind:value={pubkey} />
<p>Relay</p>
<input bind:value={relayName} />

<!-- {#if notes}
	{#if kindCounts.length}
		<KindBar data={kindCounts} />
	{/if}
{/if} -->
