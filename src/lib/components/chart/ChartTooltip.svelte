<script lang="ts">
    export let show: boolean = false;
    export let xPos: number = 0;
    export let yPos: number = 0;
    export let tooltipWidth: number = 0;
</script>

<div class="absolute opacity-0 w-auto scale-0 h-auto px-4 py-3 bg-white text-sm shadow-[2px_2px_8px_rgba(0,0,0,0.2)] rounded pointer-events-none flex flex-col transition-all duration-200 ease-in-out after:width-0 after:left-[calc(50%-8px)] after:top-[-8px] after:content-[' '] after:absolute after:border-8 after:border-x-transparent after:border-t-transparent after:border-b-white after:mt-[-8px]" 
         class:opacity-100={show} 
         class:scale-100={show}
         style="left: {xPos}px; top: {yPos}px;" aria-label="tooltip" role="tooltip"
         bind:clientWidth={tooltipWidth}
    > 
    <slot></slot>
</div>