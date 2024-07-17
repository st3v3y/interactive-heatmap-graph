<script lang="ts">
    export let title;
</script>

<div class="flex justify-between flex-wrap sm:flex-nowrap items-center py-2.5 w-full">
    <h1 class="text-2xl font-inter font-semibold">{title}</h1>
    <div class="flex gap-x-4 flex-wrap sm:flex-nowrap">
        <slot />
    </div>
</div>
