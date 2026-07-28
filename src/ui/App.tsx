import { useState } from 'react'

import { derelictShips, timelineShips, universeData } from '../data'
import { MapShell } from '../map/MapShell'

const upstream = 'https://veanturverse.com'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [
    ['Home', `${upstream}/index.html`],
    ["What's New", `${upstream}/index.html#new`],
    ['X4 Foundations', `${upstream}/x4-foundations.html`],
    ['Star Citizen', `${upstream}/star-citizen.html`],
    ['Recruit Bonus', `${upstream}/Referral.html`],
  ]

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-subtle/80 bg-base/95 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-5 md:px-8">
        <a href={upstream} className="font-display text-base font-black tracking-[0.22em]">
          <span className="text-ink">VEANTUR</span>
          <span className="text-cyan">VERSE</span>
        </a>
        <nav className="hidden items-center gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-mute md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="transition-colors hover:text-cyan">
              {label}
            </a>
          ))}
          <a href="https://www.youtube.com/@Veantur" className="hover:text-cyan">
            YouTube
          </a>
        </nav>
        <button
          type="button"
          className="font-mono text-xs uppercase tracking-widest text-cyan md:hidden"
          aria-expanded={menuOpen}
          aria-label="Open menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>
      </div>
      {menuOpen ? (
        <nav className="absolute inset-x-0 top-16 flex flex-col gap-4 border-b border-line bg-base p-6 font-mono text-xs uppercase tracking-widest md:hidden">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-cyan">
      <span className="inline-block h-px w-6 bg-cyan" />
      {children}
    </div>
  )
}

function AboutContent() {
  return (
    <section className="relative border-t border-subtle/60 py-12 md:py-16">
      <div className="mx-auto max-w-[1000px] px-5 md:px-8">
        <SectionLabel>About this map</SectionLabel>
        <h1 className="mb-4 font-display text-2xl font-bold tracking-tight md:text-3xl">
          The interactive X4 Foundations galaxy map, every sector, all DLCs
        </h1>
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-mute">
          <p>
            Every sector in the current X4: Foundations galaxy with all expansions installed.
            Hexes are coloured by their controlling faction; lines are gate links and dashed
            lines are super-highways.
          </p>
          <p>
            Search any system by name, inspect fixed stations and resources, mark derelict ships,
            highlight special sectors and plot a gate-by-gate route across the universe.
          </p>
        </div>
      </div>
    </section>
  )
}

function ShipSections() {
  return (
    <>
      <section className="border-t border-subtle/60 py-12 md:py-16">
        <div className="mx-auto max-w-[1000px] px-5 md:px-8">
          <SectionLabel>Free ships</SectionLabel>
          <h2 className="mb-4 font-display text-2xl font-bold md:text-3xl">
            Free, derelict and abandoned ships in X4: Foundations
          </h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-mute">
            Six confirmed ownerless ships can be claimed in a spacesuit. Enable the Derelict Ships
            lens to show their sectors and plan a route from your current system.
          </p>
          <ol className="grid list-none gap-4 p-0 sm:grid-cols-2">
            {derelictShips.map((ship) => {
              const sector = universeData.sectors.find((item) => item.name === ship.sector)!
              return (
                <li key={ship.slug} className="border border-line bg-surface p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="bg-cyan2 px-2 py-1 font-mono text-xs font-bold text-base">
                      {ship.cls}
                    </span>
                    <h3 className="font-display text-lg font-bold">{ship.name}</h3>
                  </div>
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-cyan2">
                    {ship.role} · {ship.sector} ({universeData.factions[sector.f].short})
                  </p>
                  <p className="mb-3 text-[14px] leading-relaxed text-mute">{ship.find}</p>
                  <div className="flex gap-4 font-mono text-[10px] uppercase tracking-[0.16em]">
                    <a className="text-cyan2 hover:underline" href={`?ship=${ship.slug}`}>
                      Show on map
                    </a>
                    <a
                      className="text-mute2 hover:text-cyan"
                      href={`${upstream}/guides/x4-derelict-ships.html#ship-${ship.slug}`}
                    >
                      Full guide
                    </a>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="border-t border-subtle/60 py-12 md:py-16">
        <div className="mx-auto max-w-[1000px] px-5 md:px-8">
          <SectionLabel>Timeline ships</SectionLabel>
          <h2 className="mb-4 font-display text-2xl font-bold md:text-3xl">
            Timeline-reward ships in X4: Foundations
          </h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-mute">
            Nine unique reward ships appear after their matching Timelines scenario is completed.
            They share the derelict lens and are marked in violet.
          </p>
          <ol className="grid list-none gap-4 p-0 sm:grid-cols-2">
            {timelineShips.map((ship) => (
              <li key={ship.slug} className="border border-line bg-surface p-5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="bg-purple-400 px-2 py-1 font-mono text-xs font-bold text-base">
                    {ship.tl}
                  </span>
                  <span className="bg-orange px-2 py-1 font-mono text-xs font-bold text-base">
                    {ship.cls}
                  </span>
                  <h3 className="font-display text-lg font-bold">{ship.name}</h3>
                </div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-purple-300">
                  {ship.role} · {ship.sector}
                </p>
                <p className="mb-3 text-[14px] leading-relaxed text-mute">{ship.find}</p>
                <div className="flex gap-4 font-mono text-[10px] uppercase tracking-[0.16em]">
                  <a className="text-purple-300 hover:underline" href={`?tlship=${ship.slug}`}>
                    Show on map
                  </a>
                  <a
                    className="text-mute2 hover:text-cyan"
                    href={`${upstream}/guides/x4-derelict-ships.html#ship-${ship.slug}`}
                  >
                    Full guide
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}

function Faq() {
  const items = [
    [
      'Where do I find free ships in X4: Foundations?',
      'Confirmed locations include Grand Exchange I, Silent Witness XII, Nopileos’ Fortune II, Company Regard, The Void and Faulty Logic VII.',
    ],
    [
      'What is the best free ship in X4?',
      'The Odysseus Vanguard in Faulty Logic VII is an L-class destroyer that can be claimed by spacewalking to the bridge.',
    ],
    [
      'Does this map include all DLCs?',
      'Yes. The sector layout includes the current v9.0 universe represented by the exported source data.',
    ],
  ]
  return (
    <section className="border-t border-subtle/60 py-12 md:py-16">
      <div className="mx-auto max-w-[1000px] px-5 md:px-8">
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="mb-7 font-display text-2xl font-bold md:text-3xl">
          X4 map and free ships, quick answers
        </h2>
        <div className="flex max-w-2xl flex-col gap-5">
          {items.map(([question, answer]) => (
            <div key={question}>
              <h3 className="mb-1.5 font-display text-lg font-bold">{question}</h3>
              <p className="text-[15px] leading-relaxed text-mute">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-subtle/60 py-14">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-5 md:flex-row md:items-center md:px-8">
        <div>
          <div className="mb-2 font-display text-base font-black tracking-[0.22em]">
            <span className="text-ink">VEANTUR</span>
            <span className="text-cyan">VERSE</span>
          </div>
          <p className="font-mono text-xs tracking-wider text-mute2">
            Source snapshot © 2026 Veantur · engineering reconstruction
          </p>
        </div>
        <a className="font-mono text-xs uppercase tracking-widest text-cyan" href={upstream}>
          Original website ↗
        </a>
      </div>
    </footer>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-base text-ink">
      <Header />
      <main>
        <MapShell />
        <AboutContent />
        <ShipSections />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}
