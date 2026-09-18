import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Users, Gift, BookOpen } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SiteLayout, { Section } from '@/components/SiteLayout';
import PageHero from '@/components/PageHero';

const HERO = 'https://images.hostinger.com/cdd24c84-47f7-46c7-8896-7ebee03cf441.png';

const features = [
    { icon: Gift, t: 'Free for everyone', d: 'No cost, no account, no catch. The portal is open to anyone who needs it.' },
    { icon: Users, t: 'For youth & adults', d: 'Resources tailored to both younger and older people living with pain.' },
    { icon: Globe, t: 'Available anywhere', d: 'No geographical limits. Wherever you are, the portal meets you there.' },
];

const ResourcesPage = () => (
    <SiteLayout>
        <Helmet>
            <title>Resources | Christians In Pain</title>
            <meta name="description" content="Power Over Pain Portal - a one-stop hub for pain resources for both youth and adults. Free and available to all regardless of geographical location." />
        </Helmet>

        <PageHero
            eyebrow="Resources"
            title="Power Over Pain Portal"
            blurb="A one-stop hub for pain resources for both youth and adults. It's free and available to all regardless of geographical location."
            scripture="&ldquo;I can do all things through him who strengthens me.&rdquo; — Philippians 4:13"
            image={HERO}
        />

        <Section width="wide" className="py-20">
            <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                <Reveal>
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-[hsl(var(--gold))]">Our main resource</p>
                        <h2 className="mt-5 font-display text-4xl font-bold leading-tight md:text-5xl">
                            One hub. Every pain resource in one place.
                        </h2>
                        <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
                            <p>
                                Power Over Pain Portal brings together trusted, practical, and faith-sensitive
                                resources for living with pain all in one easy-to-use hub. Whether you are a young
                                person facing pain for the first time or an adult walking a long road, the portal
                                meets you where you are.
                            </p>
                            <p>
                                It is completely free and available to everyone, regardless of where you live. No
                                referrals, no waiting lists, no barriers — just help, hope, and the tools to keep
                                moving forward.
                            </p>
                        </div>
                        <div className="mt-9 flex flex-wrap gap-4">
                            <a href="https://poweroverpain.ca/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] items-center gap-2 bg-gold px-7 text-sm font-bold uppercase tracking-wider text-[hsl(var(--navy-deep))] transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
                                Visit the portal <ArrowRight className="h-4 w-4" />
                            </a>
                            <Link to="/share" className="inline-flex min-h-[48px] items-center gap-2 border border-[hsl(var(--navy))] px-7 text-sm font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-[hsl(var(--navy))] hover:text-cream">
                                Share your story
                            </Link>
                        </div>
                    </div>
                </Reveal>
                <Reveal delay={0.1}>
                    <div className="grid gap-px bg-border">
                        {features.map((f) => (
                            <div key={f.t} className="flex items-start gap-5 bg-background p-7">
                                <span className="grid h-12 w-12 shrink-0 place-items-center border border-[hsl(var(--gold))] text-[hsl(var(--gold))]">
                                    <f.icon className="h-5 w-5" strokeWidth={1.75} />
                                </span>
                                <span>
                                    <span className="block font-display text-xl font-bold">{f.t}</span>
                                    <span className="mt-1 block text-muted-foreground">{f.d}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </Section>

        <section className="bg-[hsl(var(--secondary))]">
            <Section width="narrow" className="py-20 text-center">
                <Reveal>
                    <BookOpen className="mx-auto h-8 w-8 text-[hsl(var(--gold))]" strokeWidth={1.75} />
                    <h2 className="mt-5 font-display text-3xl font-bold leading-tight md:text-4xl">
                        You do not have to face pain alone
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
                        The portal is a starting point. Pair it with a peer support session and a community that
                        prays with you, and you have a place to turn — any day, any hour.
                    </p>
                    <Link to="/sessions" className="mt-9 inline-flex min-h-[48px] items-center gap-2 bg-gold px-8 text-sm font-bold uppercase tracking-wider text-[hsl(var(--navy-deep))] transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
                        Find a peer support session <ArrowRight className="h-4 w-4" />
                    </Link>
                </Reveal>
            </Section>
        </section>

        <Section width="narrow" className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
                We are not health-care professionals, neither do we replace your health-care team. Please
                continue working with your team, if you have one. In case of a health crisis, we ask that you
                go to the Emergency Room that&rsquo;s nearest to you or contact the Crisis Helpline available
                in your area.
            </p>
        </Section>
    </SiteLayout>
);

export default ResourcesPage;
