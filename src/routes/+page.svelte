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

	let kinds = [0, 1, 2, 3, 4, 5, 6, 7];
	let kindCounts: { kind: number; count: number }[] = [];

	let notes: Event[] = [];

	onMount(async () => {
		const relay = relayInit(relayName);
		relay.on('connect', () => {
			console.log(`connected to ${relay.url}`);
		});
		relay.on('error', () => {
			alert(`failed to connect to ${relay.url}`);
		});
		await relay.connect();

		let sub = relay.sub([
			{
				kinds: [1],
				authors: [pubkey]
			}
		]);

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

		relay.close();
	});

	function formatBarData() {
		// match the count of each kind to it's kind
		kindCounts = kinds.map((kind) => {
			let count = 0;
			notes.forEach((n) => n.kind === kind && count++);
			return { kind, count };
		});

		console.log({ notes });
	}

	$: notes.length && formatBarData();
</script>

<p>Pubkey</p>
<input bind:value={pubkey} />
<p>Relay</p>
<input bind:value={relayName} />

{#if notes}
	<!-- <p>{JSON.stringify(notes)}</p> -->
	{#if kindCounts.length}
		<KindBar data={kindCounts} />
	{/if}
{/if}
