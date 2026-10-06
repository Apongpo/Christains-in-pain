import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyNotice = () => (
    <p className="text-sm text-muted-foreground">
        We use the details you submit to respond to your request. Read our{' '}
        <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>{' '}
        to learn how submissions are stored and handled.
    </p>
);

export default PrivacyNotice;
