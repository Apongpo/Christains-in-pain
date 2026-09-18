import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, HandHeart, Users, BookOpen, MessageCircleHeart, ShieldCheck } from 'lucide-react';
import Reveal from '@/components/Reveal';
import Seo from '@/components/Seo';
import SiteLayout, { Section } from '@/components/SiteLayout';
const HERO = 'https://images.hostinger.com/cdd24c84-47f7-46c7-8896-7ebee03cf441.png';
const BIBLE = 'https://images.hostinger.com/793bbb83-7661-4935-8c99-0b69a54af7c2.png';
const CIRCLE = 'https://images.hostinger.com/cdd24c84-47f7-46c7-8896-7ebee03cf441.png';
const ticker = ['You are not alone', 'Psalm 34:18', 'Healing through faith', 'Carry each other\u2019s burdens', 'Galatians 6:2', 'Come as you are'];
const paths = [{
  icon: MessageCircleHeart,
  title: 'Share Your Story',
  text: 'Tell us what you are facing in your own words. Request prayer, peer support, or simply be heard \u2014 no account, no pressure.',
  to: '/share',
  cta: 'Share & request prayer'
}, {
  icon: Users,
  title: 'Join a Peer Support Session',
  text: 'One-on-one and small-group gatherings led by trained peers who have walked through illness and come out trusting Christ.',
  to: '/sessions',
  cta: 'See upcoming sessions'
}, {
  icon: HandHeart,
  title: 'Reach Out Directly',
  text: 'Not sure where to start? Send a message and we will guide you into the right conversation \u2014 gently and at your pace.',
  to: '/contact',
  cta: 'Contact the team'
}];
const HomePage = () => <SiteLayout>
        <Helmet>
            <title>Christians In Pain | Faith-Based Peer Support & Healing in Christ</title>
            <meta name="description" content="A welcoming Christian peer support community for believers living with health challenges. Share your story, request prayer, join a support session, and find spiritual, mental, and emotional healing through faith in God." />
        </Helmet>
        <Seo title="Christians In Pain | Faith-Based Peer Support & Healing" description="A Christian peer support community for anyone living with health challenges. Prayer, honest conversation, and hope in Jesus Christ." image={HERO} siteName="Christians In Pain" />

        {/* Hero */}
        <section className="relative isolate flex min-h-[100dvh] items-center overflow-hidden bg-navy">
            <img src={HERO} alt="A small group praying together in warm light" className="absolute inset-0 h-full w-full object-cover opacity-45" />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--navy))] via-[hsl(var(--navy))]/85 to-[hsl(var(--navy))]/40" />
            <Section width="wide" className="relative py-24">
                <Reveal>
                    <p className="text-xs uppercase tracking-[0.4em] text-gold">Christians In Pain &middot; Faith-Based Peer Support</p>
                </Reveal>
                <Reveal delay={0.08}>
                    <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.75rem,7vw,5.5rem)] font-black leading-[0.98] text-cream">
                        You don't have to
                        <span className="relative ml-3 inline-block text-gold">
                            carry this
                            <span className="absolute -bottom-2 left-0 h-1.5 w-full bg-gold/70" />
                        </span>
                        <br />
                        alone.
                    </h1>
                </Reveal>
                <Reveal delay={0.16}>
                    <p className="mt-8 max-w-xl text-lg leading-relaxed text-cream/80"><span style={{
            color: "rgb(26, 20, 10)"
          }}>A Christian peer support community for believers living with health challenges. We do not promise a physical cure -- we simply help point you to the God who heals the heart, renews the mind and walks with you every step of the way. Come as you are.</span></p>
                </Reveal>
                <Reveal delay={0.24}>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link to="/share" className="inline-flex min-h-[48px] items-center gap-2 bg-gold px-7 text-sm font-bold uppercase tracking-wider text-[hsl(var(--navy-deep))] transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
                            Share your story <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link to="/sessions" className="inline-flex min-h-[48px] items-center gap-2 border border-cream/40 px-7 text-sm font-bold uppercase tracking-wider text-cream transition-colors hover:border-gold hover:text-gold">
                            Find a support session
                        </Link>
                    </div>
                </Reveal>
                <Reveal delay={0.32}>
                    <p className="mt-14 max-w-md border-l-2 border-gold pl-5 font-display text-lg italic text-cream/85"><span style={{
            color: "rgb(26, 20, 10)"
          }}>“The Lord is near to the brokenhearted and saves the crushed in spirit.”<span className="mt-1 block text-sm not-italic tracking-wide text-gold">Psalm 34:18</span></span></p>
                </Reveal>
            </Section>
        </section>

        {/* Scripture ticker */}
        <div className="overflow-hidden border-y border-[hsl(var(--gold))]/30 bg-[hsl(var(--navy))] py-4">
            <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
                {[...ticker, ...ticker, ...ticker, ...ticker].map((t, i) => <span key={i} className="flex items-center gap-10 font-display text-sm uppercase tracking-[0.3em] text-cream/70">
                        {t}
                        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
                    </span>)}
            </div>
        </div>

        {/* Three paths */}
        <Section width="wide" className="py-24">
            <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:items-end">
                <Reveal>
                    <h2 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
                        A first step that takes five minutes
                    </h2>
                </Reveal>
                <Reveal delay={0.1}>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        No account. No intake form. No performance. Share what you are carrying, find a
                        session, or simply send a message — and let a community that understands walk with
                        you toward Christ.
                    </p>
                </Reveal>
            </div>
            <div className="mt-14 divide-y divide-border border-t border-border">
                {paths.map((p, i) => <Reveal key={p.title} delay={i * 0.08}>
                        <Link to={p.to} className="group grid items-start gap-6 py-10 md:grid-cols-[3rem_1fr_auto] md:gap-10">
                            <span className="grid h-12 w-12 place-items-center border border-[hsl(var(--gold))] text-[hsl(var(--gold))]">
                                <p.icon className="h-5 w-5" strokeWidth={1.75} />
                            </span>
                            <span>
                                <span className="block font-display text-2xl font-bold text-foreground">{p.title}</span>
                                <span className="mt-2 block max-w-xl text-muted-foreground">{p.text}</span>
                            </span>
                            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[hsl(var(--navy))] transition-transform group-hover:translate-x-1">
                                {p.cta} <ArrowRight className="h-4 w-4" />
                            </span>
                        </Link>
                    </Reveal>)}
            </div>
        </Section>

        {/* What healing means split */}
        <section className="bg-[hsl(var(--secondary))]">
            <Section width="wide" className="grid gap-14 py-24 lg:grid-cols-2 lg:items-center">
                <Reveal>
                    <div className="relative">
                        <img src={BIBLE} alt="Open Bible beside a brass lamp" className="w-full object-cover shadow-2xl" />
                    </div>
                </Reveal>
                <Reveal delay={0.1}>
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-[hsl(var(--gold))]">What we believe about healing</p>
                        <h2 className="mt-5 font-display text-4xl font-bold leading-tight md:text-5xl">
                            Healing comes from God, not from us
                        </h2>
                        <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
                            <p>
                                We are not healers. We are ordinary Christians who have known sickness, grief,
                                and fear — and who have met the God who meets us in it. We believe he still
                                heals, and we trust him even when he heals differently than we hoped.
                            </p>
                            <p>
                                So we pray for body, mind, and spirit alike. We celebrate physical healing when
                                it comes, and we hold on to Christ when it does not. Spiritual, mental, and
                                emotional transformation is real healing too — and it is where hope begins.
                            </p>
                        </div>
                        <dl className="mt-10 grid gap-8 sm:grid-cols-3">
                            {[['Spiritual', 'Faith renewed, identity restored in Christ'], ['Mental', 'Anxiety and despair met with truth and community'], ['Emotional', 'Grief and fear carried, not buried']].map(([n, l]) => <div key={n} className="border-t-2 border-[hsl(var(--gold))] pt-4">
                                    <dt className="font-display text-xl font-bold">{n}</dt>
                                    <dd className="mt-1 text-sm text-muted-foreground">{l}</dd>
                                </div>)}
                        </dl>
                    </div>
                </Reveal>
            </Section>
        </section>

        {/* Community band */}
        <section className="relative isolate overflow-hidden">
            <img src={CIRCLE} alt="Small group praying together" className="h-[22rem] w-full object-cover md:h-[26rem]" />
            <div className="absolute inset-0 bg-[hsl(var(--navy))]/70" />
            <Section className="absolute inset-0 flex flex-col items-start justify-center">
                <h2 className="max-w-xl font-display text-3xl font-bold leading-tight text-cream md:text-5xl">
                    Nobody should have to carry it alone.
                </h2>
                <Link to="/sessions" className="mt-8 inline-flex min-h-[48px] items-center gap-2 bg-gold px-7 text-sm font-bold uppercase tracking-wider text-[hsl(var(--navy-deep))] transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
                    Find a peer support session <ArrowRight className="h-4 w-4" />
                </Link>
            </Section>
        </section>

        {/* Trust / low-friction band */}
        <Section width="wide" className="grid gap-10 py-24 md:grid-cols-3">
            {[{
      icon: ShieldCheck,
      t: 'Confidential by default',
      d: 'Your story is shared only with trained peer leaders unless you choose otherwise.'
    }, {
      icon: Users,
      t: 'Led by peers who get it',
      d: 'Every session is guided by believers who have lived through illness and come out trusting Christ.'
    }, {
      icon: BookOpen,
      t: 'Grounded in Scripture',
      d: 'Prayer and conversation are anchored in the Bible, not generic advice or quick fixes.'
    }].map((f, i) => <Reveal key={f.t} delay={i * 0.08}>
                    <div className="border-t-2 border-[hsl(var(--gold))] pt-6">
                        <f.icon className="h-7 w-7 text-[hsl(var(--gold))]" strokeWidth={1.75} />
                        <h3 className="mt-4 font-display text-xl font-bold">{f.t}</h3>
                        <p className="mt-2 text-muted-foreground">{f.d}</p>
                    </div>
                </Reveal>)}
        </Section>

        {/* Disclaimer */}
        <Section width="narrow" className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
                We are not Healthcare professionals, neither do we replace your Healthcare team. Please,
                continue working with your team&mdash;if you have one&mdash;and in case of any medical
                emergency, we ask that you contact the crisis line available in your area.
            </p>
        </Section>

        {/* Final CTA */}
        <section className="bg-navy">
            <Section width="narrow" className="py-24 text-center">
                <Reveal>
                    <h2 className="font-display text-3xl font-bold text-cream md:text-5xl">Take the first step today</h2>
                    <p className="mx-auto mt-5 max-w-xl text-cream/75">
                        However heavy it feels right now, you do not have to name it perfectly. Just reach out.
                        Someone who understands will meet you there.
                    </p>
                    <div className="mt-9 flex flex-wrap justify-center gap-4">
                        <Link to="/share" className="inline-flex min-h-[48px] items-center gap-2 bg-gold px-8 text-sm font-bold uppercase tracking-wider text-[hsl(var(--navy-deep))] transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
                            Share your story <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link to="/contact" className="inline-flex min-h-[48px] items-center gap-2 border border-cream/40 px-8 text-sm font-bold uppercase tracking-wider text-cream transition-colors hover:border-gold hover:text-gold">
                            Contact us
                        </Link>
                    </div>
                </Reveal>
            </Section>
        </section>
    </SiteLayout>;
export default HomePage;