<script lang="ts">
	import Dropdown from "$lib/components/Dropdown.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import UniqueVisitorsWidget from "$lib/components/UniqueVisitorsWidget.svelte";
	import type { DropdownOption } from "$lib/types/dropdown.js";
	import { COUNTRY_LIMIT_PARAM, DATE_RANGE_PARAM } from "$lib/const/searchParams";
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { DateRange } from "$lib/types/date-range.js";
	import Alert from "$lib/components/Alert.svelte";

	export let data;

    let isLoadingDateRange = false;
    let isLoadingLimit = false;

	const dropDownOptions: DropdownOption[] = [
        { label: 'Last Week', value: DateRange.LastWeek }, 
        { label: 'Last Two Weeks', value: DateRange.Last2Weeks },
        { label: 'Last Month', value: DateRange.LastMonth },
        { label: 'Last Quarter', value: DateRange.LastQuarter },
        { label: 'Last Year', value: DateRange.LastYear }
    ];

	const countryLimitOptions: DropdownOption[] = [
		{ label: '5 Countries', value: "5" },
		{ label: '10 Countries', value: "10" },
		{ label: '25 Countries', value: "25" }
	];

	$: ({ uniqueVisitors, dateRange, countryLimit, error } = data);
	
	async function handleDateRangeChange(option: CustomEvent<DropdownOption>): Promise<void> {
        isLoadingDateRange = true;
        const url = new URL($page.url);
        url.searchParams.set(DATE_RANGE_PARAM, option.detail.value);
        await goto(url.href, { replaceState: true });
        isLoadingDateRange = false;
    }

	async function handleCountryLimitChange(option: CustomEvent<DropdownOption>): Promise<void> {
        isLoadingLimit = true;
        const url = new URL($page.url);
        url.searchParams.set(COUNTRY_LIMIT_PARAM, option.detail.value);
        await goto(url.href, { replaceState: true });
        isLoadingLimit = false;
    }
</script>

<svelte:head>
	<title>Unique Visitors | Web Traffics</title>
</svelte:head>

<section>
	<div class="flex flex-col gap-y-8">
		<PageTitle title="Unique Destination Heatmap">
			<div class="flex items-center mt-5 md:mt-0 w-full md:w-auto gap-4 flex-wrap md:flex-nowrap">
				<Dropdown labelPrefix="Display" selectedValue={countryLimit} options={countryLimitOptions} on:change={handleCountryLimitChange} isLoading={isLoadingLimit} />
				<Dropdown labelPrefix="Show Me" selectedValue={dateRange} options={dropDownOptions} on:change={handleDateRangeChange} isLoading={isLoadingDateRange} />
			</div>
		</PageTitle>
	
		{#if error}
			<Alert>{error}</Alert>
		{:else}
			<UniqueVisitorsWidget data={uniqueVisitors}></UniqueVisitorsWidget>
		{/if}
	</div>
</section>
