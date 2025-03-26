<script>
    import { onMount } from 'svelte';
    import QRCode from 'qrcode';
    import { format } from 'date-fns';

    let config = null;
    let loading = true;
    let error = null;
    let credentialName = '';
    let earnerName = '';
    let awardedDate = '';
    let issuedDate = '';
    let qrCodeDataUrl = '';
    let directDeepLink = '';

    onMount(async () => {
        try {
            // Get URL token parameter
            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            const { token } = params;

            if (!token) {
                window.location.href = `/error`;
                return;
            }

            // Load config
            const configResponse = await fetch('/brand/config.json');
            if (!configResponse.ok) {
                throw new Error(
                    `Failed to load config: ${configResponse.status} ${configResponse.statusText}`
                );
            }
            config = await configResponse.json();

            // Update document title and background color
            document.title = config.title || document.title;
            if (config.color) {
                document.body.style.backgroundColor = config.color;
            }

            // Fetch credential links
            const res = await fetch(`${config.api}/get-credential-links`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Set timeout for expiration (9 minutes)
            setTimeout(() => {
                window.location.replace(`/expired`);
            }, 540000);

            if (res.status !== 200) {
                window.location.href = `/error`;
                return;
            }

            // Process response
            const {
                links,
                metadata: {
                    credentialName: cName,
                    earnerName: eName,
                    awardedDate: _awardedDate,
                    issuedDate: _issuedDate,
                },
            } = await res.json();

            // Format dates
            awardedDate = format(new Date(_awardedDate), 'MMMM do, y');
            issuedDate = format(new Date(_issuedDate), 'MMMM do, y');

            // Update variables
            credentialName = cName;
            earnerName = eName;
            document.title = credentialName;

            // Generate QR code
            const url = links[0]?.directDeepLink;
            if (url) {
                directDeepLink = url;
                qrCodeDataUrl = await QRCode.toDataURL(url);
            } else {
                window.location.href = `/error`;
            }
        } catch (err) {
            console.error('Error:', err);
            error = err.message;
            window.location.href = `/error`;
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
            <p class="text-xl font-bold mb-2">Error Loading Credential</p>
            <p>{error}</p>
        </div>
    </div>
{:else}
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-5xl mx-auto my-8">
        <img src="/brand/logo.png" style="max-width: 300px" class="mb-8 mx-auto" alt="Brand logo" />

        <div class="flex flex-col xl:flex-row xl:justify-between gap-14">
            <div class="flex flex-col gap-5">
                <div>
                    <h2
                        class="text-xl xl:font-extrabold tracking-tight leading-10 xl:text-5xl text-slate-900 mb-10"
                    >
                        {credentialName}
                    </h2>

                    <p class="mb-5 text-sm xl:text-xl font-semibold text-slate-900">
                        Awarded to {earnerName} on {awardedDate}
                    </p>

                    <p class="text-sm xl:text-xl font-semibold text-slate-900">
                        Issued on {issuedDate}
                    </p>
                </div>

                <div class="mt-5">
                    <p class="text-sm xl:text-xl font-semibold text-slate-900">
                        Scan the QR code with your phone camera to add your credential to the
                        Learner Credential Wallet.
                        <br /><br />
                        Or, if you are already viewing this page from your phone then click
                        <a
                            class="text-sm xl:text-xl font-extrabold italic text-red-900"
                            href={directDeepLink}>here</a
                        >.
                    </p>
                </div>
            </div>

            <div class="bg-white rounded-3xl p-5 shadow-sm">
                <img
                    src={qrCodeDataUrl}
                    class="max-h-96 max-w-96 h-auto w-auto"
                    alt="QR code for credential"
                />
            </div>
        </div>

        {#if config?.text}
            <hr class="my-8" />
            <p class="text-center py-2">{config.text}</p>
        {/if}

        {#if config?.sponsor_text}
            <hr class="my-4" />
            <p class="mb-4">{config.sponsor_text}</p>
            <img src="/brand/{config.sponsor_logo}" style="max-width: 200px" alt="Sponsor logo" />
        {/if}
    </div>
{/if}
