<script lang="ts">
	import { Kind, nip05, relayInit, type Event } from 'nostr-tools';
	import { onMount } from 'svelte';
	import KindBar from '../charts/KindBar.svelte';
	import { getKindCounts } from '../utils/nostr';
	import { kindMap } from '../utils/constants';

	// rt
	let pubkey = '3f503eef50d5b9f73af8d44ed380e4a3090e2c63631bffa9cd919bea38356a64';
	// fj
	// let pubkey = '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d';
	// Choose default relays by popularity according to nostr.band/stats
	// let relayName = 'wss://eden.nostr.land';
	let relayName = 'wss://relay.snort.social';
	// let relayName = 'wss://nostr.milou.lol';
	// let relayName = 'wss://relay.nvote.co';
	// let relayName = 'wss://brb.io';

	type KindCount = { kind: string; count: number };
	let counts: KindCount[] = [];

	onMount(async () => {
		const relay = relayInit(relayName);
		relay.on('connect', () => {
			console.log(`connected to ${relay.url}`);
		});
		relay.on('error', () => {
			alert(`failed to connect to ${relay.url}`);
		});
		await relay.connect();
		const events = await relay.list([{ kinds: [1, 3, 7], authors: [pubkey] }]);
		relay.close();
		console.log({ events });
		formatBarData(events);
	});

	function formatBarData(events: Event[]) {
		// get the count of each kind
		const countMap = getKindCounts(events);
		// convert map to named array for d3
		counts = Object.keys(kindMap).reduce<KindCount[]>((c, kind) => {
			const k = parseInt(kind) as keyof typeof kindMap;
			return [
				...c,
				{
					kind: kindMap[k],
					count: countMap[k]
				}
			];
		}, []);
	}
</script>

<p>Pubkey</p>
<input bind:value={pubkey} />
<p>Relay</p>
<input bind:value={relayName} />

{#if counts.length}
	<KindBar data={counts} />
{/if}
