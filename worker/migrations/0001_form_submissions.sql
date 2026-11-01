CREATE TABLE IF NOT EXISTS support_contacts (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '' CHECK (length(phone) <= 40),
    interest TEXT NOT NULL CHECK (
        interest IN (
            'Join a peer support session',
            'One-on-one support',
            'General question'
        )
    ),
    session TEXT NOT NULL DEFAULT '' CHECK (length(session) <= 200),
    message TEXT NOT NULL CHECK (length(message) BETWEEN 1 AND 3000),
    created TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS story_submissions (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
    email TEXT NOT NULL DEFAULT '',
    topic TEXT NOT NULL CHECK (
        topic IN (
            'Chronic illness/disease',
            'Mental health',
            'Faith and doubt',
            'New diagnosis',
            'Other'
        )
    ),
    support_type TEXT NOT NULL CHECK (
        support_type IN ('Prayer', 'Peer support', 'Both', 'Just want to share')
    ),
    story TEXT NOT NULL CHECK (length(story) BETWEEN 1 AND 5000),
    want_followup INTEGER NOT NULL DEFAULT 0 CHECK (want_followup IN (0, 1)),
    is_private INTEGER NOT NULL DEFAULT 1 CHECK (is_private IN (0, 1)),
    created TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS form_rate_limits (
    rate_key TEXT PRIMARY KEY NOT NULL,
    window_start INTEGER NOT NULL,
    request_count INTEGER NOT NULL CHECK (request_count > 0)
);
