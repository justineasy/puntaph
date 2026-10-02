/* ————— PUNTA static generation (runs after `vite build`) —————
 *
 * The SPA renders everything client-side, so crawlers and link
 * previews used to see only "Loading PUNTA". This script closes that
 * gap WITHOUT touching the app or how it looks:
 *
 *   1. dist/index.html  — fills #prerender with the home page's real
 *      content (h1, destinations, featured stays) and appends an
 *      ItemList of all stays as JSON-LD.
 *   2. dist/stay/*.html  — one static page per stay: its own <title>,
 *      description, canonical, og/twitter tags, JSON-LD and prerendered
 *      content. Served at /stay/<id> (vercel.json cleanUrls). The tiny
 *      inline script in the page maps the path back onto the hash
 *      router, so a human lands in the exact same SPA page as always —
 *      the static layer is only ever read by crawlers.
 *   3. dist/sitemap.xml  — home + every stay.
 *
 * Data comes straight from the app's own modules (bundled with esbuild,
 * which ships with Vite), so the static text can never drift from the
 * rendered text.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { build } from 'esbuild'

const ORIGIN = 'https://puntaph.vercel.app'
const DIST = resolve('dist')

/** Bundle a TS data module and import it in this process. */
async function loadData(entry) {
  const result = await build({
    entryPoints: [resolve(entry)],
    bundle: true,
    format: 'esm',
    write: false,
    platform: 'neutral',
    target: 'es2020',
    logLevel: 'silent',
  })
  const code = result.outputFiles[0].text
  return import('data:text/javascript;base64,' + Buffer.from(code, 'utf8').toString('base64'))
}

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const peso = (n) => '\u20b1' + n.toLocaleString('en-US')

/** A JSON-LD block that can never break out of its script tag. */
const jsonLd = (obj) =>
  '<script type="application/ld+json">' +
  JSON.stringify(obj).replace(/</g, '\\u003c') +
  '<\/script>'

/** The #prerender node, tolerant of attribute minification. */
const PRERENDER_RE = /<div id="prerender"[^>]*><\/div>/
const prerenderOpen = (body) =>
  '<div id="prerender" style="position: fixed; inset: 0; overflow: hidden">' + body + '</div>'

/** Swap the content="" of <meta name|property="key" content="…">. */
function setMeta(html, attr, key, value) {
  const re = new RegExp(
    '(<meta\\s+(?:name|property)="' + key + '"\\s+content=")[^"]*(")',
    'i'
  )
  if (!re.test(html)) throw new Error('meta not found: ' + key)
  return html.replace(re, '$1' + esc(value) + '$2')
}

/** Structured data for one stay — reused by the ItemList and stay pages. */
function stayJsonLd(s, canonical) {
  const [city, region] = s.location.split(',').map((x) => x.trim())
  return {
    '@type': 'VacationRental',
    '@id': canonical + '#stay',
    name: s.name,
    description: s.tagline + ' ' + s.about.slice(0, 180),
    url: canonical,
    image: s.images[0],
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: region,
      addressCountry: 'PH',
    },
    geo: { '@type': 'GeoCoordinates', latitude: s.coords.lat, longitude: s.coords.lng },
    priceRange: peso(s.price) + '/night',
    numberOfRooms: s.bedrooms,
    occupancy: { '@type': 'QuantitativeValue', maxValue: s.guests },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: s.rating,
      reviewCount: s.reviews,
    },
    offers: {
      '@type': 'Offer',
      price: s.price,
      priceCurrency: 'PHP',
      availability: 'https://schema.org/InStock',
      url: canonical,
    },
    amenityFeature: s.amenities.slice(0, 12).map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
    })),
    ...(s.host ? { owner: { '@type': 'Person', name: s.host } } : {}),
  }
}

/** The hidden-but-parseable body copy for #prerender. */
function stayBody(s, canonical, destName) {
  return (
    '<h1>' + esc(s.name) + '</h1>' +
    '<p>' + esc(s.location) + ' — ' + esc(s.tagline) + '</p>' +
    '<p>' + peso(s.price) + ' per night · rated ' + s.rating +
    ' from ' + s.reviews + ' reviews · sleeps ' + s.guests +
    ' in ' + s.bedrooms + ' bedrooms</p>' +
    '<p>' + esc(s.about) + '</p>' +
    '<ul>' +
    s.amenities.map((a) => '<li>' + esc(a) + '</li>').join('') +
    '</ul>' +
    '<p><a href="' + canonical + '">Book ' + esc(s.name) + ' on PUNTA</a> · ' +
    '<a href="' + ORIGIN + '/explore?where=' +
    encodeURIComponent(destName) + '">More stays in ' +
    esc(destName) + '</a></p>'
  )
}

const { STAYS, featured } = await loadData('src/data/properties.ts')
const { DESTINATIONS } = await loadData('src/data/destinations.ts')
if (!Array.isArray(STAYS) || STAYS.length === 0) throw new Error('no stays loaded')

const template = readFileSync(resolve(DIST, 'index.html'), 'utf8')
if (!PRERENDER_RE.test(template)) {
  throw new Error('index.html #prerender node not found — did vite build run first?')
}
const destName = Object.fromEntries(DESTINATIONS.map((d) => [d.id, d.name]))

/* ——— 1. home: prerender body + ItemList JSON-LD ——— */

const destItems = DESTINATIONS.map(
  (d) =>
    '<li><a href="' + ORIGIN + '/explore?where=' + encodeURIComponent(d.name) + '">' +
    esc(d.name) + '</a> — ' + esc(d.line) + ' (' + d.propertyCount + ' stays)</li>'
).join('')

const topStays = featured(8)
const stayItems = topStays
  .map(
    (s) =>
      '<li><a href="' + ORIGIN + '/stay/' + s.id + '">' + esc(s.name) + '</a> — ' +
      esc(s.location) + ' · ' + peso(s.price) + '/night · ' + s.rating + '★ (' +
      s.reviews + ' reviews)</li>'
  )
  .join('')

const homeBody =
  '<h1>Where will you stay?</h1>' +
  '<p>Punta / Philippines. Beautiful places. Meaningful escapes.</p>' +
  '<section><h2>Destinations</h2><ul>' + destItems + '</ul></section>' +
  '<section><h2>Featured stays</h2><ul>' + stayItems + '</ul></section>'

const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'PUNTA — stays across the Philippines',
  itemListElement: STAYS.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: stayJsonLd(s, ORIGIN + '/stay/' + s.id),
  })),
}

let home = template.replace(PRERENDER_RE, prerenderOpen(homeBody))
home = home.replace('</head>', jsonLd(itemList) + '\n  </head>')
writeFileSync(resolve(DIST, 'index.html'), home)

/* ——— 2. one static page per stay ——— */

mkdirSync(resolve(DIST, 'stay'), { recursive: true })

for (const s of STAYS) {
  const canonical = ORIGIN + '/stay/' + s.id
  const title = s.name + ', ' + s.location + ' — PUNTA'
  const desc =
    s.tagline + ' ' + s.name + ' in ' + s.location + ' — ' + peso(s.price) +
    '/night, rated ' + s.rating + ' from ' + s.reviews + ' reviews. Book on PUNTA.'

  let page = template
  page = page.replace(/<title>[^<]*<\/title>/, '<title>' + esc(title) + '</title>')
  page = setMeta(page, 'name', 'description', desc)
  page = setMeta(page, 'property', 'og:title', s.name + ' — PUNTA')
  page = setMeta(page, 'property', 'og:description', s.tagline + ' ' + s.location)
  page = setMeta(page, 'property', 'og:url', canonical)
  page = setMeta(page, 'name', 'twitter:title', s.name + ' — PUNTA')
  page = setMeta(page, 'name', 'twitter:description', s.tagline + ' ' + s.location)
  page = page.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    '$1' + canonical + '$2'
  )
  page = page.replace(PRERENDER_RE, prerenderOpen(stayBody(s, canonical, destName[s.destination] || s.destination)))
  page = page.replace(
    '</head>',
    jsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'PUNTA', item: ORIGIN + '/' },
            { '@type': 'ListItem', position: 2, name: s.name, item: canonical },
          ],
        },
        stayJsonLd(s, canonical),
      ],
    }) + '\n  </head>'
  )
  writeFileSync(resolve(DIST, 'stay', s.id + '.html'), page)
}

/* ——— 3. sitemap ——— */

const urls = [
  '<url><loc>' + ORIGIN + '/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>',
  ...STAYS.map(
    (s) =>
      '<url><loc>' + ORIGIN + '/stay/' + s.id + '</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>'
  ),
]
writeFileSync(
  resolve(DIST, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ' +
    urls.join('\n  ') +
    '\n</urlset>\n'
)

console.log(
  'prerender: home + ' + STAYS.length + ' stay pages + sitemap.xml written to dist/'
)
