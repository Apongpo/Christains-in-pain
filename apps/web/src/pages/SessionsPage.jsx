import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Loader2, Check, Users, User, Video } from 'lucide-react';
import Reveal from '@/components/Reveal';
import pb from '@/lib/pocketbaseClient';
import SiteLayout, { Section } from '@/components/SiteLayout';
import PageHero from '@/components/PageHero';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

const NIGHT = 'https://images.hostinger.com/1e4116e0-8036-4c44-ad51-f4ab25812ffd.png';

const sessions = [
    {
        type: 'One-on-one',
        icon: User,
        title: 'Private Peer Prayer Call',
        mode: 'Online \u00b7 30 min',
        blurb: 'A confidential 30-minute call with a trained peer. Bring whatever you are carrying \u2014 we pray, listen, and sit with you in it.',
    },
    {
        type: 'Group',
        icon: Users,
        title: 'Chronic Illness Support Circle',
        mode: 'Online \u00b7 60 min',
        blurb: 'A small group for believers living with long-term illness. We share honestly, study a psalm together, and pray for one another by name.',
    },
    {
        type: 'Group',
        icon: Users,
        title: 'Grief & Loss Walking Group',
        mode: 'Online \u00b7 60 min',
        blurb: 'For those mourning a loved one. A gentle, Scripture-led space where grief is welcomed and hope in Christ is quietly rebuilt.',
    },
    {
        type: 'One-on-one',
        icon: User,
        title: 'New Diagnosis Conversation',
        mode: 'Online \u00b7 45 min',
        blurb: 'Just received a hard diagnosis? Talk with a peer who has been there \u2014 about fear, faith, and what to hold on to next.',
    },
    {
        type: 'Group',
        icon: Users,
        title: 'Mental Health & Faith Group',
        mode: 'Online \u00b7 60 min',
        blurb: 'Anxiety, depression, and faith held together. A peer-led group anchored in truth and grace, not shame or quick fixes.',
    },
];

const inputClass =
    'w-full border border-input bg-card px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[hsl(var(--gold))]';

const SessionsPage = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('');
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const openJoin = (title) => {
        setSelected(title);
        setStatus('idle');
        setError('');
        setForm({ name: '', email: '', phone: '', message: '' });
        setOpen(true);
    };

    const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setError('');
        try {
            await pb.collection('support_contacts').create({
                name: form.name,
                email: form.email,
                phone: form.phone,
                interest: 'Join a peer support session',
                session: selected,
                message: form.message || `I would like to join: ${selected}`,
            });
            setStatus('done');
        } catch (err) {
            setStatus('idle');
            setError(err?.message || 'We could not send that. Please try again.');
        }
    };

    return (
        <SiteLayout>
            <Helmet>
                <title>Peer Support Sessions | Christians In Pain</title>
                <meta name="description" content="Upcoming one-on-one and group peer support sessions for Christians living with health challenges. Confidential, Scripture-grounded, and led by peers who understand." />
            </Helmet>

            <PageHero
                eyebrow="Peer Support Sessions"
                title="Find a session and come as you are"
                blurb="One-on-one and small group gatherings led by a trained peer who understands what it means to live with a long-term illness yet still trusts God. Confidential, no-pressure, and open to anyone."
                scripture="&ldquo;Where two or three are gathered in my name, there am I among them.&rdquo; — Matthew 18:20"
                image={NIGHT}
            />

            <Section width="wide" className="py-20">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <h2 className="font-display text-3xl font-bold md:text-4xl">Upcoming sessions</h2>
                        <p className="mt-3 max-w-xl text-muted-foreground">
                            Sessions currently run on Mondays, Wednesdays, and Fridays (tentative). Every session
                            is free, confidential, online, and led by a peer who has been there. Not sure which
                            one? Just reach out and we will help you choose.
                        </p>
                    </div>
                    <Link to="/contact" className="inline-flex min-h-[44px] items-center gap-2 border border-[hsl(var(--navy))] px-6 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[hsl(var(--navy))] hover:text-cream">
                        Not sure? Ask us
                    </Link>
                </div>

                <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {sessions.map((s, i) => (
                        <Reveal key={s.title} delay={i * 0.05}>
                            <article className="flex h-full flex-col bg-background p-8">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
                                        <s.icon className="h-4 w-4" /> {s.type}
                                    </span>
                                </div>
                                <h3 className="mt-5 font-display text-2xl font-bold leading-snug">{s.title}</h3>
                                <p className="mt-3 flex-1 text-muted-foreground">{s.blurb}</p>
                                <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2"><Video className="h-4 w-4 text-[hsl(var(--gold))]" /> {s.mode}</div>
                                </dl>
                                <button
                                    type="button"
                                    onClick={() => openJoin(s.title)}
                                    className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-[hsl(var(--gold))] px-6 text-xs font-bold uppercase tracking-wider text-[hsl(var(--navy-deep))] transition-transform hover:-translate-y-px active:scale-[0.98]"
                                >
                                    Join a Session
                                </button>
                            </article>
                        </Reveal>
                    ))}
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

            <section className="bg-navy">
                <Section width="narrow" className="py-20 text-center">
                    <h2 className="font-display text-3xl font-bold text-cream md:text-4xl">Prefer to talk first?</h2>
                    <p className="mx-auto mt-5 max-w-xl text-cream/75">
                        Send a message and we will gently guide you into the right session — no pressure, no
                        intake forms, just a real conversation.
                    </p>
                    <Link to="/contact" className="mt-9 inline-flex min-h-[48px] items-center bg-gold px-8 text-sm font-bold uppercase tracking-wider text-[hsl(var(--navy-deep))] transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
                        Contact the team
                    </Link>
                </Section>
            </section>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Join a session</DialogTitle>
                        <DialogDescription>
                            {selected ? `You are signing up for: ${selected}` : 'Tell us a little about yourself and we will confirm your spot.'}
                        </DialogDescription>
                    </DialogHeader>

                    {status === 'done' ? (
                        <div className="py-8 text-center">
                            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[hsl(var(--gold))] text-[hsl(var(--navy-deep))]">
                                <Check className="h-6 w-6" />
                            </span>
                            <h3 className="mt-4 font-display text-xl font-bold">Request sent</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                A peer leader will reach out within two business days to confirm your spot.
                            </p>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="mt-6 min-h-[44px] border border-[hsl(var(--navy))] px-6 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[hsl(var(--navy))] hover:text-cream"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="jname" className="text-sm font-semibold">Name</label>
                                <input id="jname" required value={form.name} onChange={update('name')} className={inputClass} placeholder="Your name" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="jemail" className="text-sm font-semibold">Email</label>
                                    <input id="jemail" type="email" required value={form.email} onChange={update('email')} className={inputClass} placeholder="you@example.com" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="jphone" className="text-sm font-semibold">Phone <span className="font-normal text-muted-foreground">(optional)</span></label>
                                    <input id="jphone" value={form.phone} onChange={update('phone')} className={inputClass} placeholder="(404) 555-0000" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="jmsg" className="text-sm font-semibold">Anything we should know? <span className="font-normal text-muted-foreground">(optional)</span></label>
                                <textarea id="jmsg" rows={3} value={form.message} onChange={update('message')} className={inputClass} placeholder="A sentence is plenty." />
                            </div>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-[hsl(var(--gold))] px-6 text-sm font-bold uppercase tracking-wider text-[hsl(var(--navy-deep))] transition-transform hover:-translate-y-px active:scale-[0.98] disabled:opacity-60"
                            >
                                {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                                {status === 'loading' ? 'Sending' : 'Request my spot'}
                            </button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </SiteLayout>
    );
};

export default SessionsPage;
