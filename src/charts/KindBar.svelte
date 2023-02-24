<script lang="ts">
	import {
		axisBottom,
		axisLeft,
		max,
		scaleBand,
		scaleLinear,
		scaleOrdinal,
		schemeSet3,
		select,
		type BaseType,
		type Selection
	} from 'd3';
	import { onMount } from 'svelte';
	import debounce from 'just-debounce';

	export let data: { kind: string; count: number }[] = [];

	const margin = { top: 40, right: 20, left: 210, bottom: 50 };
	let svg: SVGElement;

	const delayOffset = 100;
	const duration = 1000;

	const handleResize = debounce(() => render(svgg, svg), 100);

	const color = scaleOrdinal(schemeSet3);

	let svgg: Selection<SVGGElement | BaseType, null, SVGElement, unknown>;
	onMount(() => {
		svgg = select(svg)
			.selectAll('g')
			.data([null])
			.join('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);
		// append axes but don't draw them yet
		svgg.append('g').attr('class', 'x axis');
		svgg.append('g').attr('class', 'y axis');
		render(svgg, svg);
	});

	function render(
		svgg: Selection<SVGGElement | BaseType, null, SVGElement, unknown>,
		svg: SVGElement
	) {
		const rect = svg.getBoundingClientRect(),
			width = rect.width,
			height = rect.height,
			innerWidth = width - margin.right - margin.left,
			innerHeight = height - margin.bottom - margin.top;

		const y = scaleBand()
			.domain(data.map(({ kind }) => kind))
			.rangeRound([innerHeight, 0])
			.paddingInner(0.05);
		const x = scaleLinear()
			.domain([0, max(data, (d) => d.count) || 0])
			.range([0, innerWidth]);
		const rects = svgg
			.selectAll('rect')
			.data(data)
			.join('rect')
			.attr('x', () => 0)
			.attr('y', ({ kind }) => y(kind) || '')
			.attr('height', () => y.bandwidth());

		rects
			.transition()
			.delay((_, i) => i * delayOffset)
			.duration(duration)
			.attr('width', (d) => x(d.count))
			.attr('fill', ({ count }) => color(String(count)))
			.attr('opacity', 0.7);

		rects
			.on('mouseover', function () {
				select('#tooltip').classed('hidden', false);
				select(this).transition().attr('opacity', 1);
			})
			.on('mouseout', function () {
				select('#tooltip').classed('hidden', true);
				select(this).transition().attr('opacity', 0.7);
			});

		// FIXME: Figure out proper TS
		select('.x.axis')
			.attr('transform', `translate(0, ${innerHeight})`)
			.transition()
			.call(axisBottom(x) as any);
		select('.y.axis').call(axisLeft(y) as any);
	}
</script>

<svelte:window on:resize={handleResize} />

<svg class="h-full flex-1" bind:this={svg} />

<div
	id="tooltip"
	class="absolute w-50 top-4 left-4 aspect-square bg-white rounded-lg pointer-events-none"
/>

<style lang="postcss">
	svg :global(.tick) {
		@apply text-lg;
	}
</style>
