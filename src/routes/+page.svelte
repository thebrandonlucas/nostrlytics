<script lang="ts">
	import { Kind, relayInit, type Event as NostrEvent } from 'nostr-tools';
	import KindBar from '../charts/KindBar.svelte';
	import { getKindCounts, getPubkey } from '../utils/nostr';
	import { kindToTitle } from '../utils/constants';
	import Input from '../components/Input.svelte';

	// Can be hex user, npub (nip-19), or internet identifier (nip-05)
	let userId = '';
	let relayName = 'wss://relay.damus.io';
	let loading = false;
	let error: Error;

	type KindCount = { kind: string; count: number };
	let counts: KindCount[] = [];
	let events: NostrEvent[] = [];
	let selectedEvents: NostrEvent[] = [];
	let selectedKind: Kind;

	async function submit() {
		loading = true;
		try {
			counts = [];
			const pubkey = await getPubkey(userId);
			// TODO: If they use nip-05 and have relays added, we should automatically grab those relays and connect to them
			// FIXME: Getting Relay results is very finicky with this method, why?
			const relay = relayInit(relayName);
			relay.on('connect', () => {
				console.log(`connected to ${relay.url}`);
			});
			relay.on('error', () => {
				alert(`failed to connect to ${relay.url}`);
			});
			await relay.connect();
			events = await relay.list([
				{ kinds: [0, 1, 2, 3, 4, 5, 7, 9734, 9735, 10002], authors: [pubkey] }
				// TODO: optionally show more kinds
				// { kinds: [...Object.keys(kindToTitle).map((k) => parseInt(k))], authors: [pubkey] }
			]);
			relay.close();
			formatBarData(events);
		} catch (e) {
			console.error(String(e));
			alert(String(e));
			error = new Error(String(e));
		}
		loading = false;
	}

	function formatBarData(events: NostrEvent[]) {
		// get the count of each kind
		const countMap = getKindCounts(events);
		// convert map to named array for d3
		counts = Object.keys(kindToTitle).reduce<KindCount[]>((c, kind) => {
			const k = parseInt(kind) as keyof typeof kindToTitle;
			return [
				...c,
				{
					kind: kindToTitle[k],
					count: countMap[k]
				}
			];
		}, []);
	}

	$: disabled = !(userId && relayName);
	$: noEventsOnRelay = counts.length && counts.reduce((sum, { count }) => sum + count, 0) == 0;
	// TODO: on-click of the y axis, user goes to Explanation of kind that was clicked!
</script>

<div class="flex justify-between mx-8 m-4">
	<a
		target="_blank"
		rel="noreferrer"
		href="https://github.com/thebrandonlucas/nostrlytics"
		class="text-2xl font-extrabold text-purple-300">Nostrlytics</a
	>
</div>

<p class="text-center">Gain insights about your nostr data</p>

<div
	class="flex justify-center mt-10
"
>
	<form on:submit|preventDefault={submit} class="flex gap-2 w-1/2">
		<div class="grow">
			<p>Hex user, npub, or nip-05</p>
			<!-- Ensure input is either hex pub, npub, or nip05 -->
			<Input
				bind:value={userId}
				wide
				placeholder="Enter hex pub, npub, or nip-05"
				pattern={'(?:[0-9a-fA-F]{64}|npub[0-9A-Za-z]{59}|^([a-zA-Z0-9_-]+@)?[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)*?.[a-zA-Z]{2,18}'}
			/>
		</div>
		<div class="grow">
			<p>Relay websocket</p>
			<Input
				bind:value={relayName}
				wide
				placeholder="wss://eden.nostr.land"
				pattern={'^wss?://(?:[a-zA-Z0-9-]+.)+[a-zA-Z]{2,}$'}
			/>
		</div>
		<button
			{disabled}
			class={`${
				disabled ? 'bg-gray-500 hover:bg-gray-500' : ''
			} p-1 bg-purple-500 rounded-md hover:bg-purple-600 transition-all duration-300 self-end`}
			>Connect!</button
		>
	</form>
</div>

<div class="flex justify-center items-center my-auto mx-20 h-[75vh]">
	{#if loading}
		<p class="text-blue-300">Loading...</p>
	{:else if error}
		<div>
			<p>Error! Try again</p>
			<p>{JSON.stringify(error)}</p>
		</div>
	{:else if !counts.length}
		<p>
			Enter your nostr <strong>hex pub, npub, or nip-05</strong> and a <strong>relay</strong> you post
			to!
		</p>
	{:else if noEventsOnRelay}
		<p>Looks like you don't have any events on this relay (or my code is broken!)</p>
	{:else}
		<div class="flex flex-col w-full h-full text-center">
			<KindBar data={counts} bind:selectedEvents bind:selectedKind {events} />

			{#if !selectedEvents.length}
				<p>Click on an element to view nostr events</p>
			{:else}
				<div>
					<details>
						<summary
							>Show nostr events for: {kindToTitle[selectedKind]} (kind {selectedKind})</summary
						>
						<pre class="text-left"><code>{JSON.stringify(selectedEvents, null, 4)}</code></pre>
					</details>
				</div>
			{/if}
		</div>
	{/if}
</div>
