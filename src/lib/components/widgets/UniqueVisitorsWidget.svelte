<script lang="ts">
	import Heatmap from "$lib/components/chart/Heatmap.svelte";
	import type { TooltipData } from "$lib/types/tooltip";
	import type { ChartData, ChartTick, LineMarker } from "$lib/types/chart";
	import type { UniqueVisitorData } from "$lib/types/unique-vistors";
    import { countries as countryIcons } from 'country-flag-icons';
    import getUnicodeFlagIcon from 'country-flag-icons/unicode';
	import Toggle from "$lib/components/controls/Toggle.svelte";
	import Widget from "$lib/components/wrappers/Widget.svelte";

    export let data: UniqueVisitorData[];

    let displayTotals = false;

    const hourLabels: {[key: string]: string} = { "1": "1 hr", "12": "12 hr", "24": "24 hr" };
    const hours = Array.from({length: 24}, (_, i) => (i + 1).toString())
        .map((hour) => (
            { label: (hourLabels[hour] ?? ''), value: hour }
        ));
    const colorScale = ["#FFECE3", "#FBAB8F", "#FF7875", "#E6352B", "#800020"];

    // IDEA:Here it would be really nice to calculate the average value for each 
    // country for 0 - 12 and 12 - 24 hours and then take average from those to get 
    // total average core visitor times accross all countries. (Here I just chose '6' and '18' as an example)
    const verticalMarkers: LineMarker[] = [
        { xValue: "6", dashed: true }, 
        { xValue: "12", dashed: false }, 
        { xValue: "18", dashed: true }
    ];

    $: chartData = data.map((data) => ({ xValue: data.hour.toString(), yValue: data.country, value: data.value }));
    $: countries = Array.from(new Set(data.map((data) => data.country))).reverse()
        .map((country) => ({ label: country, value: country } as ChartTick));

    function getTooltipData(data: ChartData): TooltipData[] {
        const flag = countryIcons.includes(data.yValue) ? getUnicodeFlagIcon(data.yValue) : data.yValue;
        return [
            { label: 'Unique Visitors', value: data.value.toString() },
            { label: 'Country', value: `${flag} ${data.yValue}` },
            { label: 'Hour', value: data.xValue },
        ] as TooltipData[];
    }
</script>

<Widget title="Visitors by country and hour of the day">
    <div slot="controls" class="flex flex-wrap sm:flex-nowrap gap-x-2 items-center sm:mt-0">
        <div class="flex items-center mt-5 md:mt-0">
            <Toggle label="Display Total Unique Visitors" bind:checked={displayTotals} />
        </div>
        <div class="flex items-center mt-5 md:mt-0 gap-x-2">
            <span class="font-work-sans text-xs text-right">Less to more unique visitors</span>
            <div class="flex gap-x-2">
                {#each colorScale as color}
                    <div class="h-4 w-4 min-h-4 min-w-4 rounded-full" style="background-color: {color}"></div>
                {/each}
            </div>
        </div>
    </div>
    <Heatmap data={chartData} xTicks={hours} yTicks={countries} colorScale={colorScale} {verticalMarkers} {displayTotals} {getTooltipData} />
</Widget>
