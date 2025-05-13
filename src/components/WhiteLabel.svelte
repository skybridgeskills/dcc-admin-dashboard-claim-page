<script>
    import { onMount } from 'svelte';

    let config = null;
    let loading = true;
    let error = null;
    let configUrl = null;

    async function sha1(str) {
        const enc = new TextEncoder();
        const hash = await crypto.subtle.digest('SHA-1', enc.encode(str));
        return Array.from(new Uint8Array(hash))
            .map(v => v.toString(16).padStart(2, '0'))
            .join('');
    }

    onMount(async () => {
        try {
            const t = await sha1(window.origin);
            configUrl = `https://dcc-brand-6e8f40c02581a52e.s3.amazonaws.com/${t}`;
            const response = await fetch(configUrl + '/config.json');
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
            }

            config = await response.json();

            // Update document title and background color
            document.title = config.title || document.title;
            if (config.color) {
                document.body.style.backgroundColor = config.color;
            }
        } catch (err) {
            console.error('Error loading configuration:', err);
            error = err.message;
        } finally {
            loading = false;
        }
    });
</script>

{#if loading}
    <div class="flex items-center justify-center h-screen">
        <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
    </div>
{:else if error}
    <div class="flex items-center justify-center h-screen">
        <div class="text-center text-red-600">
            <p class="text-xl font-bold mb-2">Error Loading Configuration</p>
            <p>{error}</p>
        </div>
    </div>
{:else}
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto">
        <img
            src="{configUrl}/logo.png"
            style="max-width: 300px"
            class="mb-4 mx-auto"
            alt="Brand logo"
        />
        <p class="text-center py-4">{config.text}</p>
        {#if config.sponsor_text}
            <hr class="my-4" />
            <p class="mb-4">{config.sponsor_text}</p>
            <img src="{configUrl}/sponsor_logo.png" style="max-width: 200px" alt="Sponsor logo" />
        {/if}
    </div>
{/if}
