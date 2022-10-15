<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import MatrixInput from '$lib/components/MatrixInput.svelte';
	import MatrixOutput from '$lib/components/MatrixOutput.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';

	import { ref, resize } from '$lib/matrix';

	let matrix = [
		[1, 2, 3],
		[4, 5, 6]
	];

	let n = matrix.length;
	let m = matrix[0].length;

	$: {
		matrix = resize(matrix, n, m);
	}

	$: reduced = ref(matrix);
</script>

<svelte:head>
	<title>Row Echelon &ndash; Matrix Calculator</title>
</svelte:head>

<Header>Row Echelon</Header>

<p class="max-w-prose">
	Row echelon form is a form in which the first non-zero number from the left is
	always to the right of the first non-zero number in the row above, and rows
	consisting of all zeros are at the bottom of the matrix. Note that this is
	different from reduced row echelon form (RREF), which is more restrictive.
	This row echelon calculator does not scale any rows, meaning that the first
	non-zero number in each row is not necessarily 1. This is useful for finding
	several properties like the determinant, rank, and nullity of a matrix.
</p>

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

<MatrixOutput matrix={reduced} />
