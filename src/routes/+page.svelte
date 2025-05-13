<script lang="ts">
	const { data }: { data: App.Config } = $props();
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<main style={`background-color: ${data.color}`} class="h-screen pt-8">
	<div class="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto">
		<img src={data.logo_src} style="max-width: 300px" class="mb-4 mx-auto" alt="Brand logo" />
		<p class="text-center py-4">{data.text}</p>
		{#if data.sponsor_text}
			<hr class="my-4" />
			<p class="mb-4">{data.sponsor_text}</p>
			<img src={data.sponsor_logo_src} style="max-width: 200px" alt="Sponsor logo" />
		{/if}
	</div>
</main>
