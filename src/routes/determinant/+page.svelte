<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import MatrixInput from '$lib/components/MatrixInput.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import ValueBox from '$lib/components/ValueBox.svelte';

	import { det, resize } from '$lib/matrix';

	let matrix = [
		[1, 2, 0],
		[0, 3, 0],
		[5, 4, 6]
	];

	let n = matrix.length;

	$: {
		matrix = resize(matrix, n, n);
	}

	$: determinant = det(matrix);
</script>

<svelte:head>
	<title>Determinant &ndash; Matrix Calculator</title>
</svelte:head>

<Header>Determinant</Header>

<div class="flex items-center gap-2">
	<div class="flex items-center gap-1">
		<NumberInput min={1} bind:value={n} />
		<p>by</p>
		<ValueBox>{n}</ValueBox>
	</div>

	<Loader
		bind:matrix
		on:load={() => {
			n = Math.max(matrix.length, matrix[0].length);
		}}
	/>
</div>

<MatrixInput bind:matrix />

<ValueBox fixed={false}>
	{determinant}
</ValueBox>
