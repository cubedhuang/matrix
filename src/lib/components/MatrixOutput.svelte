<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	import { copy, type Matrix } from '$lib/matrix';
	import { savedMatrix } from '$lib/stores';
	import ValueBox from './ValueBox.svelte';

	export let matrix: Readonly<Matrix>;
	export let saveable = true;

	function round(value: number) {
		return Math.round(value * 1000) / 1000;
	}
</script>

<div class="flex flex-col gap-2 items-center">
	<div
		class="grid w-fit gap-1"
		style:grid-template-columns="repeat({matrix[0]?.length ?? 1}, 1fr)"
	>
		{#each matrix as row}
			{#each row as value}
				<ValueBox fixed={false}>{round(value)}</ValueBox>
			{/each}
		{/each}
	</div>

	{#if saveable}
		<div>
			<Button
				on:click={() => {
					savedMatrix.set(copy(matrix));
				}}
			>
				Save
			</Button>
		</div>
	{/if}
</div>
