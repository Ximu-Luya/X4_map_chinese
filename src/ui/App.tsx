import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { derelictShips, timelineShips, universeData } from '../data'
import { switchLocale, type SupportedLocale } from '../i18n'
import { MapShell } from '../map/MapShell'

const upstream = 'https://veanturverse.com'

function Header() {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [
    [t('navigation.home'), `${upstream}/index.html`],
    [t('navigation.whats_new'), `${upstream}/index.html#new`],
    [t('navigation.x4_foundations'), `${upstream}/x4-foundations.html`],
    [t('navigation.star_citizen'), `${upstream}/star-citizen.html`],
    [t('navigation.recruit_bonus'), `${upstream}/Referral.html`],
  ]
  const activeLocale: SupportedLocale = i18n.language.startsWith('zh') ? 'zh-CN' : 'en-US'

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
            {t('navigation.youtube')}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex border border-line bg-surface p-0.5 font-mono text-[10px]">
            {(['zh-CN', 'en-US'] as const).map((locale) => (
              <button
                key={locale}
                type="button"
                className={`px-2 py-1 ${activeLocale === locale ? 'bg-cyan text-base' : 'text-mute'}`}
                aria-pressed={activeLocale === locale}
                onClick={() => activeLocale !== locale && switchLocale(locale)}
              >
                {locale === 'zh-CN' ? '中文' : 'EN'}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="font-mono text-xs uppercase tracking-widest text-cyan md:hidden"
            aria-expanded={menuOpen}
            aria-label={t('accessibility.open_menu')}
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>
        </div>
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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-cyan">
      <span className="inline-block h-px w-6 bg-cyan" />
      {children}
    </div>
  )
}

function AboutContent() {
  const { t } = useTranslation()
  return (
    <section className="relative border-t border-subtle/60 py-12 md:py-16">
      <div className="mx-auto max-w-[1000px] px-5 md:px-8">
        <SectionLabel>{t('content.about_label')}</SectionLabel>
        <h1 className="mb-4 font-display text-2xl font-bold tracking-tight md:text-3xl">
          {t('content.about_title')}
        </h1>
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-mute">
          <p>{t('content.about_intro')}</p>
          <p>{t('content.about_usage')}</p>
          <p>{t('content.about_lenses')}</p>
        </div>
      </div>
    </section>
  )
}

function ShipSections() {
  const { t } = useTranslation()
  const sectorName = (name: string) => t(`sectors.${name}`, { defaultValue: name })

  return (
    <>
      <section className="border-t border-subtle/60 py-12 md:py-16">
        <div className="mx-auto max-w-[1000px] px-5 md:px-8">
          <SectionLabel>{t('content.free_ships_label')}</SectionLabel>
          <h2 className="mb-4 font-display text-2xl font-bold md:text-3xl">
            {t('content.free_ships_title')}
          </h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-mute">
            {t('content.free_ships_intro')}
          </p>
          <ol className="grid list-none gap-4 p-0 sm:grid-cols-2">
            {derelictShips.map((ship) => {
              const key = ship.slug.replaceAll('-', '_')
              const sector = universeData.sectors.find((item) => item.name === ship.sector)!
              return (
                <li key={ship.slug} className="border border-line bg-surface p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="bg-cyan2 px-2 py-1 font-mono text-xs font-bold text-base">
                      {ship.cls}
                    </span>
                    <h3 className="font-display text-lg font-bold">
                      {t(`ships.${key}.name`, { defaultValue: ship.name })}
                    </h3>
                  </div>
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-cyan2">
                    {t(`ships.${key}.role`, { defaultValue: ship.role })} · {sectorName(ship.sector)} (
                    {t(`factions.${sector.f}.short`, {
                      defaultValue: universeData.factions[sector.f].short,
                    })}
                    )
                  </p>
                  <p className="mb-3 text-[14px] leading-relaxed text-mute">
                    {t(`ships.${key}.find`, { defaultValue: ship.find })}
                  </p>
                  <div className="flex gap-4 font-mono text-[10px] uppercase tracking-[0.16em]">
                    <a className="text-cyan2 hover:underline" href={`?ship=${ship.slug}`}>
                      {t('content.show_on_map')}
                    </a>
                    <a
                      className="text-mute2 hover:text-cyan"
                      href={`${upstream}/guides/x4-derelict-ships.html#ship-${ship.slug}`}
                    >
                      {t('content.full_guide')}
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
          <SectionLabel>{t('content.timeline_label')}</SectionLabel>
          <h2 className="mb-4 font-display text-2xl font-bold md:text-3xl">
            {t('content.timeline_title')}
          </h2>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-mute">
            {t('content.timeline_intro')}
          </p>
          <ol className="grid list-none gap-4 p-0 sm:grid-cols-2">
            {timelineShips.map((ship) => {
              const key = ship.slug.replaceAll('-', '_')
              return (
                <li key={ship.slug} className="border border-line bg-surface p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="bg-purple-400 px-2 py-1 font-mono text-xs font-bold text-base">
                      {ship.tl}
                    </span>
                    <span className="bg-orange px-2 py-1 font-mono text-xs font-bold text-base">
                      {ship.cls}
                    </span>
                    <h3 className="font-display text-lg font-bold">
                      {t(`timeline_ships.${key}.name`, { defaultValue: ship.name })}
                    </h3>
                  </div>
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-purple-300">
                    {t(`timeline_ships.${key}.role`, { defaultValue: ship.role })} · {sectorName(ship.sector)}
                  </p>
                  <p className="mb-3 text-[14px] leading-relaxed text-mute">
                    {t(`timeline_ships.${key}.find`, { defaultValue: ship.find })}
                  </p>
                  <div className="flex gap-4 font-mono text-[10px] uppercase tracking-[0.16em]">
                    <a className="text-purple-300 hover:underline" href={`?tlship=${ship.slug}`}>
                      {t('content.show_on_map')}
                    </a>
                    <a
                      className="text-mute2 hover:text-cyan"
                      href={`${upstream}/guides/x4-derelict-ships.html#ship-${ship.slug}`}
                    >
                      {t('content.full_guide')}
                    </a>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>
    </>
  )
}

function Faq() {
  const { t } = useTranslation()
  const items = [
    ['content.faq_free_ships_question', 'content.faq_free_ships_answer'],
    ['content.faq_best_question', 'content.faq_best_answer'],
    ['content.faq_claim_question', 'content.faq_claim_answer'],
    ['content.faq_dlcs_question', 'content.faq_dlcs_answer'],
  ]
  return (
    <section className="border-t border-subtle/60 py-12 md:py-16">
      <div className="mx-auto max-w-[1000px] px-5 md:px-8">
        <SectionLabel>{t('content.faq_label')}</SectionLabel>
        <h2 className="mb-7 font-display text-2xl font-bold md:text-3xl">
          {t('content.faq_title')}
        </h2>
        <div className="flex max-w-2xl flex-col gap-5">
          {items.map(([question, answer]) => (
            <div key={question}>
              <h3 className="mb-1.5 font-display text-lg font-bold">{t(question)}</h3>
              <p className="text-[15px] leading-relaxed text-mute">{t(answer)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-subtle/60 py-14">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-5 md:flex-row md:items-center md:px-8">
        <div>
          <div className="mb-2 font-display text-base font-black tracking-[0.22em]">
            <span className="text-ink">VEANTUR</span>
            <span className="text-cyan">VERSE</span>
          </div>
          <p className="font-mono text-xs tracking-wider text-mute2">{t('content.footer')}</p>
        </div>
        <a className="font-mono text-xs uppercase tracking-widest text-cyan" href={upstream}>
          Original website ↗
        </a>
      </div>
    </footer>
  )
}

export function App() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language.startsWith('zh') ? 'zh-CN' : 'en-US'
    document.title = t('seo.page_title')
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) description.content = t('seo.description')
  }, [i18n.language, t])

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
