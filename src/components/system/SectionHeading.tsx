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
}: {
  eyebrow?: string
  title: ReactNode
  dek?: string
  action?: ReactNode
  light?: boolean
  id?: string
}) {
  return (
    <div className={`sechead${light ? ' sechead--light' : ''}`}>
      <div className="sechead-text">
        {eyebrow && (
          <Reveal>
            <p className={`eyebrow ${light ? 'eyebrow--light' : 'eyebrow--dark'}`}>{eyebrow}</p>
          </Reveal>
        )}
        <Reveal delay={80}>
          <h2 className="h1 sechead-title" id={id}>{title}</h2>
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
