// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Config {
			title: string,
			text: string,
			color: string,
			logo_src: string,
			sponsor_logo_src: string,
			sponsor_text: string,
			api: string,
		}
	}
}

export { };
