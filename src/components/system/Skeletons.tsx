import type { CSSProperties, ReactNode } from 'react'
import './skeletons.css'

/**
 * SKELETONS — branded loading states.
 *
 * The idea: a skeleton is not a grey box, it is the layout waiting to
 * breathe. Every composition here mirrors the real component's markup
 * class-for-class, so content lands with zero shift — the page only
 * sharpens. Nothing here is decorative: it is the shape of what's coming.
 */

/** Carries the shimmer's phase as a negative animation delay. */
type SkelVars = CSSProperties & { '--skeleton-delay'?: string }

/**
 * `phase` is a per-block offset in ms. It is emitted NEGATIVE so every
 * block is already mid-sweep on first paint — a screen of skeletons
 * reads as one breathing surface, never a grid of blinking rectangles.
 */
function vars(phase: number, style?: CSSProperties): SkelVars {
  return phase ? { ...style, '--skeleton-delay': `-${phase}ms` } : { ...style }
}

/** The one primitive. Every skeleton in the app is built from this. */
export function Skeleton({
  className = '',
  style,
  phase = 0,
}: {
  className?: string
  style?: CSSProperties
  phase?: number
}) {
  return (
    <div
      className={`skeleton ${className}`.trim()}
      aria-hidden="true"
      style={vars(phase, style)}
    />
  )
}

/**
 * The PUNTA mark, loading.
 *
 * A miniature of the Entry cinematic, in three moves: the wordmark settles
 * from wide tracking into place, a warm capiz light passes through it and
 * rests, and a sun crosses a hairline horizon beneath. The letters double
 * as the skeleton — they are the ghost the light travels through.
 *
 * Pass `label` to make it announce itself; omit it (as SkeletonGroup
 * does) and it is purely decorative, so a screen reader hears the one
 * group message instead of a duplicate.
 */
export function PuntaLoader({
  size = 'md',
  tone = 'light',
  tagline,
  label,
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg'
  tone?: 'light' | 'dark'
  tagline?: string
  label?: string
  className?: string
}) {
  return (
    <div
      className={`punta-loader punta-loader--${size} punta-loader--${tone} ${className}`.trim()}
      role={label ? 'status' : undefined}
      aria-busy={label ? true : undefined}
      aria-hidden={label ? undefined : true}
    >
      <span className="punta-loader-mark">
        <span className="punta-loader-tile">P</span>
        <span className="punta-loader-word">PUNTA</span>
      </span>
      <span className="punta-loader-horizon" aria-hidden="true" />
      {tagline && <span className="punta-loader-tagline">{tagline}</span>}
      {label && <span className="sr-only">{label}</span>}
    </div>
  )
}

/**
 * The accessible wrapper for a set of skeletons. The visual blocks are
 * aria-hidden; the group carries one polite "Loading…" for screen
 * readers. Pair every page-level skeleton with this — never announce a
 * dozen separate loading messages.
 *
 * By default it leads with the PUNTA mark, so loading always looks like
 * the brand. Pass `brand={false}` for a bare grid, or a node to customise.
 */
export function SkeletonGroup({
  children,
  label = 'Loading',
  className,
  brand = true,
}: {
  children: ReactNode
  label?: string
  className?: string
  brand?: boolean | ReactNode
}) {
  return (
    <div className={className} role="status" aria-busy="true">
      <span className="sr-only">{label}</span>
      {brand === true ? (
        <PuntaLoader size="sm" className="skeleton-brand" />
      ) : (
        brand
      )}
      {children}
    </div>
  )
}

/**
 * Mirrors StayCard: media at 4/3, then the name + rating row, location,
 * tagline, and the price that sits on its own rule.
 */
export function CardSkeleton({ phase = 0 }: { phase?: number }) {
  return (
    <div className="stay-card skeleton-card" aria-hidden="true">
      <Skeleton className="skeleton--media" phase={phase} />
      <div className="stay-card-info">
        <div className="stay-card-top">
          <Skeleton className="skeleton--title" phase={phase} />
          <Skeleton className="skeleton--text" style={{ width: 40, marginTop: 3 }} phase={phase} />
        </div>
        <Skeleton
          className="skeleton--text skeleton-line"
          style={{ width: '46%' }}
          phase={phase}
        />
        <Skeleton
          className="skeleton--text skeleton-line"
          style={{ width: '82%' }}
          phase={phase}
        />
        <div className="stay-card-price">
          <Skeleton className="skeleton--text" style={{ width: 104 }} phase={phase} />
        </div>
      </div>
    </div>
  )
}

/**
 * Mirrors OverlayCard — the cinematic image card used across Explore.
 * The dark base and scrim mean the loading state already reads as the
 * photo it's standing in for.
 */
export function OverlayCardSkeleton({
  featured = false,
  phase = 0,
}: {
  featured?: boolean
  phase?: number
}) {
  return (
    <div
      className={`skeleton-ovl${featured ? ' skeleton-ovl--featured' : ''}`}
      aria-hidden="true"
    >
      <div className="skeleton-ovl-info">
        <div className="skeleton-ovl-top">
          <Skeleton className="skeleton--text" style={{ width: 118, height: 10 }} phase={phase} />
          <Skeleton className="skeleton--text" style={{ width: 44, height: 10 }} phase={phase} />
        </div>
        <Skeleton className="skeleton--title skeleton-ovl-name" phase={phase} />
        <Skeleton
          className="skeleton--text skeleton-ovl-line"
          style={{ height: 13 }}
          phase={phase}
        />
        <div className="skeleton-ovl-pricerow">
          <Skeleton className="skeleton--text" style={{ width: 92, height: 16 }} phase={phase} />
          <Skeleton
            className="skeleton--circle"
            style={{ width: 34, height: 34 }}
            phase={phase}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Mirrors the StayIndex rows — thumbnail, name/rating, location, tagline,
 * price. The list version of loading, for the whole collection at once.
 */
export function StayIndexSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <section className="skeleton-index" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => {
        const phase = i * 55
        return (
          <div className="skeleton-index-row" key={i}>
            <Skeleton className="skeleton-index-thumb" phase={phase} />
            <div className="skeleton-index-main">
              <div className="skeleton-index-top">
                <Skeleton className="skeleton--title" style={{ width: '48%' }} phase={phase} />
                <Skeleton
                  className="skeleton--text"
                  style={{ width: 52, marginTop: 3 }}
                  phase={phase}
                />
              </div>
              <Skeleton
                className="skeleton--text"
                style={{ width: '34%', height: 10 }}
                phase={phase}
              />
              <Skeleton
                className="skeleton--text"
                style={{ width: '62%', height: 13 }}
                phase={phase}
              />
            </div>
            <Skeleton className="skeleton--text" style={{ width: 74 }} phase={phase} />
          </div>
        )
      })}
    </section>
  )
}

/** Mirrors the Stay page gallery: one wide plate beside two stacked. */
export function GallerySkeleton() {
  return (
    <div className="skeleton-gallery" aria-hidden="true">
      <Skeleton className="skeleton-gallery-main" />
      <div className="skeleton-gallery-side">
        <Skeleton className="skeleton-gallery-thumb" phase={120} />
        <Skeleton className="skeleton-gallery-thumb" phase={240} />
      </div>
    </div>
  )
}

/** A single line of text — drop into any block that's still loading. */
export function LineSkeleton({ width = '70%' }: { width?: string }) {
  return <Skeleton className="skeleton--text" style={{ width }} />
}
