<script lang="ts">
	import { onMount } from 'svelte';
	import { scaleBand, scaleLinear } from 'd3';
	import type { UniqueVisitorData } from '$lib/types/unique-vistors';
	import { generateInterpolatedArray } from '$lib/utils/math';
	import type { ChartTick } from '$lib/types/chart';

	export let points: UniqueVisitorData[];
    export let xTicks: ChartTick[] = [];
	export let yTicks: ChartTick[] = [];
    export let colorScale = ["#FFECE3", "#800020"];

	let svg: SVGElement;
	let width = 1000; // dynamic width, which changes onMount and when the window is resized
	let height = 900; // same as width

	const padding = { top: 20, right: 40, bottom: 40, left: 30 }; // padding for the heatmap chart

    let tooltip = {
        show: false,
        xPos : 0,
        yPos : 0,
        visitors : 0,
        country : '',
        hour : 0
    }

    let tooltipWidth = 0; // dynamic tooltip width
    $: tooltipOffsetX = tooltipWidth / 2; // needed to place the tooltip in the middle
    const tooltipOffsetY = 20; // offset from the top of the heatmap data point

    $: maxValue = Math.max(...points.map((point) => point.value));
    $: xTicksValues = xTicks.map((tick) => tick.value);
    $: yTicksValues = yTicks.map((tick) => tick.value);

	$: xScale = scaleBand()
		.range([padding.left, width - padding.right])
        .domain(xTicksValues);

	$: yScale = scaleBand()
		.range([height - padding.bottom, padding.top])
        .domain(yTicksValues);

    // as we place the heat map circles not on top of the lines, we need one my line at the x-end and y-end
    $: yExtendedLinePos = (yScale(yTicksValues[0]) ?? 0) + yScale.bandwidth(); 
    $: xExtendedLinePos = (xScale(xTicksValues[xTicksValues.length - 1]) ?? 0) + xScale.bandwidth();
    $: yLastPos = yScale(yTicksValues[yTicksValues.length - 1]) ?? 0;

    $: heatmapColor = scaleLinear()
        .range(colorScale)  // supposed to be Iterable<number>, but works with string[] for this case
        .domain(generateInterpolatedArray(colorScale.length, maxValue));

	onMount(resize);

	function resize() {
		({ width, height } = svg.getBoundingClientRect());
	}

	function handleShowTooltip(data: UniqueVisitorData) {
        tooltip = {
            show : true,
            xPos : (xScale(data.hour.toString()) ?? 0) + xScale.bandwidth() / 2 - tooltipOffsetX,
            yPos : (yScale(data.country) ?? 0) + yScale.bandwidth() / 2 + tooltipOffsetY,
            visitors : data.value,
            country : data.country,
            hour : data.hour
        };
    }

    function handleHideTooltip() {
        tooltip.show = false;
    }
</script>

<!-- keep it responsive -->
<svelte:window on:resize={resize} />

<div class="relative h-full">
    <!-- tooltip -->
    <div class="absolute opacity-0 w-auto scale-0 h-auto px-4 py-3 bg-white text-sm shadow-[2px_2px_8px_rgba(0,0,0,0.2)] rounded pointer-events-none flex flex-col transition-all duration-200 ease-in-out after:width-0 after:left-[calc(50%-8px)] after:top-[-8px] after:content-[' '] after:absolute after:border-8 after:border-x-transparent after:border-t-transparent after:border-b-white after:mt-[-8px]" 
         class:opacity-100={tooltip.show} 
         class:scale-100={tooltip.show}
         style="left: {tooltip.xPos}px; top: {tooltip.yPos}px;" aria-label="tooltip" role="tooltip"
         bind:clientWidth={tooltipWidth}
    > 
        <div class="grid grid-flow-row-dense grid-cols-[1fr_30px] gap-x-2 text-wtgrey-200 text-right">
            <span class="">Unique Visitors:</span>
            <span class="font-bold">{tooltip.visitors}</span>
       
            <span class="">Country:</span>
            <span class="font-bold">{tooltip.country}</span>

            <span class="">Hour:</span>
            <span class="font-bold">{tooltip.hour}</span>
        </div>
    </div>

    <svg bind:this={svg}>
        <!-- y axis -->
        <g class="axis y-axis">
            <g class="tick" transform="translate(0, {yExtendedLinePos})">
                <line x1={padding.left} x2={xExtendedLinePos} />
            </g>
            {#each yTicks as tick}
                <g class="tick tick-{tick.value}" transform="translate(0, {yScale(tick.value)})">
                    {#if xTicksValues.length > 0}
                        <line x1={padding.left} x2={xExtendedLinePos} />
                    {/if}
                    {#if tick.label}
                        <text x={padding.left - 8} y="{yScale.bandwidth() / 2 + 4}">{tick.label}</text>
                    {/if}
                </g>
            {/each}
        </g>

        <!-- x axis -->
        <g class="axis x-axis">
            {#each xTicks as tick}
                <g class="tick" transform="translate({xScale(tick.value)},0)">
                    {#if yTicksValues.length > 0}
                        <line y1={yExtendedLinePos} y2={yLastPos} />
                    {/if}
                    {#if tick.label}
                        <text y={height - padding.bottom + 16} x="{xScale.bandwidth() / 2}">{tick.label}</text>
                    {/if}
                </g>
            {/each}
            <g class="tick" transform="translate({xExtendedLinePos},0)">
                <line y1={yExtendedLinePos} y2={yLastPos} />
            </g>
        </g>

        <!-- data points -->
        {#each points as point}
            {@const xPos = (xScale(point.hour.toString()) ?? 0) + xScale.bandwidth() / 2}
            {@const yPos = (yScale(point.country) ?? 0) + yScale.bandwidth() / 2}
            <circle 
                r="10"
                cx={xPos} 
                cy={yPos} 
                fill={heatmapColor(point.value).toString()}
                on:mouseover={() => handleShowTooltip(point)}
                on:focus={() => handleShowTooltip(point)}
                on:mouseout={handleHideTooltip}
                on:blur={handleHideTooltip}
                role="cell"
                aria-label="data point"
                class="cursor-pointer origin-center hover:stroke-wtgrey-95 hover:stroke-2 hover:scale-90 focus:stroke-wtgrey-95 focus:stroke-2 focus:scale-90"
                style="transform-box: fill-box;"
                tabindex="0"
                />
        {/each}
    </svg>
</div>

<style>
	svg {
		width: 100%;
		height: 100%;
	}

	.tick line {
		stroke: #F0EFEF;
	}

	text {
		font-size: 12px;
		fill: #999;
	}

	.x-axis text {
		text-anchor: middle;
	}

	.y-axis text {
		text-anchor: end;
	}
</style>
