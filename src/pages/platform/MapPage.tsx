import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../../components/system/SectionHeading'
import { POIS, MAP_CATEGORIES } from '../../data/platform'
import type { Poi } from '../../data/platform'
import '../platform.css'

/**
 * INTERACTIVE MAP — a dependency-free pan/zoom canvas plotting the
 * fictional PUNTA world. Isolated page; nothing here touches existing
 * pages. Real tile servers can replace the canvas layer later.
 */

// project lat/lng into the 2400x1400 canvas (Philippines bounds)
const BOUNDS = { minLat: 5.5, maxLat: 19.5, minLng: 116, maxLng: 127 }

function project(coords: { lat: number; lng: number }) {
  const x = ((coords.lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 2400
  const y = (1 - (coords.lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 1400
  return { x, y }
}

export default function MapPage() {
  const [cat, setCat] = useState<string>('all')
  const [selected, setSelected] = useState<Poi | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: -500, y: -200 }) // start centered on the archipelago
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number; moved: boolean } | null>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  const pois = useMemo(
    () => (cat === 'all' ? POIS : POIS.filter((p) => p.kind === cat)),
    [cat],
  )

  function onPointerDown(e: React.PointerEvent) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y, moved: false }
    viewportRef.current?.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current
    if (!d) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (Math.abs(dx) + Math.abs(dy) > 4) {
      d.moved = true
      viewportRef.current?.classList.add('is-dragging')
    }
    if (d.moved) {
      setSelected(null) // dragging dismisses the detail card
      setPan({ x: d.panX + dx, y: d.panY + dy })
    }
  }

  function onPointerUp() {
    dragRef.current = null
    viewportRef.current?.classList.remove('is-dragging')
  }

  function zoomBy(delta: number) {
    setZoom((z) => Math.min(2.6, Math.max(0.7, z + delta)))
  }

  return (
    <div className="pl shell">
      <header className="pl-hero">
        <SectionHeading
          level={1}
          eyebrow="The archipelago"
          title={
            <>
              Everything,
              <br />
              on one map
            </>
          }
          dek="Stays, experiences, tables, attractions, and gateways — drag to explore, pinch or use the buttons to zoom, tap a pin for details."
        />
      </header>

      <div className="mapwrap">
        <div
          ref={viewportRef}
          className="mapviewport"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div
            className="mapcanvas"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          >
            <div className="mapgraticule" />
            {pois.map((p) => {
              const { x, y } = project(p.coords)
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`mappin mappin--${p.kind}${selected?.id === p.id ? ' is-selected' : ''}`}
                  style={{ left: x, top: y }}
                  onClick={() => !dragRef.current?.moved && setSelected(p)}
                  aria-label={`${p.name} — ${p.detail}`}
                >
                  <span className="mappin-dot" />
                  <span className="mappin-label">{p.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="maplegend" role="tablist" aria-label="Map categories">
          {MAP_CATEGORIES.map((c) => (
            <button
              key={c.key}
              role="tab"
              aria-selected={cat === c.key}
              className={`mapcat${cat === c.key ? ' is-active' : ''}`}
              onClick={() => {
                setCat(c.key)
                setSelected(null)
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="map-controls">
          <button type="button" className="map-zoombtn" onClick={() => zoomBy(0.25)} aria-label="Zoom in">+</button>
          <button type="button" className="map-zoombtn" onClick={() => zoomBy(-0.25)} aria-label="Zoom out">−</button>
        </div>

        {selected && (
          <aside className="map-detail" role="dialog" aria-label={selected.name}>
            <p className="plc-loc">{selected.kind}</p>
            <h3 className="h3" style={{ marginTop: 6 }}>{selected.name}</h3>
            <p className="muted" style={{ marginTop: 4, fontSize: 14 }}>{selected.detail}</p>
            <div className="map-detail-actions">
              {selected.kind === 'stay' && selected.refId && (
                <Link to={`/stay/${selected.refId}`} className="btn btn--primary" style={{ padding: '10px 18px', fontSize: 13 }}>
                  View stay
                </Link>
              )}
              {selected.kind === 'experience' && (
                <Link to="/experiences" className="btn btn--primary" style={{ padding: '10px 18px', fontSize: 13 }}>
                  Experiences
                </Link>
              )}
              {selected.kind === 'restaurant' && (
                <Link to="/dining" className="btn btn--primary" style={{ padding: '10px 18px', fontSize: 13 }}>
                  Dining
                </Link>
              )}
              <button type="button" className="btn btn--ghost" style={{ padding: '10px 18px', fontSize: 13 }} onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
