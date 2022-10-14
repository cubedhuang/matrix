<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Header from '$lib/components/Header.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import MatrixOutput from '$lib/components/MatrixOutput.svelte';
	import MatrixInput from '$lib/components/MatrixInput.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import ValueBox from '$lib/components/ValueBox.svelte';

	import { add, resize } from '$lib/matrix';

	let a = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
	];

	let b = [
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1]
	];

	let n = a.length;
	let m = a[0].length;

	$: {
		a = resize(a, n, m);
		b = resize(b, n, m);
	}

	$: sum = add(a, b);
</script>

<svelte:head>
	<title>Add &ndash; Matrix Calculator</title>
</svelte:head>

<Header>Add</Header>

<div class="flex items-center gap-2">
	<div class="flex items-center gap-1">
		<NumberInput min={1} bind:value={n} />
		<p>by</p>
		<NumberInput min={1} bind:value={m} />
	</div>

	<Button
		on:click={() => {
			[a, b] = [b, a];
		}}
	>
		&RightArrowLeftArrow;
	</Button>

	<div class="flex items-center gap-1">
		<ValueBox>{b.length}</ValueBox>
		<p>by</p>
		<ValueBox>{b[0].length}</ValueBox>
	</div>
</div>

<div class="flex flex-col gap-2">
	<div class="flex items-center gap-2">
		<MatrixInput bind:matrix={a} />
		<p>+</p>
		<MatrixInput bind:matrix={b} />
	</div>

	<div class="flex gap-4 justify-between">
		<Loader
			bind:matrix={a}
			on:load={() => {
				n = a.length;
				m = a[0].length;
			}}
		/>

		<Loader
			bind:matrix={b}
			on:load={() => {
				n = b.length;
				m = b[0].length;
			}}
		/>
	</div>
</div>

{#if typeof sum === 'string'}
	<p>{sum}</p>
{:else}
	<MatrixOutput matrix={sum} />
{/if}
