<script lang="ts">
    export let label = "";
    export let checked: boolean = false;
</script>

<label for="toggleTwo" class="flex items-center gap-x-2 cursor-pointer select-none text-dark">
    <span class="font-worksans text-sm text-right">{label}</span>
    <div class="relative">
        <input type="checkbox" id="toggleTwo" class="peer sr-only" bind:checked />
        <div class="block h-6 rounded-full bg-wtgrey-95 w-10"></div>
        <div class="absolute w-4 h-4 transition bg-white rounded-full dot left-1 top-1 peer-checked:translate-x-full peer-checked:bg-wtred"></div>
    </div>
</label>