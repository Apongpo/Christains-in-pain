import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';
const links = [{
  to: '/',
  label: 'Home'
}, {
  to: '/share',
  label: 'Share Your Story'
}, {
  to: '/sessions',
  label: 'Peer Support'
}, {
  to: '/resources',
  label: 'Resources'
}, {
  to: '/contact',
  label: 'Contact'
}];
export const Section = ({
  children,
  className = '',
  width = 'standard'
}) => {
  const rail = width === 'narrow' ? 'max-w-[56rem]' : width === 'wide' ? 'max-w-[90rem]' : 'max-w-[72rem]';
  return <div className={`mx-auto w-full ${rail} px-6 md:px-10 ${className}`}>{children}</div>;
};
const SiteLayout = ({
  children
}) => {
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 bg-navy/95 backdrop-blur border-b border-white/10">
                <Section width="wide" className="flex items-center justify-between py-4">
                    <Link to="/" className="flex items-center gap-3 text-cream">
                        <img src={logo} alt="Christians In Pain logo" className="h-11 w-11" />
                        <span className="font-display text-lg font-bold tracking-tight">
                            Christians In Pain
                        </span>
                    </Link>
                    <nav className="hidden lg:flex items-center gap-6">
                        {links.map(l => <NavLink key={l.to} to={l.to} className={({
            isActive
          }) => `text-sm font-medium transition-colors ${isActive ? 'text-gold' : 'text-cream/75 hover:text-cream'}`}>
                                {l.label}
                            </NavLink>)}
                    </nav>
                    <button type="button" aria-label="Toggle menu" onClick={() => setOpen(v => !v)} className="lg:hidden grid h-11 w-11 place-items-center text-cream">
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </Section>
                {open && <nav className="lg:hidden border-t border-white/10 bg-navy pb-4">
                        <Section className="flex flex-col">
                            {links.map(l => <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-3 text-base text-cream/85 border-b border-white/5">
                                    {l.label}
                                </NavLink>)}
                        </Section>
                    </nav>}
            </header>

            <main>{children}</main>

            <footer className="bg-navy text-cream/70">
                <Section width="wide" className="grid gap-10 py-16 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <p className="font-display text-2xl font-bold text-cream">Christians In Pain</p>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed"><span style={{
              color: "rgb(26, 20, 10)"
            }}>A peer support community for Christians living with health challenges. We walk together through prayer, honest conversation, and the unchanging hope of the gospel of Jesus Christ. Healing comes from God; we simply hold each other up while he works.</span></p>
                        <p className="mt-5 font-display italic text-gold">
                            &ldquo;The Lord is near to the brokenhearted and saves the crushed in spirit.&rdquo; — Psalm 34:18
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gold">Explore</p>
                        <ul className="mt-4 space-y-2 text-sm">
                            {links.map(l => <li key={l.to}>
                                    <Link to={l.to} className="text-warm-gold hover:text-cream">{l.label}</Link>
                                </li>)}
                        </ul>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gold">Reach us</p>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li className="text-warm-gold">christiansinpain@gmail.com</li>
                            <li className="text-warm-gold">Peer support line: email (christiansinpain@gmail.com)</li>
                            <li className="text-warm-gold">Online peer support sessions</li>
                            <li className="text-warm-gold">No account needed to connect</li>
                        </ul>
                    </div>
                </Section>
                <div className="border-t border-white/10 py-6 text-center text-xs">
                    &copy; {new Date().getFullYear()} Christians In Pain. A faith-based peer support ministry.
                </div>
            </footer>
        </div>;
};
export default SiteLayout;