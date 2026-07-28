import { useEffect } from 'react'

import { createMap } from './createMap'

export function MapShell() {
  useEffect(() => {
    createMap()
  }, [])

  return (
    <section id="mapRoot" aria-label="Interactive X4 universe map">
      <svg id="mapSvg" xmlns="http://www.w3.org/2000/svg">
        <g id="gViewport">
          <g id="gEdges" />
          <g id="gHex" />
          <g id="gNode" />
          <g id="gLabel" />
        </g>
      </svg>

      <div id="mapPins" />
      <div id="mapPinsTl" />
      <div id="routeHint" className="ov">
        ◎ Click your start system · Esc to cancel
      </div>
      <div id="khaakNote" className="ov panelbox" />
      <div id="terraformNote" className="ov panelbox" />
      <div id="hoverInfo" />

      <div id="imgLightbox" role="dialog" aria-modal="true" aria-label="Ship image">
        <button className="lb-close" aria-label="Close image">
          ×
        </button>
        <img alt="" />
        <div className="lb-cap" />
      </div>

      <div id="mapTopL" className="ov">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mt-title panelbox relative">
            <span className="corner tl text-cyan" />
            <span className="corner br text-cyan" />
            <div className="mt-kicker">X4 Foundations · v9.0</div>
            <div className="mt-h">UNIVERSE MAP</div>
          </div>
          <button
            id="lensShips"
            className="lens-toggle panelbox"
            aria-pressed="false"
            title="Toggle derelict and timeline-reward ship locations"
          >
            <span className="lens-ic">◆</span> Derelict Ships
          </button>
          <button
            id="lensTimeline"
            className="lens-toggle tl panelbox"
            aria-pressed="false"
            title="Toggle Timeline-reward ship locations"
            hidden
          >
            <span className="lens-ic">✦</span> Timeline Ships
          </button>
          <button
            id="lensKhaak"
            className="lens-toggle kk panelbox"
            aria-pressed="false"
            title="Highlight sectors safe from Kha'ak raids"
            hidden
          >
            <span className="lens-ic">⬡</span> Kha&apos;ak-safe
          </button>
          <button
            id="lensTerraform"
            className="lens-toggle tf panelbox"
            aria-pressed="false"
            title="Highlight sectors with a terraformable planet"
            hidden
          >
            <span className="lens-ic">⊕</span> Terraforming
          </button>
          <button
            id="routePlanBtn"
            className="lens-toggle panelbox"
            aria-pressed="false"
            title="Plan a gate route between any two sectors"
          >
            <span className="lens-ic">▸</span> Plan a Route
          </button>
        </div>

        <div id="routePlanner" className="panelbox">
          <div className="rp-row">
            <span className="rp-lbl rp-from">From</span>
            <input
              id="rpFrom"
              type="text"
              placeholder="Start sector…"
              autoComplete="off"
              spellCheck={false}
            />
            <ul id="rpFromResults" className="rp-results" />
          </div>
          <div className="rp-row">
            <span className="rp-lbl rp-to">To</span>
            <input
              id="rpTo"
              type="text"
              placeholder="Destination sector…"
              autoComplete="off"
              spellCheck={false}
            />
            <ul id="rpToResults" className="rp-results" />
          </div>
          <div className="rp-actions">
            <button id="rpGo" className="rp-btn">
              Plot route
            </button>
            <button id="rpClear" className="rp-btn ghost">
              Clear
            </button>
          </div>
          <div id="rpMsg" className="rp-msg" />
        </div>

        <div className="searchwrap">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="m11 11 3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            id="mapSearch"
            type="text"
            placeholder="Search sector…"
            autoComplete="off"
            spellCheck={false}
          />
          <ul id="searchResults" className="panelbox" />
        </div>
        <div id="stationFinder" className="panelbox" />
        <div id="mapOptions" className="panelbox">
          <label className="opt">
            <input type="checkbox" id="optCenter" />
            <span>Recenter on click</span>
          </label>
        </div>
      </div>

      <div id="shipsPanels" className="ov">
        <div id="shipsIndex" className="panelbox" />
        <div id="timelineIndex" className="panelbox" />
      </div>
      <div id="mapLegend" className="ov panelbox" />

      <div id="mapZoom" className="ov">
        <button id="zoomIn" className="panelbox" aria-label="Zoom in">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </button>
        <button id="zoomOut" className="panelbox" aria-label="Zoom out">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" strokeLinecap="round" />
          </svg>
        </button>
        <button id="zoomFit" className="panelbox" aria-label="Reset view">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div id="mapHint" className="ov">
        Drag to pan · Scroll to zoom · Click a sector
      </div>
      <aside id="mapPanel" className="panelbox" aria-live="polite" />
    </section>
  )
}
