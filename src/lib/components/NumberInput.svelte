<script lang="ts">
	export let value: number;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
</script>

<input
	type="number"
	class="py-1 px-2 w-12 sm:w-14 rounded border border-gray-300 focus:border-gray-600 transition-colors"
	{min}
	{max}
	bind:value
	on:input
/>
