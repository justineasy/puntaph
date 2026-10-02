import { Component, type ErrorInfo, type ReactNode } from 'react'

interface State {
  error: Error | null
}

/**
 * Last-resort boundary — if any route crashes, show a branded recovery
 * screen instead of a blank page. A prototype should never be "nothing".
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // surfacing to console keeps dev diagnosis easy
    console.error('PUNTA crashed:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="shell errbound">
          <p className="eyebrow eyebrow--dark">Something drifted off course</p>
          <h1 className="h1">This view didn’t load.</h1>
          <p className="muted errbound-sub">
            It’s usually a stale page after an update — a refresh clears it.
          </p>
          <div className="errbound-actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              Refresh the page
            </button>
            <a href="#/" className="btn btn--ghost">
              Back to the homepage
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
