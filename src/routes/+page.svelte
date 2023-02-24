<script lang="ts">
	import { Kind, nip05, relayInit, type Event } from 'nostr-tools';
	import { onMount } from 'svelte';
	import KindBar from '../charts/KindBar.svelte';
	import { getKindCounts } from '../utils/nostr';
	import { kindMap } from '../utils/constants';
	import Input from '../components/Input.svelte';

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
		const n = await nip05.queryProfile('ratiotile@getalby.com');
		console.log({ n });
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

<div class="flex justify-between mx-8 m-4">
	<a href="#" class="text-2xl font-extrabold text-purple-300">Nostrlytics</a>
</div>

<p class="text-center">Enter a pubkey and relay to visualize statistics on it!</p>

<div
	class="flex justify-center mt-10
"
>
	<form class="flex gap-2 w-1/2">
		<div class="grow">
			<p>Hex pubkey, npub, or nip-05</p>
			<Input bind:value={pubkey} wide placeholder="Enter pubkey, npub, or nip-05" />
		</div>
		<div class="grow">
			<p>Relay Socket</p>
			<Input
				bind:value={relayName}
				wide
				placeholder="Enter relay websocket (i.e. rwwss://eden.nostr.land)"
				pattern={'^wss?://(?:[a-zA-Z0-9-]+.)+[a-zA-Z]{2,}$'}
			/>
		</div>
		<button
			class="p-1 bg-purple-500 rounded-md hover:bg-purple-600 transition-all duration-300 self-end"
			type="submit">Connect!</button
		>
	</form>
</div>

<div class="flex justify-center margin-auto mx-20 h-[75vh]">
	{#if !counts.length}
		<p class="m-auto text-blue-300">Loading...</p>
	{:else}
		<KindBar data={counts} />
	{/if}
</div>
