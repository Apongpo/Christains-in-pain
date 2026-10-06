import React from 'react';
import { Helmet } from 'react-helmet';
import SiteLayout, { Section } from '@/components/SiteLayout';

const PrivacyPolicyPage = () => (
    <SiteLayout>
        <Helmet>
            <title>Privacy Policy | Christians In Pain</title>
            <meta name="description" content="How Christians In Pain collects, uses and handles personal information shared through contact messages, stories and peer support requests." />
        </Helmet>

        <Section width="narrow" className="py-16 md:py-20">
            <h1 className="font-display text-4xl font-bold md:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: October 6, 2026</p>

            <div className="mt-10 space-y-10 text-base leading-relaxed">
                <section aria-labelledby="privacy-who">
                    <h2 id="privacy-who" className="font-display text-2xl font-bold">Who we are</h2>
                    <p className="mt-4">
                        Christians In Pain is a faith-based peer support community based in Canada that
                        holds space for Christians going through chronic illness to be heard, supported
                        and pointed towards the One who heals the heart, renews the mind and walks with
                        you every step of the way. We meet you where you are, and we respect the
                        confidentiality of the information you share.
                    </p>
                </section>

                <section aria-labelledby="privacy-collection">
                    <h2 id="privacy-collection" className="font-display text-2xl font-bold">What personal data we collect and how it is used</h2>
                    <p className="mt-4">
                        When you contact us, request prayer, share your story or sign up for a session,
                        we collect the information you enter in the form. This may include your name,
                        email address, an optional phone number where requested, your selected topic
                        or session, your message or story, and your privacy and follow-up preferences.
                        Your email is optional on the story form and required on contact and session forms.
                    </p>
                    <p className="mt-4">
                        Stories and messages may contain sensitive information about your health,
                        faith or personal circumstances. Please share only what you are comfortable
                        providing and avoid including other people&apos;s identifying information
                        without their permission.
                    </p>
                    <p className="mt-4">
                        We use this information to provide peer support, respond to inquiries,
                        arrange sessions, pray for your requests and facilitate community connections.
                        We do not use your submissions for advertising or profiling.
                    </p>
                </section>

                <section aria-labelledby="privacy-storage">
                    <h2 id="privacy-storage" className="font-display text-2xl font-bold">Storage and service providers</h2>
                    <p className="mt-4">
                        Form submissions are stored in our PocketBase database. Contact-page messages,
                        peer support session requests and stories or prayer requests, including private submissions,
                        are also emailed to christiansinpain@gmail.com and may be retained in that
                        Gmail mailbox. Database and email backups may contain copies of this information.
                        Submissions are not displayed publicly on this website.
                    </p>
                    <p className="mt-4">
                        Services used to operate the website and deliver messages may process information
                        on our behalf. These include our website and backend hosting services, Google
                        for Gmail delivery and storage, and Hostinger for website assets. During temporary
                        public testing, Cloudflare Tunnel carries website traffic to our local server.
                        These providers may process information outside Canada under their own privacy
                        terms and applicable laws.
                    </p>
                    <p className="mt-4">
                        We have not yet established a fixed deletion schedule for submissions and their
                        email or backup copies. To ask about retention or request deletion, contact us
                        using the email below. Removal from active records may not immediately remove
                        copies in backups.
                    </p>
                </section>

                <section aria-labelledby="privacy-cookies">
                    <h2 id="privacy-cookies" className="font-display text-2xl font-bold">Cookies and technical information</h2>
                    <p className="mt-4">
                        We do not use advertising cookies, tracking pixels or third-party analytics
                        tools to track your activity. Servers and service providers may process
                        technical information such as your IP address and request details to deliver
                        the website, diagnose problems and prevent abuse. PocketBase is configured
                        to retain application logs for up to seven days.
                    </p>
                    <p className="mt-4">
                        External images are loaded from Hostinger, which receives technical information
                        when your browser requests them. If you follow a link to another website, such
                        as the Power Over Pain Portal, that website&apos;s privacy policy applies.
                    </p>
                </section>

                <section aria-labelledby="privacy-sharing">
                    <h2 id="privacy-sharing" className="font-display text-2xl font-bold">Data sharing and confidentiality</h2>
                    <p className="mt-4">
                        Christians In Pain does not sell, rent or trade personal data. Information may
                        be accessed by authorized people providing peer support or administering the
                        website, and by service providers needed to operate these services. We may
                        also disclose information when required by law or when necessary to protect
                        an individual&apos;s vital safety.
                    </p>
                    <p className="mt-4">
                        We treat submissions as confidential and do not publish stories merely
                        because the private option is unchecked. We would seek your permission
                        before publicly sharing your story. We take steps to restrict access to
                        submissions, but no internet service can guarantee absolute security or
                        confidentiality. Peer support is not a substitute for professional health care
                        or emergency services.
                    </p>
                </section>

                <section aria-labelledby="privacy-choices">
                    <h2 id="privacy-choices" className="font-display text-2xl font-bold">Your choices and privacy questions</h2>
                    <p className="mt-4">
                        Submitting a form provides us with the information needed to respond to that
                        request as described above. Simply browsing the website does not require
                        you to submit a story or contact details. You can ask to access or correct
                        your information, request deletion, or withdraw permission for future
                        follow-up by contacting us. We may need to verify your identity before
                        handling a request; applicable legal requirements may limit what we can delete.
                    </p>
                    <p className="mt-4">
                        For privacy questions or concerns, email{' '}
                        <a href="mailto:christiansinpain@gmail.com" className="underline underline-offset-4">
                            christiansinpain@gmail.com
                        </a>.
                    </p>
                    <p className="mt-4">
                        We may update this policy as our services change. The date above indicates
                        the latest revision.
                    </p>
                </section>
            </div>
        </Section>
    </SiteLayout>
);

export default PrivacyPolicyPage;
