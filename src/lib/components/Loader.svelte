<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Button from '$lib/components/Button.svelte';
	import MatrixOutput from '$lib/components/MatrixOutput.svelte';

	import { copy, type Matrix } from '$lib/matrix';
	import { savedMatrix } from '$lib/stores';

	export let matrix: Matrix;

	const dispatch = createEventDispatcher<{ load: Matrix }>();
</script>

<div class="flex gap-2">
	<Button
		on:click={() => {
			savedMatrix.set(copy(matrix));
		}}
	>
		Save
	</Button>

	<div class="relative group">
		<Button
			on:click={() => {
				if (!$savedMatrix?.length) return;
				matrix = copy($savedMatrix);
				dispatch('load', matrix);
			}}
		>
			<span class="flex justify-center">
				Load

				<div
					class="absolute top-full mt-2 pointer-events-none text-black
					bg-white border border-blue-500 rounded p-2
					opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition"
				>
					{#if $savedMatrix}
						<MatrixOutput matrix={$savedMatrix} saveable={false} />
					{:else}
						No saved matrix
					{/if}
				</div>
			</span>
		</Button>
	</div>
</div>
