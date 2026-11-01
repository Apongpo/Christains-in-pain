const API_BASE = '/hcgi/platform/api';

async function submit(path, body) {
    const response = await fetch(`${API_BASE}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const result = await response.json();

    if (!response.ok) {
        const error = new Error(result.message || 'The request could not be completed.');
        error.status = response.status;
        error.response = { message: result.message };
        throw error;
    }

    return result;
}

export const submitContact = (body) => submit('contact', body);
export const submitStory = (body) => submit('story', body);
