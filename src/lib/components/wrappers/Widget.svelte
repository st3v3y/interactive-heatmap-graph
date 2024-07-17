<script lang="ts">
    export let title;
</script>

<div class="w-full h-auto rounded-xl border border-wtgrey-95 px-5 py-3 bg-white">
    <div class="flex justify-between flex-wrap sm:flex-nowrap items-center pt-5 gap-x-4">
        <h2 class="text-sm font-semibold font-inter">{title}</h2>
        <slot name="controls"></slot>
    </div>
    <slot />
</div>