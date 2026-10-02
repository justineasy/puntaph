import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

/**
 * Editorial section heading — small tracked label, large serif title,
 * optional dek. Used across Explore/Home so every section shares one rhythm.
 */
export function SectionHeading({
  eyebrow,
  title,
  dek,
  action,
  light = false,
  id,
  level = 2,
}: {
  eyebrow?: string
  title: ReactNode
  dek?: string
  action?: ReactNode
  light?: boolean
  id?: string
  /** Heading level. Pages pass 1 when this is their only top heading;
      the rendered classes (and therefore pixels) are identical. */
  level?: 1 | 2
}) {
  const Heading = level === 1 ? 'h1' : 'h2'
  return (
    <div className={`sechead${light ? ' sechead--light' : ''}`}>
      <div className="sechead-text">
        {eyebrow && (
          <Reveal>
            <p className={`eyebrow ${light ? 'eyebrow--light' : 'eyebrow--dark'}`}>{eyebrow}</p>
          </Reveal>
        )}
        <Reveal delay={80}>
          <Heading className="h1 sechead-title" id={id}>{title}</Heading>
        </Reveal>
        {dek && (
          <Reveal delay={160}>
            <p className="sechead-dek">{dek}</p>
          </Reveal>
        )}
      </div>
      {action && <div className="sechead-action">{action}</div>}
    </div>
  )
}
