<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import MatrixInput from '$lib/components/MatrixInput.svelte';
	import MatrixOutput from '$lib/components/MatrixOutput.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';

	import { transpose, resize } from '$lib/matrix';

	let matrix = [
		[1, 2, 3],
		[4, 5, 6]
	];

	let n = matrix.length;
	let m = matrix[0].length;

	$: {
		matrix = resize(matrix, n, m);
	}

	$: transposed = transpose(matrix);
</script>

<svelte:head>
	<title>Transpose &ndash; Matrix Calculator</title>
</svelte:head>

<Header>Transpose</Header>

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

<MatrixInput bind:matrix />

<MatrixOutput matrix={transposed} />
