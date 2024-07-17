<script lang="ts">
	import Heatmap from "$lib/components/Heatmap.svelte";
	import Dropdown from '$lib/components/Dropdown.svelte';
	import type { DropdownOption } from "$lib/types/dropdown";
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { DateRange } from "$lib/types/date-range";
	import { DATE_RANGE_PARAM } from "$lib/const/searchParams";
	import type { TooltipData } from "$lib/types/tooltip";
	import type { ChartData, ChartTick, LineMarker } from "$lib/types/chart";
	import type { UniqueVisitorData } from "$lib/types/unique-vistors";
    import { countries as countryIcons } from 'country-flag-icons';
    import getUnicodeFlagIcon from 'country-flag-icons/unicode';
	import Toggle from "./Toggle.svelte";

    export let data: UniqueVisitorData[];
    export let dateRange: DateRange = DateRange.LastWeek; 

    let isLoading = false;
    let displayTotals = false;

    const hourLabels: {[key: string]: string} = { "1": "1 hr", "12": "12 hr", "24": "24 hr" };
    const hours = Array.from({length: 24}, (_, i) => (i + 1).toString())
        .map((hour) => (
            { label: (hourLabels[hour] ?? ''), value: hour }
        ));
    const colorScale = ["#FFECE3", "#FBAB8F", "#FF7875", "#E6352B", "#800020"];
    const verticalMarkers: LineMarker[] = [
        { percent: 25, dashed: true }, 
        { percent: 50, dashed: false }, 
        { percent: 75, dashed: true }
    ];

    $: chartData = data.map((data) => ({ xValue: data.hour, yValue: data.country, value: data.value }));
    $: countries = Array.from(new Set(data.map((data) => data.country))).reverse()
        .map((country) => ({ label: country, value: country } as ChartTick));

    async function handleDateRangeChange(option: CustomEvent<DropdownOption>): Promise<void> {
        isLoading = true;
        const url = new URL($page.url);
        url.searchParams.set(DATE_RANGE_PARAM, option.detail.value);
        await goto(url.href, { replaceState: true });
        isLoading = false;
    }

    const dropDownOptions: DropdownOption[] = [
        { label: 'Last week', value: 'last-week' }, 
        { label: 'Last two weeks', value: 'last-2-weeks' },
        { label: 'Last month', value: 'last-month' },
        { label: 'Last quarter', value: 'last-quarter' },
        { label: 'Last year', value: 'last-year' },
    ];

    function getTooltipData(data: ChartData): TooltipData[] {
        const flag = countryIcons.includes(data.yValue) ? getUnicodeFlagIcon(data.yValue) : data.yValue;
        
        return [
            { label: 'Unique Visitors', value: data.value },
            { label: 'Country', value: `${flag} ${data.yValue}` },
            { label: 'Hour', value: data.xValue },
        ] as TooltipData[];
    }
</script>

<div class="flex flex-col gap-y-8">
    <div class="flex justify-between flex-wrap sm:flex-nowrap items-center py-2.5 w-full">
        <h1 class="text-2xl font-inter font-semibold">Unique Destination Heatmap</h1>
        <div class="flex gap-x-4 flex-wrap sm:flex-nowrap">
            <div class="flex items-center mt-5 md:mt-0">
                <Toggle label="Display Total Unique Visitors" bind:checked={displayTotals} />
            </div>
            <div class="flex items-center mt-5 md:mt-0 w-full md:w-auto">
                <Dropdown labelPrefix="Show Me" selectedValue={dateRange} options={dropDownOptions} on:change={handleDateRangeChange} {isLoading} />
            </div>
        </div>
    </div>

    <div class="w-full h-auto rounded-xl border border-wtgrey-95 px-5 py-3 bg-white">
        <div class="flex justify-between flex-wrap sm:flex-nowrap items-center pt-5 gap-x-4">
            <h2 class="text-sm font-semibold font-inter">Visitors by country and hour of the day</h2>
            
                <div class="flex gap-x-2 items-center mt-5 sm:mt-0">
                    <span class="font-work-sans text-xs text-right">Less to more unique visitors</span>
                    {#each colorScale as color}
                        <div class="h-4 w-4 min-h-4 min-w-4 rounded-full" style="background-color: {color}"></div>
                    {/each}
                </div>
            </div>
        <Heatmap data={chartData} xTicks={hours} yTicks={countries} colorScale={colorScale} {verticalMarkers} {displayTotals} {getTooltipData} />
    </div>
</div>