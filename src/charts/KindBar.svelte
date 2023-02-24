<script lang="ts">
	import {
		axisBottom,
		axisLeft,
		max,
		scaleBand,
		scaleLinear,
		scaleOrdinal,
		schemeAccent,
		schemeSet2,
		schemeSet3,
		select
	} from 'd3';
	import { onMount } from 'svelte';

	export let data: { kind: string; count: number }[] = [];

	const margin = { top: 40, right: 20, left: 150, bottom: 50 };

	const width = 800,
		height = 400,
		innerWidth = width - margin.right - margin.left,
		innerHeight = height - margin.bottom - margin.top;

	const y = scaleBand()
		.domain(data.map(({ kind }) => kind))
		.rangeRound([innerHeight, 0])
		.paddingInner(0.05);
	const x = scaleLinear()
		.domain([0, max(data, (d) => d.count) || 0])
		.range([0, innerWidth]);

	const xAxis = axisBottom(x);
	const yAxis = axisLeft(y);

	function handleResize() {}

	const color = scaleOrdinal(schemeSet3);
	let chart;
	onMount(() => {
		chart = select('svg').append('g').attr('transform', `translate(${margin.left},${margin.top})`);

		const delayOffset = 100;
		const duration = 1000;
		chart
			.selectAll('rect')
			.data(data)
			.join('rect')
			.attr('x', (d) => 0)
			.attr('y', ({ kind }) => y(kind) || '')
			.attr('height', () => y.bandwidth())
			.transition()
			.delay((_, i) => i * delayOffset)
			.duration(duration)
			.attr('width', (d) => x(d.count))
			.attr('fill', ({ count }) => color(String(count)))
			.attr('opacity', '0.8');

		chart
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${innerHeight})`)
			.call(xAxis);
		chart.append('g').attr('class', 'y axis').call(yAxis);
	});
</script>

<svelte:window on:resize={handleResize} />

<div>
	<svg {width} {height} />
</div>

<!-- <style lang="postcss">
	div {
		@apply flex;
	}
</style> -->
