<script lang="ts">
	interface $$Props {
		value: string;
		pattern?: string;
		placeholder?: string;
		wide?: boolean;
	}
	export let value = '';
	export let wide = false;
</script>

<input
	class={`p-1 rounded-md text-gray-900 ${wide ? 'w-full' : ''}`}
	bind:value
	{...$$restProps}
	on:change
/>
