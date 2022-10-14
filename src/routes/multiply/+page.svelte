<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Header from '$lib/components/Header.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import MatrixOutput from '$lib/components/MatrixOutput.svelte';
	import MatrixInput from '$lib/components/MatrixInput.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import ValueBox from '$lib/components/ValueBox.svelte';

	import { multiply, resize } from '$lib/matrix';

	let a = [
		[1, 0, 10],
		[0, 1, 10],
		[0, 0, 1]
	];

	let b = [
		[1, 3, 5],
		[2, 4, 6],
		[1, 1, 1]
	];

	// n by m * m by p = n by p
	let n = a.length;
	let m = a[0].length;
	let p = b[0].length;

	$: {
		a = resize(a, n, m);
		b = resize(b, m, p);
	}

	$: product = multiply(a, b);
</script>

<svelte:head>
	<title>Multiply &ndash; Matrix Calculator</title>
</svelte:head>

<Header>Multiply</Header>

<div class="flex items-center gap-2">
	<div class="flex flex-col gap-2 items-end">
		<div class="flex items-center gap-1">
			<NumberInput min={1} bind:value={n} />
			<p>by</p>
			<NumberInput min={1} bind:value={m} />
		</div>

		<Loader
			bind:matrix={a}
			on:load={() => {
				n = a.length;
				m = a[0].length;
			}}
		/>
	</div>

	<Button
		on:click={() => {
			[a, b] = [b, a];
			n = a.length;
			m = a[0].length;
			p = b[0].length;
		}}
	>
		&RightArrowLeftArrow;
	</Button>

	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-1">
			<ValueBox>{b.length}</ValueBox>
			<p>by</p>
			<NumberInput min={1} bind:value={p} />
		</div>

		<Loader
			bind:matrix={b}
			on:load={() => {
				m = b.length;
				p = b[0].length;
			}}
		/>
	</div>
</div>

<div class="flex gap-2 items-center">
	<MatrixInput bind:matrix={a} />

	<p>&times;</p>

	<MatrixInput bind:matrix={b} />
</div>

{#if typeof product === 'string'}
	<p>{product}</p>
{:else}
	<MatrixOutput matrix={product} />
{/if}
