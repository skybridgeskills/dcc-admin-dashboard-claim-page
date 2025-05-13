<script lang="ts">
	const { data } = $props();
</script>

<svelte:head>
	<title>{data.credentialName}</title>
</svelte:head>

<section class="flex items-center gap-5 flex-col bg-white rounded-lg shadow-lg max-w-lg mx-auto">
	<article class="flex flex-col gap-5">
		<output class="p-8 border-b border-gray-200">
			<h2
				id="title"
				class="text-xl xl:font-extrabold tracking-tight leading-10 xl:text-4xl text-slate-900"
			>
				{data.credentialName}
			</h2>
			<div>
				<p id="info-1" class="text-sm xl:text-lg font-semibold text-slate-900">
					{data.info1}
				</p>
			</div>
			<div>
				<p id="info-2" class="text-sm xl:text-lg font-semibold text-slate-900">
					{data.info2}
				</p>
			</div>
		</output>

		<footer class="flex flex-col text-center text-sm px-8">
			<p>Scan the QR code to claim</p>
			<img src={data.qrDataUri} aria-hidden="true" alt="QR code" />
			<p>
				or claim with a wallet on this device <a
					class="font-extrabold underline"
					id="link-direct"
					href={data.qrDeepLink}>here</a
				>.
			</p>
		</footer>
	</article>
	<div class="border-t border-gray-200 w-full">
		<img
			id="claim_logo"
			src={data.logo_src}
			style="max-width: 150px"
			class="my-4 mx-auto"
			alt="Brand logo"
		/>
	</div>
</section>
