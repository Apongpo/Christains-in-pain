export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		if (!url.pathname.startsWith('/hcgi/platform')) {
			return env.ASSETS.fetch(request);
		}
		if (!env.POCKETBASE_URL) {
			return new Response('POCKETBASE_URL is not configured', { status: 503 });
		}
		const target = new URL(env.POCKETBASE_URL.replace(/\/+$/, ''));
		target.pathname = (target.pathname === '/' ? '' : target.pathname) + url.pathname.replace(/^\/hcgi\/platform/, '');
		target.search = url.search;
		return fetch(new Request(target, request));
	},
};
