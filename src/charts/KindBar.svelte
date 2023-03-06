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
	import { Kind, type Event } from 'nostr-tools';
	import { filterEvents } from '../utils/nostr';
	import { kindToTitle, titleToKind } from '../utils/constants';

	export let data: { kind: string; count: number }[] = [];
	export let events: Event[];
	export let selectedEvents: Event[];
	export let selectedKind: Kind;

	const margin = { top: 40, right: 20, left: 240, bottom: 50 };
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

	$: data && render(svgg, svg);

	function getLabel(kind: number) {
		return `${kind} (${kindToTitle[kind as keyof typeof kindToTitle]})`;
	}

	function render(
		svgg: Selection<SVGGElement | BaseType, null, SVGElement, unknown>,
		svg: SVGElement
	) {
		const minHeight = 400;
		const rect = svg.getBoundingClientRect(),
			width = rect.width,
			height = rect.height < minHeight ? minHeight : rect.height,
			innerWidth = width - margin.right - margin.left,
			innerHeight = height - margin.bottom - margin.top;

		const y = scaleBand()
			.domain([0, 1, 2, 3, 4, 5, 7, 9734, 9735, 10002].map((d) => getLabel(d)))
			.rangeRound([innerHeight, 0])
			.paddingInner(0.05);
		const x = scaleLinear()
			.domain([0, max(data, (d) => d.count) || 0])
			.range([0, innerWidth]);
		const rects = svgg
			.selectAll('rect')
			.data(data)
			.join('rect')
			.attr('class', 'bar')
			.attr('x', () => 0)
			.attr('y', ({ kind }) => y(getLabel(titleToKind[kind as keyof typeof titleToKind])) || '')
			.attr('height', () => y.bandwidth());
		rects
			.transition('extend')
			.delay((_, i) => i * delayOffset)
			.duration(duration)
			.attr('width', (d) => x(d.count))
			.attr('fill', ({ kind }) => color(String(kind)))
			.attr('opacity', 0.9);

		rects.append('title').text(({ kind, count }) => `${kind}: ${count}`);

		rects
			.on('mouseover', function () {
				select('#tooltip').classed('hidden', false);
				select(this).transition().duration(50).attr('opacity', 1);
			})
			.on('mouseout', function () {
				select('#tooltip').classed('hidden', true);
				select(this).transition().duration(50).attr('opacity', 0.9);
			})
			.on('click', function (_, { kind }) {
				selectedKind = Kind[kind as keyof typeof Kind];
				selectedEvents = filterEvents(Kind[kind as keyof typeof Kind], events);
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

<div class="h-full">
	<svg class="h-full w-full" bind:this={svg} />
</div>

<div
	id="tooltip"
	class="absolute w-50 top-4 left-4 aspect-square bg-white rounded-lg pointer-events-none"
/>

<style lang="postcss">
	svg :global(.tick) {
		@apply text-lg;
	}
	svg :global(.bar) {
		@apply cursor-pointer;
	}
</style>
