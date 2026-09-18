import React from 'react';
import { Section } from '@/components/SiteLayout';

const PageHero = ({ eyebrow, title, blurb, scripture, image }) => (
    <section className="relative isolate overflow-hidden bg-navy">
        {image && (
            <img
                src={image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-30"
                loading="lazy"
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--navy))]/80 via-[hsl(var(--navy))]/85 to-[hsl(var(--navy))]" />
        <Section className="relative py-20 md:py-28">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">{eyebrow}</p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-black leading-[1.05] text-cream md:text-6xl">
                {title}
            </h1>
            {blurb && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/75"><span style={{ color: 'rgb(26, 20, 10)' }}>{blurb}</span></p>}
            {scripture && (
                <p className="mt-8 border-l-2 border-gold pl-5 font-display text-lg italic text-gold">{scripture}</p>
            )}
        </Section>
    </section>
);

export default PageHero;
