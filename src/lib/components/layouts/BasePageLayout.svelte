<script>
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
</script>

<div class="flex flex-col justify-between min-h-[100vh]">
	<Header />
	<main class="flex flex-col p-4 sm:p-10 md:p-14 h-full flex-grow max-w-full overflow-x-auto overflow-y-visible">
		<slot />
	</main>
	<Footer />
</div>
