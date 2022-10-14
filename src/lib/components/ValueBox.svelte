<script lang="ts">
	export let fixed = true;
</script>

<p
	class="py-1 px-2 bg-blue-100 rounded border border-transparent"
	class:w-12={fixed}
>
	<slot />
</p>
