import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Loader2, Check } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import SiteLayout, { Section } from '@/components/SiteLayout';
import PageHero from '@/components/PageHero';

const CIRCLE = 'https://images.hostinger.com/cdd24c84-47f7-46c7-8896-7ebee03cf441.png';

const topics = ['Chronic illness/disease', 'Mental health', 'Faith and doubt', 'New diagnosis', 'Other'];
const supportTypes = ['Prayer', 'Peer support', 'Both', 'Just want to share'];

const inputClass =
    'w-full border border-input bg-card px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[hsl(var(--gold))]';

const ShareStoryPage = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        topic: "Chronic illness/disease",
        support_type: 'Both',
        story: '',
        want_followup: false,
        is_private: true,
    });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const update = (key) => (e) =>
        setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setError('');
        try {
            await pb.collection('story_submissions').create(form);
            setStatus('done');
            setForm({ name: '', email: '', topic: "Chronic illness/disease", support_type: 'Both', story: '', want_followup: false, is_private: true });
        } catch (err) {
            setStatus('idle');
            setError(err?.message || 'We could not send that. Please try again.');
        }
    };

    return (
        <SiteLayout>
            <Helmet>
                <title>Share Your Story &amp; Prayer Request | Christians In Pain</title>
                <meta name="description" content="Share what you are facing and request prayer or peer support. No account needed. Confidential by default, met with compassion and the hope of the gospel." />
            </Helmet>

            <PageHero
                eyebrow="Share Your Story / Prayer Request"
                title="Tell us what you are facing"
                blurb="Whatever you are carrying — a diagnosis, a long road, a heavy mind, a quiet grief — you can name it here. Request prayer, peer support, or simply be heard. No account, no judgment."
                scripture="&ldquo;Cast all your anxieties on him, because he cares for you.&rdquo; — 1 Peter 5:7"
                image={CIRCLE}
            />

            <Section width="wide" className="grid gap-14 py-20 lg:grid-cols-[1fr_1.15fr]">
                <div>
                    <h2 className="font-display text-3xl font-bold">How it works</h2>
                    <ol className="mt-8 space-y-7">
                        {[
                            ['You share', 'Write as much or as little as you want. Mark it private and only our trained peer leader will read it.'],
                            ['We pray & respond', 'Every request is prayed over personally. If you ask for peer support, we will match you to a session or a one-on-one conversation.'],
                            ['We follow up', 'Leave an email and someone will check in on you within a few days \u2014 gently, never pushy.'],
                        ].map(([t, d], i) => (
                            <li key={t} className="flex gap-5">
                                <span className="font-display text-2xl font-black text-[hsl(var(--gold))]">{i + 1}</span>
                                <span>
                                    <span className="block font-display text-xl font-bold">{t}</span>
                                    <span className="mt-1 block text-muted-foreground">{d}</span>
                                </span>
                            </li>
                        ))}
                    </ol>
                    <div className="mt-10 space-y-4 border-l-2 border-[hsl(var(--gold))] pl-5">
                        <p className="font-display text-lg italic text-muted-foreground">
                            &ldquo;Bear one another’s burdens, and so fulfill the law of Christ.&rdquo; — Galatians 6:2
                        </p>
                        <p className="text-sm text-muted-foreground">
                            We are not Healthcare professionals, neither do we replace your Healthcare team. Please,
                            continue working with your team&mdash;if you have one&mdash;and in case of any medical
                            emergency, we ask that you contact the crisis line available in your area.
                        </p>
                    </div>
                </div>

                <div className="border border-border bg-card p-8 md:p-10">
                    {status === 'done' ? (
                        <div className="py-10 text-center">
                            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[hsl(var(--gold))] text-[hsl(var(--navy-deep))]">
                                <Check className="h-7 w-7" />
                            </span>
                            <h2 className="mt-6 font-display text-2xl font-bold">We received it</h2>
                            <p className="mt-3 text-muted-foreground">
                                Your story is with our peer team now. You don&apos;t have to carry this alone — someone
                                is already praying for you by name.
                            </p>
                            <button
                                type="button"
                                onClick={() => setStatus('idle')}
                                className="mt-8 min-h-[44px] border border-[hsl(var(--navy))] px-6 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[hsl(var(--navy))] hover:text-cream"
                            >
                                Share another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-6">
                            <h2 className="font-display text-2xl font-bold">Share your story</h2>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="sname" className="text-sm font-semibold">Your name</label>
                                    <input id="sname" required value={form.name} onChange={update('name')} className={inputClass} placeholder="First name is enough" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="semail" className="text-sm font-semibold">Email <span className="font-normal text-muted-foreground">(optional)</span></label>
                                    <input id="semail" type="email" value={form.email} onChange={update('email')} className={inputClass} placeholder="you@example.com" />
                                </div>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="stopic" className="text-sm font-semibold">What are you facing?</label>
                                    <select id="stopic" value={form.topic} onChange={update('topic')} className={inputClass}>
                                        {topics.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="sstype" className="text-sm font-semibold">I would like</label>
                                    <select id="sstype" value={form.support_type} onChange={update('support_type')} className={inputClass}>
                                        {supportTypes.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="sstory" className="text-sm font-semibold">Your story / prayer request</label>
                                <textarea id="sstory" required rows={7} value={form.story} onChange={update('story')} className={inputClass} placeholder="Say as much or as little as you want. There is no right way to say it." />
                            </div>
                            <label className="flex items-start gap-3 text-sm text-muted-foreground">
                                <input type="checkbox" checked={form.want_followup} onChange={update('want_followup')} className="mt-1 h-4 w-4 accent-[hsl(var(--gold))]" />
                                I would like someone to follow up with me about peer support.
                            </label>
                            <label className="flex items-start gap-3 text-sm text-muted-foreground">
                                <input type="checkbox" checked={form.is_private} onChange={update('is_private')} className="mt-1 h-4 w-4 accent-[hsl(var(--gold))]" />
                                Keep this private — peer leader only, never shared publicly.
                            </label>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-[hsl(var(--gold))] px-7 text-sm font-bold uppercase tracking-wider text-[hsl(var(--navy-deep))] transition-transform hover:-translate-y-px active:scale-[0.98] disabled:opacity-60"
                            >
                                {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                                {status === 'loading' ? 'Sending' : 'Send my story'}
                            </button>
                        </form>
                    )}
                </div>
            </Section>
        </SiteLayout>
    );
};

export default ShareStoryPage;
