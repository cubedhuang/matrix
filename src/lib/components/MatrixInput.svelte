<script lang="ts">
	import NumberInput from '$lib/components/NumberInput.svelte';

	import type { Matrix } from '$lib/matrix';

	export let matrix: Matrix;
</script>

<div
	class="grid w-fit gap-1"
	style:grid-template-columns="repeat({matrix[0]?.length ?? 1}, 1fr)"
>
	{#each matrix as row}
		{#each row as cell}
			<NumberInput bind:value={cell} />
		{/each}
	{/each}
</div>
