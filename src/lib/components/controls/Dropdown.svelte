<script lang="ts">
    import type { DropdownOption } from "$lib/types/dropdown";
    import { createEventDispatcher } from 'svelte';

    export let labelPrefix: string = '';
    export let selectedValue: string = '';
    export let options: DropdownOption[] = [];
    export let isLoading: boolean = false;

	const dispatch = createEventDispatcher<{change: DropdownOption}>();
    let isDropdownOpen = false;

    $: selectedOption = options.find((option) => option.value === selectedValue);
  
    function handleDropdownClick() {
        isDropdownOpen = !isDropdownOpen;
    }

    function handleOptionClick(option: DropdownOption) {
        selectedValue = option.value;
        dispatch('change', option);
    }
  
    const handleDropdownFocusLoss = ({ relatedTarget, currentTarget } : FocusEvent) => {
        // use "focusout" event to ensure that we can close the dropdown when clicking outside or when we leave the dropdown with the "Tab" button
        if (relatedTarget instanceof HTMLElement && (currentTarget as Element)?.contains(relatedTarget)) {            
            return; // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null) 
        }
        isDropdownOpen = false;
    }

    function handleOptionKeyDown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLLIElement; }, option: DropdownOption): any {
		switch (e.key) {
            case 'Enter':
            case 'Space':
                handleOptionClick(option);
        }
	}
</script>
  
<div class="relative w-full sm:w-auto" on:focusout={handleDropdownFocusLoss} role="listbox">
    <button type="button" class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left h-10 shadow-sm ring-1 ring-inset ring-wtgrey-95 focus:outline-none focus:ring-2 focus:ring-wtred sm:text-sm sm:leading-6" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label" on:click={handleDropdownClick}>
        <span class="flex items-center pr-3" class:pr-8={isLoading}>
            <span class="ml-1 block truncate text-wtgray-200 text-[15px] font-worksans">{labelPrefix} {selectedOption?.label}</span>
        </span>
        {#if isLoading}
            <span class="pointer-events-none absolute inset-y-2.5 right-10 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin stroke-wtred"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </span>
        {/if}
        <span class="pointer-events-none absolute inset-y-2.5 right-0 ml-3 flex items-center pr-3 border-l border-wtgray-85 h-5 pl-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-wtgray-900 rotate-180"><path d="m18 15-6-6-6 6"/></svg>
        </span>
    </button>

    <ul class:opacity-100={isDropdownOpen} class:opacity-0={!isDropdownOpen} class:hidden={!isDropdownOpen} class="absolute transition ease-in duration-100 z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" tabindex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
        {#each options as option}
            <li class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-wtred/10" id="listbox-option-0" role="option" aria-selected={option === selectedOption} on:click={() => handleOptionClick(option)} on:keydown={(e) => handleOptionKeyDown(e, option)}>
                <div class="flex items-center">
                    <span class="ml-3 block truncate font-normal font-worksans" class:text-semibold={option === selectedOption}>{option.label}</span>
                </div>
        
                <span class="absolute inset-y-0 right-0 flex items-center pr-4" class:text-transparent={option !== selectedOption} class:text-wtred={option === selectedOption}>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                </span>
            </li>
        {/each}
    </ul>
</div>