<script lang="ts">
	import { onMount } from 'svelte';
	import { scaleBand, scaleLinear } from 'd3';
	import type { TooltipData } from '$lib/types/tooltip';
	import { generateInterpolatedArray } from '$lib/utils/math';
	import type { ChartData, ChartTick, LineMarker } from '$lib/types/chart';
    import ChartTooltip from '$lib/components/ChartTooltip.svelte';

	export let data: ChartData[];
    export let xTicks: ChartTick[] = [];
	export let yTicks: ChartTick[] = [];
    export let colorScale = ["#FFECE3", "#800020"];
	export let width = 1000; // dynamic width, which changes onMount and when the window is resized
	export let height = 900; // same as width
	export let padding = { top: 20, right: 0, bottom: 40, left: 30 }; // padding for the heatmap chart
    export let tooltipOffsetY = 20; // offset from the top of the heatmap data point
    export let verticalMarkers: LineMarker[] = [];
    export let getTooltipData: (data: ChartData) => TooltipData[] = () => [];
    export let displayTotals = false;

	let svg: SVGElement;
    let tooltipShow = false;
    let tooltipPosX = 0;
    let tooltipPosY = 0;
    let tooltipData: TooltipData[] = [];
    let tooltipWidth = 0; // dynamic tooltip width
    $: displayTotalsPaddingRight = padding.right + (displayTotals ? 40 : 0);

    $: tooltipOffsetX = tooltipWidth / 2; // needed to place the tooltip in the middle
    $: maxValue = Math.max(...data.map((data) => data.value));
    $: xTicksValues = xTicks.map((tick) => tick.value);
    $: yTicksValues = yTicks.map((tick) => tick.value);
    $: totalsY = displayTotals ? data.reduce((acc: { [key: string]: number }, curr: ChartData) => { 
        acc[curr.yValue] = (acc[curr.yValue] ?? 0) + curr.value; 
        return acc; 
    }, {}) : {};
    $: totalsMaxY = displayTotals ? Math.max(...Object.values(totalsY)) : 0;

	$: xScale = scaleBand()
		.range([padding.left, width - displayTotalsPaddingRight])
        .domain(xTicksValues);

	$: yScale = scaleBand()
		.range([height - padding.bottom, padding.top])
        .domain(yTicksValues);

    // calculating the coordinates of the lines
    $: yExtendedLinePos = (yScale(yTicksValues[0]) ?? 0) + yScale.bandwidth(); 
    $: xExtendedLinePos = (xScale(xTicksValues[xTicksValues.length - 1]) ?? 0) + xScale.bandwidth();
    $: yLastPos = yScale(yTicksValues[yTicksValues.length - 1]) ?? 0 ;
    $: heatmapColor = scaleLinear()
        .range(colorScale)  // supposed to be Iterable<number>, but works with string[] for this case
        .domain(generateInterpolatedArray(colorScale.length, maxValue));
    $: barsColor = displayTotals ? scaleLinear()
        .range(colorScale)  // supposed to be Iterable<number>, but works with string[] for this case
        .domain(generateInterpolatedArray(colorScale.length, totalsMaxY)) : () => [];

    $: getXPosPercent = (percent: number): number => {
        const perc = Math.max(0, Math.min(100, percent));
        const tickPercentIndex = Math.round(xTicksValues.length * perc / 100);
        const tickPercent = xTicksValues[tickPercentIndex];
        return ((xScale(tickPercent) ?? 0)) - xScale.bandwidth() / 2;
    }

	onMount(resize);

	function resize() {
		({ width } = svg.getBoundingClientRect());
	}

	function handleShowTooltip(data: ChartData) {
        tooltipShow = true;
        tooltipPosX = (xScale(data.xValue.toString()) ?? 0) + xScale.bandwidth() / 2 - tooltipOffsetX;
        tooltipPosY = (yScale(data.yValue) ?? 0) + yScale.bandwidth() / 2 + tooltipOffsetY;
        tooltipData = getTooltipData(data);
    }

    function handleHideTooltip() {
        tooltipShow = false;
    }
</script>

<!-- keep it responsive -->
<svelte:window on:resize={resize} />

<div class="relative h-full overflow-x-scroll">
    <ChartTooltip show={tooltipShow} xPos={tooltipPosX} yPos={tooltipPosY} bind:tooltipWidth>
        <div class="grid grid-flow-row-dense grid-cols-[1fr_50px] gap-x-2 text-wtgrey-200 text-right">
            {#each tooltipData as data}
                <span class="">{data.label}:</span>
                <span class="font-bold">{data.value}</span>
            {/each}
        </div>
    </ChartTooltip>

    <svg bind:this={svg} viewBox="0 0 {width} {height}" class="w-full h-full min-w-[600px]">
        <g>
            {#each yTicks as tick}
                <rect 
                    x={padding.left} 
                    y={(yScale(tick.value) ?? 0) + 5} 
                    width={displayTotals ? (xExtendedLinePos * (totalsY[tick.value] / totalsMaxY) - padding.left) : 0} 
                    height={yScale.bandwidth() - 10} 
                    fill="{barsColor(totalsY[tick.value]).toString()}"
                    class:opacity-60={displayTotals}
                    class="opacity-0 transition-all duration-[1s] ease-in-out hover:opacity-100"
                />
                <text 
                    x={xExtendedLinePos + 7} 
                    y={(yScale(tick.value) ?? 0) + yScale.bandwidth() / 2 + 4} 
                    class="fill-wtgrey-100 font-work-sans text-xs"
                    style="text-anchor: start">
                    {totalsY[tick.value]}
                </text>
            {/each}
        </g>

        <!-- y axis -->
        <g>
            <!-- as we place the heat map circles not on top of the lines, we need one more line at the y-end -->
            <g transform="translate(0, {yExtendedLinePos})">
                <line x1={padding.left} x2={xExtendedLinePos} class="stroke-wtgrey-300" />
            </g>
            {#each yTicks as tick}
                <g transform="translate(0, {yScale(tick.value)})" class="min-w-10">
                    {#if xTicksValues.length > 0}
                        <line 
                            x1={padding.left} 
                            x2={xExtendedLinePos} 
                            class="stroke-wtgrey-50" />
                    {/if}
                    {#if tick.label}
                        <text 
                            x={padding.left - 8} 
                            y="{yScale.bandwidth() / 2 + 4}" 
                            class="fill-wtgrey-100 font-work-sans text-xs"
                            style="text-anchor: end">
                            {tick.label}
                        </text>
                    {/if}
                </g>
            {/each}
        </g>

        <!-- x axis -->
        <g>
            {#each xTicks as tick, index}
                <g transform="translate({xScale(tick.value)},0)">
                    {#if yTicksValues.length > 0}
                        <line 
                            y1={yExtendedLinePos} 
                            y2={yLastPos} 
                            class="{index === 0 ? 'stroke-wtgrey-300' : 'stroke-wtgrey-50'}" />
                    {/if}
                    {#if tick.label}
                        <text 
                            y={height - padding.bottom + 25} 
                            x="{xScale.bandwidth() / 2}" 
                            class="fill-wtgrey-100 font-work-sans text-xs"
                            style="text-anchor: middle">
                            {tick.label}
                        </text>
                    {/if}
                </g>
            {/each}

            <!-- as we place the heat map circles not on top of the lines, we need one more line at the x-end -->
            <g transform="translate({xExtendedLinePos},0)">
                <line y1={yExtendedLinePos} y2={yLastPos} class="stroke-wtgrey-50" />
            </g>

            <!-- paint additional vertical lines -->
            {#each verticalMarkers as line}
                <g transform="translate({getXPosPercent(line.percent)},0)">
                    <line y1={yExtendedLinePos + 8} y2={yLastPos} class="stroke-wtgrey-100" style="{line.dashed ? 'stroke-dasharray: 4px;' : ''}" />
                </g>
            {/each}
        </g>

        <!-- data points -->
        {#each data as point}
            {@const xPos = (xScale(point.xValue.toString()) ?? 0) + xScale.bandwidth() / 2}
            {@const yPos = (yScale(point.yValue) ?? 0) + yScale.bandwidth() / 2}
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