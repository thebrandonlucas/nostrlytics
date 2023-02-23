<script lang="ts">
	import * as d3 from 'd3';
	import { axisBottom, axisLeft, max, range, scaleBand, scaleLinear, select } from 'd3';
	import type { Kind } from 'nostr-tools';
	import { onMount } from 'svelte';

	export let data: { kind: Kind; count: number }[] = [];

	$: console.log('data', data);

	const margin = { top: 40, right: 20, left: 20, bottom: 50 };

	const width = 600,
		height = 300,
		innerWidth = width - margin.right - margin.left,
		innerHeight = height - margin.bottom - margin.top;

	const x = scaleBand<number>()
		.domain(range(data.length))
		.rangeRound([0, innerWidth])
		.paddingInner(0.05);
	const y = scaleLinear()
		.domain([0, max(data, (d) => d.count) || 0])
		.range([innerHeight, 0]);

	const xAxis = axisBottom(x);
	const yAxis = axisLeft(y);

	let chart;
	onMount(() => {
		chart = select('svg').append('g').attr('transform', `translate(${margin.top},${margin.left})`);

		chart
			.selectAll('rect')
			.data(data)
			.join('rect')
			.attr('x', (_, i) => (x(i) || 0) + x.bandwidth() / 2)
			.attr('y', (d) => innerHeight - y(d.count))
			.attr('width', () => x.bandwidth())
			.attr('height', (d) => y(d.count));

		chart
			.append('g')
			.attr('class', 'x axis')
			.attr('transform', `translate(0, ${innerHeight})`)
			.call(xAxis);
		chart.append('g').attr('class', 'y axis').attr('transform', `translate(0, 0)`).call(yAxis);
	});
</script>

<svg {width} {height} />
