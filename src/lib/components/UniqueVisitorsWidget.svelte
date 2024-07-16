<script lang="ts">
	import Heatmap from "$lib/components/Heatmap.svelte";
	import Dropdown from '$lib/components/Dropdown.svelte';
	import type { DropdownOption } from "$lib/types/dropdown";
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { UniqueVisitorData } from "$lib/types/unique-vistors";
	import { DateRange } from "$lib/types/date-range";
	import { DATE_RANGE_PARAM } from "$lib/const/searchParams";
    
    export let data: UniqueVisitorData[];
    export let dateRange: DateRange = DateRange.LastWeek; 

    $: countries = Array.from(new Set(data.map((data) => data.country))).reverse()
        .map((country) => ({ label: country, value: country }));
    const hourLabels: {[key: string]: string} = { "1": "1 hrs", "12": "12 hrs", "24": "24 hrs" };
    const hours = Array.from({length: 24}, (_, i) => (i + 1).toString())
        .map((hour) => (
            { label: (hourLabels[hour] ?? ''), value: hour }
        ));
    const colorScale = ["#FFECE3", "#FBAB8F", "#FF7875", "#E6352B", "#800020"];

    let isLoading = false;

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
    ]
</script>

<div class="flex flex-col gap-y-8">
    <div class="flex justify-between items-center py-2.5">
        <h1 class="text-2xl font-inter font-semibold">Unique Destination Heatmap</h1>
        <div class="flex gap-4 items-center">
            {#if isLoading}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin stroke-wtred"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            {/if}
            <Dropdown labelPrefix="Show Me" selectedValue={dateRange} options={dropDownOptions} on:change={handleDateRangeChange} />
        </div>
    </div>

    <div class="w-full h-[900px] rounded-xl border border-wtgrey-95 px-5 py-3 pb-12 bg-white">
        <div class="flex justify-between items-center pt-5">
            <h2 class="text-sm font-semibold font-inter">Visitors by country and hour of the day</h2>
            <div class="flex gap-x-2 items-center mr-10">
                <span class="font-work-sans text-xs">Less to more unique visitors</span>
                {#each colorScale as color}
                    <div class="h-4 w-4 rounded-full" style="background-color: {color}"></div>
                {/each}
            </div>
        </div>
        <Heatmap points={data} xTicks={hours} yTicks={countries} colorScale={colorScale} />
    </div>
</div>