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
// bundle exists. Its removal is owned by the inline watchdog there, which
// waits until React has genuinely committed — if this render throws, the
// loader stays up and the watchdog swaps in its retry state instead of
// the page going blank.
