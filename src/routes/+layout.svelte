<script lang="ts">
	import '../app.css';

	import NavLink from '$lib/components/NavLink.svelte';
</script>

<div class="flex h-screen overflow-hidden">
	<nav class="overflow-y-auto w-48 bg-blue-100">
		<NavLink href="/">Home</NavLink>
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
		<NavLink href="/multiply">Multiply</NavLink>
	</nav>

	<div
		class="flex-1 flex flex-col items-center gap-4 py-16 px-8 overflow-y-auto"
	>
		<slot />
	</div>
</div>
