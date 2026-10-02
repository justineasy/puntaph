import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Entry from './components/entry/Entry'
import Navbar from './components/layout/Navbar'
import MobileNav from './components/layout/MobileNav'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Stay from './pages/Stay'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import Story from './pages/Story'
import Trips from './pages/Trips'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'
import Host from './pages/Host'
import HostDashboard from './pages/HostDashboard'
import AddProperty from './pages/AddProperty'
import { DestinationsPage, DestinationDetailPage } from './pages/platform/DestinationsPage'
import ExperiencesPage from './pages/platform/ExperiencesPage'
import DiningPage from './pages/platform/DiningPage'
import TransportationPage from './pages/platform/TransportationPage'
import EsimPage from './pages/platform/EsimPage'
import MapPage from './pages/platform/MapPage'
import MyTripPage from './pages/platform/MyTripPage'
import NotFound from './pages/NotFound'
import { ProgressBar } from './components/system/ProgressBar'
import { ErrorBoundary } from './components/system/ErrorBoundary'
import BackToTop from './components/system/BackToTop'
import { MemberBar } from './components/entry/MemberBar'
import './components/system/errorboundary.css'

export default function App() {
  const location = useLocation()
  const [entered, setEntered] = useState(false) // cinematic entry finished

  const isHostPage =
    location.pathname.startsWith('/host') &&
    location.pathname !== '/host'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const siteVisible = entered

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Entry onDone={() => setEntered(true)} />
      <MemberBar />
      <div
        className={`site${siteVisible ? ' is-in' : ''}`}
        aria-hidden={!siteVisible}
        // visibility (not opacity) keeps the hidden site out of the focus
        // order; the fade itself lives in CSS on `.site.is-in > *`
        style={{ visibility: siteVisible ? 'visible' : 'hidden' }}
      >
        {!isHostPage && <Navbar />}
        <main id="main">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/stay/:id" element={<Stay />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/confirmation/:id" element={<Confirmation />} />
              <Route path="/story/:key" element={<Story />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/host" element={<Host />} />
              <Route path="/host/dashboard" element={<HostDashboard />} />
              <Route path="/host/list" element={<AddProperty />} />
              {/* ————— platform additions ————— */}
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/destinations/:id" element={<DestinationDetailPage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/dining" element={<DiningPage />} />
              <Route path="/transportation" element={<TransportationPage />} />
              <Route path="/esim" element={<EsimPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/mytrip" element={<MyTripPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </main>
        {!isHostPage && <Footer />}
        {!isHostPage && <MobileNav />}
        {!isHostPage && <BackToTop />}
        <ProgressBar />
      </div>
    </>
  )
}
