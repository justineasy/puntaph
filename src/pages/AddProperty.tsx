import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconArrowRight, IconCheck } from '../components/system/Icons'
import { DESTINATIONS } from '../data/destinations'
import { destImage } from '../data/images'
import { peso } from '../lib/format'
import './addproperty.css'

const STEPS = [
  'Property type',
  'Location',
  'Details',
  'Amenities',
  'Photos',
  'Pricing',
  'Rules',
  'Publish',
]

const TYPES = ['Villa', 'House', 'Loft', 'Condo', 'Cabin', 'Cottage', 'Lodge', 'Guesthouse']

export default function AddProperty() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    type: 'Villa',
    destination: 'Batangas',
    town: '',
    name: '',
    tagline: '',
    guests: 4,
    bedrooms: 2,
    beds: 3,
    baths: 2,
    amenities: [] as string[],
    price: 6500,
    minNights: 2,
    rules: '',
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleAmenity(a: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }))
  }

  function publish() {
    // prototype: pretend it saved, guide the host home
    window.setTimeout(() => navigate('/host/dashboard'), 700)
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="ap">
      <div className="shell">
        <header className="ap-head">
          <Link to="/host" className="ap-back">← Exit</Link>
          <p className="ap-title">List your place on PUNTA</p>
          <span className="ap-stepcount">
            {String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
          </span>
        </header>

        <div className="ap-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="ap-grid">
          <div className="ap-main">
            {step === 0 && (
              <section className="ap-step">
                <h1 className="h2">What kind of place is it?</h1>
                <div className="ap-opts">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`ap-opt${form.type === t ? ' is-active' : ''}`}
                      onClick={() => set('type', t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="ap-step">
                <h1 className="h2">Where is it?</h1>
                <div className="ap-opts">
                  {DESTINATIONS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className={`ap-opt${form.destination === d.name ? ' is-active' : ''}`}
                      onClick={() => set('destination', d.name)}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
                <label className="ap-field">
                  <span className="field-label">Town / area</span>
                  <input
                    className="input"
                    value={form.town}
                    onChange={(e) => set('town', e.target.value)}
                    placeholder="e.g. San Juan"
                  />
                </label>
              </section>
            )}

            {step === 2 && (
              <section className="ap-step">
                <h1 className="h2">The details</h1>
                <label className="ap-field">
                  <span className="field-label">Property name</span>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="e.g. Casa Sampaguita"
                  />
                </label>
                <label className="ap-field">
                  <span className="field-label">One-line description</span>
                  <input
                    className="input"
                    value={form.tagline}
                    onChange={(e) => set('tagline', e.target.value)}
                    placeholder="e.g. A garden house five minutes from the sea"
                  />
                </label>
                <div className="ap-counts">
                  {(
                    [
                      ['guests', 'Guests'],
                      ['bedrooms', 'Bedrooms'],
                      ['beds', 'Beds'],
                      ['baths', 'Bathrooms'],
                    ] as const
                  ).map(([k, label]) => (
                    <div key={k} className="ap-count">
                      <span className="field-label">{label}</span>
                      <div className="sb-stepper">
                        <button type="button" onClick={() => set(k, Math.max(1, form[k] - 1))} aria-label={`Fewer ${label}`}>−</button>
                        <span>{form[k]}</span>
                        <button type="button" onClick={() => set(k, Math.min(16, form[k] + 1))} aria-label={`More ${label}`}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="ap-step">
                <h1 className="h2">What do you offer?</h1>
                <div className="ap-opts">
                  {['Pool', 'Wi-Fi', 'Air conditioning', 'Free parking', 'Full kitchen', 'Beachfront access', 'Fireplace', 'Grill'].map((a) => (
                    <button
                      key={a}
                      type="button"
                      className={`chip ap-chip${form.amenities.includes(a) ? ' is-active' : ''}`}
                      onClick={() => toggleAmenity(a)}
                    >
                      {form.amenities.includes(a) && <IconCheck />} {a}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="ap-step">
                <h1 className="h2">Photos</h1>
                <p className="muted ap-hint">
                  In production you’d upload photos here. For the prototype we
                  reserve a professional photo set for your listing.
                </p>
                <div className="ap-photos">
                  {['hero', 'living', 'bedroom', 'outdoor'].map((r) => (
                    <div key={r} className="ap-photo">
                      <img decoding="async"
                        src={`https://picsum.photos/seed/punta-new-${r}/800/600`}
                        alt={`Reserved ${r} photo`}
                        loading="lazy"
                      />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {step === 5 && (
              <section className="ap-step">
                <h1 className="h2">Pricing</h1>
                <label className="ap-field">
                  <span className="field-label">Nightly rate</span>
                  <input
                    type="range"
                    min={2500}
                    max={25000}
                    step={500}
                    value={form.price}
                    onChange={(e) => set('price', Number(e.target.value))}
                    aria-label="Nightly rate"
                  />
                  <p className="ap-priceval">{peso(form.price)} <span className="muted">/ night</span></p>
                </label>
                <div className="ap-count">
                  <span className="field-label">Minimum nights</span>
                  <div className="sb-stepper">
                    <button type="button" onClick={() => set('minNights', Math.max(1, form.minNights - 1))}>−</button>
                    <span>{form.minNights}</span>
                    <button type="button" onClick={() => set('minNights', Math.min(14, form.minNights + 1))}>+</button>
                  </div>
                </div>
              </section>
            )}

            {step === 6 && (
              <section className="ap-step">
                <h1 className="h2">House rules</h1>
                <label className="ap-field">
                  <span className="field-label">Anything guests should know?</span>
                  <textarea
                    className="input ap-rules"
                    rows={5}
                    value={form.rules}
                    onChange={(e) => set('rules', e.target.value)}
                    placeholder="Quiet hours after 10 pm. The gate closes at midnight. Our dog Chimay roams the garden."
                  />
                </label>
              </section>
            )}

            {step === 7 && (
              <section className="ap-step">
                <h1 className="h2">Ready to publish?</h1>
                <p className="muted ap-hint">
                  Our editors review new listings within 24 hours. You’ll get a
                  note the moment your place goes live.
                </p>
                <button type="button" className="btn btn--forest btn--lg" onClick={publish}>
                  Publish listing <IconArrowRight />
                </button>
              </section>
            )}

            <div className="ap-nav">
              {step > 0 && (
                <button type="button" className="btn btn--ghost" onClick={() => setStep(step - 1)}>
                  Back
                </button>
              )}
              {step < 7 ? (
                <button type="button" className="btn btn--primary" onClick={() => setStep(step + 1)}>
                  Continue
                </button>
              ) : (
                <span />
              )}
            </div>
          </div>

          {/* live preview */}
          <aside className="ap-side" aria-label="Live preview">
            <p className="field-label">Live preview</p>
            <div className="ap-preview">
              <img decoding="async" src={destImage(form.destination.toLowerCase(), 800, 600)} alt="" />
              <div className="ap-preview-body">
                <div className="ap-preview-top">
                  <p className="ap-preview-name">{form.name || 'Your place’s name'}</p>
                  <span className="rating">★ 4.85</span>
                </div>
                <p className="muted ap-preview-loc">
                  {form.town ? `${form.town}, ` : ''}
                  {form.destination}
                </p>
                <p className="ap-preview-tag">{form.tagline || 'A one-line promise goes here.'}</p>
                <p className="ap-preview-price">
                  {peso(form.price)} <span className="muted">/ night</span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
