<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import MatrixInput from '$lib/components/MatrixInput.svelte';
	import MatrixOutput from '$lib/components/MatrixOutput.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';

	import { resize, scale } from '$lib/matrix';

	let c = 2;

	let matrix = [
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 9]
	];

	let n = matrix.length;
	let m = matrix[0].length;

	$: {
		matrix = resize(matrix, n, m);
	}

	$: reduced = scale(matrix, c);
</script>

<svelte:head>
	<title>Scale &ndash; Matrix Calculator</title>
</svelte:head>

<Header>Scale</Header>

<div class="flex items-center gap-2">
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

<div class="flex items-center gap-2">
	<MatrixInput bind:matrix />
	<p>&times;</p>
	<NumberInput bind:value={c} />
</div>

<MatrixOutput matrix={reduced} />
