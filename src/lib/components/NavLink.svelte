<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;

	$: active = $page.url.pathname === href;
</script>

<a
	{href}
	class="relative block p-4 isolate transition-colors
		after:absolute after:inset-2 after:right-0 after:rounded-l after:-z-10 after:bg-white after:opacity-0 after:transition-opacity"
	class:after:opacity-100={active}
	class:hocus:after:opacity-50={!active}
	class:cursor-default={active}
>
	<slot />
</a>
