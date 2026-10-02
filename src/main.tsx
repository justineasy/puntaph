import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { AppProvider } from './state/AppContext'
import { SessionProvider } from './state/SessionContext'
import { RegionProvider } from './state/RegionContext'
import { MyTripProvider } from './state/MyTripContext'
import ScrollToTop from './components/system/ScrollToTop'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Fragment>
    <RegionProvider>
      <SessionProvider>
        <MyTripProvider>
          <AppProvider>
            <HashRouter>
              <ScrollToTop />
              <App />
            </HashRouter>
          </AppProvider>
        </MyTripProvider>
      </SessionProvider>
    </RegionProvider>
  </React.Fragment>,
)

// The branded boot loader lives in index.html and is painted before the
// bundle exists, so it can never flash an unstyled blank. React clears
// it on mount; we sweep up the node just in case a browser kept it.
requestAnimationFrame(() => {
  document.querySelector('.boot')?.remove()
})
