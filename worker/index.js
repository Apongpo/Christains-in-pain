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

		return new Response('Not found', { status: 404 });
	},
};
