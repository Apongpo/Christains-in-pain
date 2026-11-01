import { handleContactSubmission } from './contact-api.mjs';

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		if (!url.pathname.startsWith('/hcgi/platform')) {
			return env.ASSETS.fetch(request);
		}

		if (request.method === 'POST' && url.pathname === '/hcgi/platform/api/contact') {
			return handleContactSubmission(request, env, 'contact');
		}
		if (request.method === 'POST' && url.pathname === '/hcgi/platform/api/story') {
			return handleContactSubmission(request, env, 'story');
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
