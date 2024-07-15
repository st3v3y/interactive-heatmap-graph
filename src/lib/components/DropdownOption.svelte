<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    export let label: string;
    export let value: string;

    const dispatch = createEventDispatcher();

	function handleDropDownItemClick(event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement; }) {
		dispatch('dropdownItemClicked', { value });
	}
</script>

<div on:click={handleDropDownItemClick}>
    {label}
</div>