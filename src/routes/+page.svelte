<script lang="ts">
	import UniqueVisitorsWidget from "$lib/components/UniqueVisitorsWidget.svelte";

	export let data;

	$: ({ uniqueVisitors, dateRange } = data);
</script>

<svelte:head>
	<title>Unique Visitors | Web Traffics</title>
</svelte:head>

<section>
	<UniqueVisitorsWidget data={uniqueVisitors} {dateRange}></UniqueVisitorsWidget>
</section>
