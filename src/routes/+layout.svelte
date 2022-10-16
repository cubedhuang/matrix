<script lang="ts">
	import '../app.css';

	import { slide } from 'svelte/transition';

	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';

	import NavLink from '$lib/components/NavLink.svelte';
	import Button from '$lib/components/Button.svelte';

	let smallScreen = browser ? document.body.clientWidth < 640 : false;
	let hidden = false;

	afterNavigate(() => {
		hidden = smallScreen;
	});

	$: hidden = smallScreen;

	if (browser) {
		new ResizeObserver(entry => {
			smallScreen = entry[0].contentRect.width < 640;
		}).observe(document.body);
	}
</script>

<svelte:window />

<div class="relative flex flex-col sm:flex-row h-screen overflow-hidden">
	<div class="flex">
		{#if smallScreen}
			<div class="z-20 flex flex-col w-full pt-4 pb-0 px-8">
				<Button on:click={() => (hidden = !hidden)}>
					{hidden ? 'Show' : 'Hide'} Menu
				</Button>
			</div>
		{/if}
		{#if !hidden}
			<nav
				transition:slide={{ duration: 600 }}
				class="overflow-y-auto bg-blue-100 z-10
				absolute inset-0
				sm:static sm:block sm:w-48
				transition-opacity"
			>
				<div class="h-16 sm:h-0" />
				<NavLink href="/">Matrix Calculator</NavLink>
				<p class="font-bold px-4 py-2 border-y border-black bg-white">
					Unary Operations
				</p>
				<NavLink href="/determinant">Determinant</NavLink>
				<NavLink href="/transpose">Transpose</NavLink>
				<NavLink href="/inverse">Inverse</NavLink>
				<NavLink href="/ref">Row Echelon</NavLink>
				<NavLink href="/rref">RREF</NavLink>
				<NavLink href="/lu">LU Decomposition</NavLink>
				<p class="font-bold px-4 py-2 border-y border-black bg-white">
					Binary Operations
				</p>
				<NavLink href="/add">Add</NavLink>
				<NavLink href="/scale">Scale</NavLink>
				<NavLink href="/multiply">Multiply</NavLink>
			</nav>
		{/if}
	</div>

	<div
		class="flex-1 flex flex-col items-start gap-4 py-8 sm:py-16 px-8 overflow-y-auto"
	>
		<slot />
	</div>
</div>
