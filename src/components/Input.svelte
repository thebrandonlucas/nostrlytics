<script lang="ts">
	interface $$Props {
		pattern?: string;
		value: string;
	}
	export let pattern = '';
	export let value = '';
</script>

<input class="p-1 rounded-md text-gray-900 " bind:value {pattern} />
