<script>
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import '../app.css';
</script>

<Header />

<main class="flex flex-col p-4 sm:p-10 md:p-14">
	<slot />
</main>

<Footer />
