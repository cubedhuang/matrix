<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import MatrixOutput from '$lib/components/MatrixOutput.svelte';
	import MatrixInput from '$lib/components/MatrixInput.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';

	import { lu, resize } from '$lib/matrix';

	let matrix = [
		[1, 2, 3, 4],
		[6, 9, 4, 2],
		[5, 4, 3, 2]
	];

	let n = matrix.length;
	let m = matrix[0].length;

	$: {
		matrix = resize(matrix, n, m);
	}

	$: ({ l, u } = lu(matrix));
</script>

<svelte:head>
	<title>LU Decomposition &ndash; Matrix Calculator</title>
</svelte:head>

<Header>LU Decomposition</Header>

<div class="flex gap-2">
	<div class="flex items-center gap-1">
		<NumberInput min={1} bind:value={n} />
		<p>by</p>
		<NumberInput min={1} bind:value={m} />
	</div>

	<Loader
		bind:matrix
		on:load={() => {
			n = matrix.length;
			m = matrix[0].length;
		}}
	/>
</div>

<MatrixInput bind:matrix />

{#if l && u}
	<div class="flex gap-4">
		<div class="flex flex-col items-center gap-2">
			<h2 class="text-xl font-bold">Lower</h2>
			<MatrixOutput matrix={l} />
		</div>

		<div class="flex flex-col items-center gap-2">
			<h2 class="text-xl font-bold">Upper</h2>
			<MatrixOutput matrix={u} />
		</div>
	</div>
{:else}
	<p>Something died</p>
{/if}
