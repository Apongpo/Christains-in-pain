import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Loader2, Check, Mail, Users } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import SiteLayout, { Section } from '@/components/SiteLayout';
import PageHero from '@/components/PageHero';

const HERO = 'https://images.hostinger.com/e7ffed98-47f5-4104-aae6-769ed8c80674.png';

const interests = ['Join a peer support session', 'One-on-one support', 'General question'];

const inputClass =
    'w-full border border-input bg-card px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[hsl(var(--gold))]';

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', interest: 'Join a peer support session', message: '' });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setError('');
        try {
            await pb.collection('support_contacts').create(form);
            setStatus('done');
            setForm({ name: '', email: '', phone: '', interest: 'Join a peer support session', message: '' });
        } catch (err) {
            setStatus('idle');
            setError(err?.message || 'We could not send that. Please try again.');
        }
    };

    return (
        <SiteLayout>
            <Helmet>
                <title>Contact &amp; Join the Community | Christians In Pain</title>
                <meta name="description" content="Reach out to ChristiansinPain — join the peer support community, volunteer to lead a session, plan a visit, ask about one-on-one support, or simply ask a question. No account needed." />
            </Helmet>

            <PageHero
                eyebrow="Contact & Join the Community"
                title="Say hello. We will guide you in."
                blurb="Whether you want to join a session, volunteer to lead one, be baptized, or just ask an honest question about faith and health, this reaches a real person on our peer support team."
                scripture="&ldquo;Bear one another&rsquo;s burdens, and so fulfill the law of Christ.&rdquo; — Galatians 6:2"
                image={HERO}
            />

            <Section width="wide" className="grid gap-14 py-20 lg:grid-cols-[1.15fr_1fr]">
                <div className="border border-border bg-card p-8 md:p-10">
                    {status === 'done' ? (
                        <div className="py-10 text-center">
                            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[hsl(var(--gold))] text-[hsl(var(--navy-deep))]">
                                <Check className="h-7 w-7" />
                            </span>
                            <h2 className="mt-6 font-display text-2xl font-bold">Message sent</h2>
                            <p className="mt-3 text-muted-foreground">Someone from our peer support team will be in touch within two business days.</p>
                            <button
                                type="button"
                                onClick={() => setStatus('idle')}
                                className="mt-8 min-h-[44px] border border-[hsl(var(--navy))] px-6 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[hsl(var(--navy))] hover:text-cream"
                            >
                                Send another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-6">
                            <h2 className="font-display text-2xl font-bold">Send us a message</h2>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="cname" className="text-sm font-semibold">Full name</label>
                                    <input id="cname" required value={form.name} onChange={update('name')} className={inputClass} placeholder="Your name" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="cemail" className="text-sm font-semibold">Email</label>
                                    <input id="cemail" type="email" required value={form.email} onChange={update('email')} className={inputClass} placeholder="you@example.com" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="cinterest" className="text-sm font-semibold">I am interested in</label>
                                <select id="cinterest" value={form.interest} onChange={update('interest')} className={inputClass}>
                                    {interests.map((i) => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="cmsg" className="text-sm font-semibold">Message</label>
                                <textarea id="cmsg" required rows={6} value={form.message} onChange={update('message')} className={inputClass} placeholder="Tell us how we can help or what you are facing." />
                            </div>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-[hsl(var(--gold))] px-7 text-sm font-bold uppercase tracking-wider text-[hsl(var(--navy-deep))] transition-transform hover:-translate-y-px active:scale-[0.98] disabled:opacity-60"
                            >
                                {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                                {status === 'loading' ? 'Sending' : 'Send message'}
                            </button>
                        </form>
                    )}
                </div>

                <div>
                    <h2 className="font-display text-3xl font-bold">Reach us</h2>
                    <ul className="mt-8 space-y-6 text-muted-foreground">
                        <li className="flex gap-4">
                            <Users className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--gold))]" />
                            <span>Online peer support sessions<br />No account needed to connect</span>
                        </li>
                        <li className="flex gap-4">
                            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--gold))]" />
                            <span>Peer support line: email (christiansinpain@gmail.com)</span>
                        </li>
                    </ul>
                    <div className="mt-10 border-t border-border pt-8">
                        <p className="text-xs uppercase tracking-[0.3em] text-[hsl(var(--gold))]">Session times</p>
                        <ul className="mt-4 space-y-2">
                            <li className="flex justify-between border-b border-border pb-2"><span>One-on-one calls</span><span className="text-muted-foreground">Mon &amp; Fri (tentative)</span></li>
                            <li className="flex justify-between"><span>Group support circles</span><span className="text-muted-foreground">Wed (tentative)</span></li>
                        </ul>
                    </div>
                </div>
            </Section>

            <Section width="narrow" className="py-12 text-center">
                <p className="text-sm font-semibold text-foreground">Disclaimer:</p>
                <p className="mt-2 text-sm text-muted-foreground">
                    We are not health-care professionals, neither do we replace your health-care team. Please
                    continue working with your team, if you have one. In case of a health crisis, we ask that you
                    go to the Emergency Room that&rsquo;s nearest to you or contact the Crisis Helpline available
                    in your area.
                </p>
            </Section>
        </SiteLayout>
    );
};

export default ContactPage;
