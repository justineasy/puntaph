/**
 * PLATFORM DATA — experiences, dining, transportation, eSIM, destination
 * guides, and map points of interest. All fictional, all in the peso,
 * all deterministic. Additive to the existing data layer; nothing here
 * replaces existing files.
 */

import type { DestinationId } from '../types'

// ————— shared shapes —————

export interface Experience {
  id: string
  title: string
  location: string
  destination: DestinationId
  category:
    | 'Island Hopping'
    | 'Diving'
    | 'Surfing'
    | 'Sunset Cruise'
    | 'Private Boat'
    | 'Spa & Wellness'
    | 'Food Tour'
    | 'Hiking'
    | 'Photography'
    | 'Culture'
  duration: string
  rating: number
  reviews: number
  price: number // per person, PHP
  description: string
  image: string
  coords: { lat: number; lng: number }
}

export interface Restaurant {
  id: string
  name: string
  location: string
  destination: DestinationId
  category:
    | 'Fine Dining'
    | 'Local Food'
    | 'Beach Restaurant'
    | 'Café'
    | 'Romantic Dining'
    | 'Beach Club'
    | 'Hidden Gem'
  cuisine: string
  priceRange: 1 | 2 | 3 // ₱ · ₱₱ · ₱₱₱
  rating: number
  reviews: number
  blurb: string
  image: string
  coords: { lat: number; lng: number }
}

export interface Transport {
  id: string
  name: string
  location: string
  destination: DestinationId
  kind: 'Airport Transfer' | 'Private Car' | 'Car Rental' | 'Shuttle' | 'Boat Transfer'
  vehicle: string
  capacity: string
  price: number // total, PHP
  availability: string
  blurb: string
  image: string
  coords: { lat: number; lng: number }
}

export interface EsimPackage {
  id: string
  region: string
  dataGb: number
  days: number
  price: number // PHP
  network: string
  speed: string
}

export interface DestinationGuide {
  id: DestinationId
  tagline: string
  description: string
  gettingThere: string
  bestTime: string
  airport: string
  islandGroup: string
}

export interface Poi {
  id: string
  name: string
  kind: 'stay' | 'experience' | 'restaurant' | 'attraction' | 'transport'
  detail: string
  destination: DestinationId
  coords: { lat: number; lng: number }
  refId?: string
}

// ————— experiences —————

const ximg = (seed: string) =>
  `https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Freedive_Anilao.jpg/960px-Freedive_Anilao.jpg?x=${seed}`

export const EXPERIENCES: Experience[] = [
  {
    id: 'x-bacuit-hopping',
    title: 'Bacuit Bay Island Hopping',
    location: 'El Nido, Palawan',
    destination: 'palawan',
    category: 'Island Hopping',
    duration: 'Full day · 8 hours',
    rating: 4.94,
    reviews: 212,
    price: 2400,
    description:
      'A private bangka threads the limestone giants of Bacuit Bay — Big Lagoon before the tour boats, a beach lunch on an empty spit, and Secret Lagoon when the light is right.',
    image: ximg('bacuit'),
    coords: { lat: 11.16, lng: 119.32 },
  },
  {
    id: 'x-tubbataha-dive',
    title: 'Reef Dive at Tubbataha Edge',
    location: 'Puerto Princesa, Palawan',
    destination: 'palawan',
    category: 'Diving',
    duration: 'Half day · 2 dives',
    rating: 4.9,
    reviews: 87,
    price: 4600,
    description:
      'Two guided drifts along a walls-edge site known for turtles and blacktip sightings. Gear, boat, and a marine-park-certified divemaster included.',
    image: ximg('dive'),
    coords: { lat: 9.95, lng: 118.75 },
  },
  {
    id: 'x-cloud9-surf',
    title: 'Dawn Patrol at Cloud 9',
    location: 'General Luna, Siargao',
    destination: 'siargao',
    category: 'Surfing',
    duration: '3 hours',
    rating: 4.88,
    reviews: 305,
    price: 1500,
    description:
      'First light on the famous boardwalk with a local coach who grew up on this wave. Soft-top boards for beginners, performance shapes for the confident.',
    image: ximg('surf'),
    coords: { lat: 9.79, lng: 126.15 },
  },
  {
    id: 'x-sunset-paraw',
    title: 'Paraw Sunset Sail',
    location: 'Boracay',
    destination: 'boracay',
    category: 'Sunset Cruise',
    duration: '90 minutes',
    rating: 4.85,
    reviews: 189,
    price: 950,
    description:
      'A hand-built paraw with no motor, only wind and canvas, running the coast as the sun drops behind the island. Bring something warm — the breeze picks up.',
    image: ximg('paraw'),
    coords: { lat: 11.97, lng: 121.92 },
  },
  {
    id: 'x-private-bangka',
    title: 'Private Bangka to Naked Island',
    location: 'Socorro, Siargao',
    destination: 'siargao',
    category: 'Private Boat',
    duration: 'Half day',
    rating: 4.91,
    reviews: 64,
    price: 5200,
    description:
      'Your own boat and crew, leaving before the tour vans. An hour alone on the sandbar, then a floating breakfast on the way back.',
    image: ximg('bangka'),
    coords: { lat: 9.86, lng: 126.2 },
  },
  {
    id: 'x-ridge-spa',
    title: 'Ridge Spa & Steam Ritual',
    location: 'Tagaytay',
    destination: 'tagaytay',
    category: 'Spa & Wellness',
    duration: '3 hours',
    rating: 4.86,
    reviews: 96,
    price: 3800,
    description:
      'A sauna, a scrub, and a hilot massage overlooking the caldera — the fog does half the work. Ylang-ylang oil pressed in Anilao.',
    image: ximg('spa'),
    coords: { lat: 14.11, lng: 120.95 },
  },
  {
    id: 'x-manila-food',
    title: 'Chinatown Food Walk',
    location: 'Binondo, Manila',
    destination: 'cebu',
    category: 'Food Tour',
    duration: '3.5 hours',
    rating: 4.82,
    reviews: 141,
    price: 1800,
    description:
      'The world’s oldest Chinatown, eaten street by street: lumpia, kiampong, hopia from a 1939 oven, and the back-room siopao everyone argues about.',
    image: ximg('food'),
    coords: { lat: 14.6, lng: 120.97 },
  },
  {
    id: 'x-batad-hike',
    title: 'Batad Amphitheater Hike',
    location: 'Banaue, Cordillera',
    destination: 'baguio',
    category: 'Hiking',
    duration: 'Full day · 12 km',
    rating: 4.95,
    reviews: 73,
    price: 2100,
    description:
      'Down into the two-thousand-year-old amphitheater of rice terraces, out to Tappiya Falls, and back up the stone steps with lunch at a village hut.',
    image: ximg('hike'),
    coords: { lat: 16.93, lng: 121.15 },
  },
  {
    id: 'x-golden-hour',
    title: 'Golden Hour Photo Sail',
    location: 'San Juan, La Union',
    destination: 'la-union',
    category: 'Photography',
    duration: '2 hours',
    rating: 4.78,
    reviews: 58,
    price: 1300,
    description:
      'A working photographer charts the coast’s best light — breakwater, dunes, and a beach on the West Philippine Sea — and edits your roll the same night.',
    image: ximg('photo'),
    coords: { lat: 16.62, lng: 120.27 },
  },
  {
    id: 'x-kalinga-weave',
    title: 'Loom & Tattoo Cultural Day',
    location: 'Kalinga, Cordillera',
    destination: 'baguio',
    category: 'Culture',
    duration: 'Full day',
    rating: 4.93,
    reviews: 41,
    price: 2600,
    description:
      'A morning at the backstrap looms with master weavers, an afternoon with the province’s last mambabatok, and dinner in a village kitchen.',
    image: ximg('culture'),
    coords: { lat: 17.63, lng: 121.72 },
  },
]

// ————— dining —————

const rimg = (seed: string) =>
  `https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Cozy_cabin_living_room_with_wooden_interior.jpg/960px-Cozy_cabin_living_room_with_wooden_interior.jpg?r=${seed}`

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r-alon',
    name: 'Alon Table',
    location: 'Station 1, Boracay',
    destination: 'boracay',
    category: 'Fine Dining',
    cuisine: 'Modern Filipino seafood',
    priceRange: 3,
    rating: 4.89,
    reviews: 154,
    blurb:
      'A tasting menu of island fish cooked over coconut husk, plated feet from the tide line.',
    image: rimg('alon'),
    coords: { lat: 11.97, lng: 121.92 },
  },
  {
    id: 'r-lomi-house',
    name: 'Rosemarie’s Lomi House',
    location: 'San Juan, Batangas',
    destination: 'batangas',
    category: 'Local Food',
    cuisine: 'Batangas lomi',
    priceRange: 1,
    rating: 4.77,
    reviews: 402,
    blurb:
      'The lomi everyone in town actually eats: thick, peppery, crowned with chicharon. Cash only, closed Sundays.',
    image: rimg('lomi'),
    coords: { lat: 13.72, lng: 121.11 },
  },
  {
    id: 'r-dune',
    name: 'Dune',
    location: 'Urbiztondo, La Union',
    destination: 'la-union',
    category: 'Beach Restaurant',
    cuisine: 'Coastal fusion',
    priceRange: 2,
    rating: 4.7,
    reviews: 236,
    blurb:
      'Toes-in-the-sand plates between surf sessions — tuna kilaw on tostada, wood- fired pizza for the table.',
    image: rimg('dune'),
    coords: { lat: 16.61, lng: 120.27 },
  },
  {
    id: 'r-kapeng-barako',
    name: 'Kapeng Barako Collective',
    location: 'Lipa, Batangas',
    destination: 'batangas',
    category: 'Café',
    cuisine: 'Batangas coffee & kakanin',
    priceRange: 1,
    rating: 4.75,
    reviews: 188,
    blurb:
      'A courtyard café poured straight from the growers: barako brewed five ways, suman, and slow mornings.',
    image: rimg('kapeng'),
    coords: { lat: 13.94, lng: 121.16 },
  },
  {
    id: 'r-luna-roof',
    name: 'Luna at the Roofdeck',
    location: 'El Nido, Palawan',
    destination: 'palawan',
    category: 'Romantic Dining',
    cuisine: 'Grilled catch & wine',
    priceRange: 3,
    rating: 4.92,
    reviews: 91,
    blurb:
      'Six tables on a rooftop facing Bacuit Bay. The menu is whatever the boats brought; the sunset needs no menu.',
    image: rimg('luna'),
    coords: { lat: 11.18, lng: 119.39 },
  },
  {
    id: 'r-salt-club',
    name: 'Salt & Sable Beach Club',
    location: 'General Luna, Siargao',
    destination: 'siargao',
    category: 'Beach Club',
    cuisine: 'Island plates & cocktails',
    priceRange: 2,
    rating: 4.66,
    reviews: 274,
    blurb:
      'Daybeds by the pool, DJs at dusk, and a kitchen that runs from long breakfast to late night.',
    image: rimg('salt'),
    coords: { lat: 9.78, lng: 126.13 },
  },
  {
    id: 'r-bale-dutung',
    name: 'Bale Dutung',
    location: 'Angeles, Pampanga',
    destination: 'batangas',
    category: 'Hidden Gem',
    cuisine: 'Kapampangan heritage',
    priceRange: 3,
    rating: 4.96,
    reviews: 67,
    blurb:
      'Kapampangan cooking as heritage, served at the chef’s own table by reservation only — begin with the sisig, end with the taba ng talangka rice.',
    image: rimg('bale'),
    coords: { lat: 15.14, lng: 120.59 },
  },
  {
    id: 'r-tres-ces',
    name: 'Tres Cebú',
    location: 'Cebu City, Cebu',
    destination: 'cebu',
    category: 'Fine Dining',
    cuisine: 'Contemporary Cebuano',
    priceRange: 3,
    rating: 4.88,
    reviews: 122,
    blurb:
      'Lechon de leche carved tableside, on a terrace above the heritage quarter.',
    image: rimg('tres'),
    coords: { lat: 10.29, lng: 123.9 },
  },
  {
    id: 'r-ridge-soup',
    name: 'Nanay Vera’s Bulalan',
    location: 'Alfonso, Tagaytay',
    destination: 'tagaytay',
    category: 'Local Food',
    cuisine: 'Bulalo & nilaga',
    priceRange: 1,
    rating: 4.81,
    reviews: 341,
    blurb:
      'The caldera-view bulalo the ridge drivers all know. Bring a jacket; the broth does the rest.',
    image: rimg('bulalo'),
    coords: { lat: 14.13, lng: 120.85 },
  },
  {
    id: 'r-isla-cafe',
    name: 'Isla Rosario Café',
    location: 'Catbalogan, Samar',
    destination: 'siargao',
    category: 'Hidden Gem',
    cuisine: 'Samar coffee & pancakes',
    priceRange: 1,
    rating: 4.68,
    reviews: 52,
    blurb:
      'A three-table café famous two islands over for its calamansi pancakes. Worth the detour; the tricycle driver will know.',
    image: rimg('isla'),
    coords: { lat: 11.78, lng: 125.0 },
  },
]

// ————— transportation —————

const timg = (seed: string) =>
  `https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/DFC_0460_Weathered_wooden_stilt_house_and_dock_built_over_a_sandy_rocky_shoreline_with_tropical_trees_in_the_background.jpg/960px-DFC_0460_Weathered_wooden_stilt_house_and_dock_built_over_a_sandy_rocky_shoreline_with_tropical_trees_in_the_background.jpg?t=${seed}`

export const TRANSPORTS: Transport[] = [
  {
    id: 't-elnido-transfer',
    name: 'El Nido Airport Transfer',
    location: 'Lio Airport → El Nido town',
    destination: 'palawan',
    kind: 'Airport Transfer',
    vehicle: 'Air-conditioned van',
    capacity: 'Up to 10 guests',
    price: 850,
    availability: 'Daily · meets every flight',
    blurb: 'A driver with a name board at Lio, straight to your stay’s door.',
    image: timg('elnido'),
    coords: { lat: 11.2, lng: 119.4 },
  },
  {
    id: 't-siargao-car',
    name: 'Siargao Scooter & Car Hire',
    location: 'General Luna, Siargao',
    destination: 'siargao',
    kind: 'Car Rental',
    vehicle: 'Scooter or AUV',
    capacity: '2–6 guests',
    price: 650,
    availability: 'Daily · delivered to your stay',
    blurb: 'The island’s favorite freedom: fuel included, helmets included, delivered.',
    image: timg('siargao'),
    coords: { lat: 9.79, lng: 126.15 },
  },
  {
    id: 't-batangas-private',
    name: 'Manila → Batangas Private Car',
    location: 'Metro Manila → Batangas',
    destination: 'batangas',
    kind: 'Private Car',
    vehicle: 'Sedan or SUV with driver',
    capacity: 'Up to 4 guests',
    price: 3800,
    availability: 'Daily · departures from 4 am',
    blurb: 'Door-to-door south of the metro, tolls and traffic yours to ignore.',
    image: timg('batangas'),
    coords: { lat: 14.0, lng: 120.98 },
  },
  {
    id: 't-boracay-shuttle',
    name: 'Caticlan–Boracay Shuttle',
    location: 'Caticlan → Station 1–3',
    destination: 'boracay',
    kind: 'Shuttle',
    vehicle: 'Minivan + boat + e-trike',
    capacity: 'Shared',
    price: 550,
    availability: 'Every 30 minutes · 6 am–8 pm',
    blurb: 'The whole crossing handled in one ticket — land, sea, and island leg.',
    image: timg('boracay'),
    coords: { lat: 11.92, lng: 121.95 },
  },
  {
    id: 't-coron-boat',
    name: 'Coron Bay Boat Transfer',
    location: 'Coron town → Bulog & Black Island',
    destination: 'palawan',
    kind: 'Boat Transfer',
    vehicle: 'Traditional bangka',
    capacity: 'Up to 12 guests',
    price: 2400,
    availability: 'Daily weather permitting',
    blurb: 'A chartered crossing with snorkel stops — the transfer becomes the tour.',
    image: timg('coron'),
    coords: { lat: 12.0, lng: 120.2 },
  },
  {
    id: 't-baguio-van',
    name: 'Baguio Mountain Shuttle',
    location: 'Manila → Baguio',
    destination: 'baguio',
    kind: 'Shuttle',
    vehicle: 'Premium night coach',
    capacity: 'Shared · 18 seats',
    price: 720,
    availability: 'Nightly · 10 pm & 11 pm',
    blurb: 'Sleep through Kennon Road and wake above the clouds.',
    image: timg('baguio'),
    coords: { lat: 16.41, lng: 120.6 },
  },
]

// ————— eSIM —————

export const ESIM_PACKAGES: EsimPackage[] = [
  { id: 'e-3-7', region: 'Philippines', dataGb: 3, days: 7, price: 550, network: 'Smart / Globe', speed: 'LTE · 5G where available' },
  { id: 'e-10-15', region: 'Philippines', dataGb: 10, days: 15, price: 1200, network: 'Smart / Globe', speed: 'LTE · 5G where available' },
  { id: 'e-20-30', region: 'Philippines', dataGb: 20, days: 30, price: 1900, network: 'Smart / Globe', speed: 'LTE · 5G where available' },
  { id: 'e-5-10', region: 'Philippines', dataGb: 5, days: 10, price: 850, network: 'Smart / Globe', speed: 'LTE · 5G where available' },
]

export const ESIM_STEPS = [
  'Choose your package and check out — the QR code appears instantly.',
  'Open Settings → Mobile Data → Add eSIM, then scan the QR code.',
  'Label the plan “PUNTA”, set it to activate on arrival, and keep your primary SIM for calls.',
  'Land, toggle data roaming on, and you’re online before baggage claim.',
]

// ————— destination guides —————

export const GUIDES: Record<DestinationId, DestinationGuide> = {
  batangas: {
    id: 'batangas',
    tagline: 'Your weekend, closer than you think.',
    description:
      'Volcano lookouts, lomi towns, and coves two hours south of Manila. Batangas is where weekends go when they don’t want to fly.',
    gettingThere: '2–3 h by car from Manila, or a bus from Buendía / Cubao.',
    bestTime: 'November to May — calm seas, dry mornings.',
    airport: 'MNL · Manila (2–3 h by road)',
    islandGroup: 'Luzon',
  },
  palawan: {
    id: 'palawan',
    tagline: 'Blue horizons. Slow mornings.',
    description:
      'Limestone islands, lagoons you swim into, and towns that still roll up the streets early. Palawan is the long, patient trip.',
    gettingThere: 'Direct flights to El Nido (LIO) or Puerto Princesa (PPS).',
    bestTime: 'October to May — the amihan season keeps the water glass-calm.',
    airport: 'LIO · El Nido · PPS · Puerto Princesa',
    islandGroup: 'Palawan',
  },
  siargao: {
    id: 'siargao',
    tagline: 'Salt air. Barefoot afternoons.',
    description:
      'A surf island growing into a everything-else island: tide pools, lagoons, coconut lanes, and a food scene quietly outpacing itself.',
    gettingThere: 'Direct flights to Sayak Airport (IAO), then 40 min by road.',
    bestTime: 'March to October for surf; September for the biggest swells.',
    airport: 'IAO · Sayak (Siargao)',
    islandGroup: 'Mindanao',
  },
  baguio: {
    id: 'baguio',
    tagline: 'Cool mornings above the clouds.',
    description:
      'Pines, fog, and fireplaces at 1,500 meters — the mountain capital where sweaters come out of storage.',
    gettingThere: '4–6 h by road, or a premium night coach from Manila.',
    bestTime: 'December to February — genuinely cold, genuinely foggy.',
    airport: 'MNL · Manila (4–6 h by road)',
    islandGroup: 'Luzon · Cordillera',
  },
  cebu: {
    id: 'cebu',
    tagline: 'Old streets, open water.',
    description:
      'A heritage city with the best kitchen in the country, wrapped by dives, falls, and ferry islands.',
    gettingThere: 'Direct flights to Mactan (CEB) from across Asia.',
    bestTime: 'January to May — dry, festive in January (Sinulog).',
    airport: 'CEB · Mactan–Cebu',
    islandGroup: 'Visayas',
  },
  'la-union': {
    id: 'la-union',
    tagline: 'Sunsets worth the drive.',
    description:
      'Longboard town and coffee country on the northwest coast — half surf trip, half café crawl.',
    gettingThere: '4–5 h by car or bus north of Manila.',
    bestTime: 'October to March — consistent swell, cool nights.',
    airport: 'MNL · Manila (4–5 h by road)',
    islandGroup: 'Luzon',
  },
  boracay: {
    id: 'boracay',
    tagline: 'White sand, soft evenings.',
    description:
      'Four kilometers of powder, paraws at dusk, and beach clubs after dark — the classic, reborn quieter.',
    gettingThere: 'Fly to Caticlan (MPH) or Kalibo (KLO), then the island crossing.',
    bestTime: 'November to April; April–May winds bring the kites.',
    airport: 'MPH · Caticlan · KLO · Kalibo',
    islandGroup: 'Visayas',
  },
  tagaytay: {
    id: 'tagaytay',
    tagline: 'Fog, ridges, and warm soup.',
    description:
      'The caldera overlook an hour from Manila — bulalo weather, coffee farms, and views three ridges deep.',
    gettingThere: '1.5–2 h by car via SLEX–CALAx or SkyTubod.',
    bestTime: 'Year-round; bring a jacket regardless.',
    airport: 'MNL · Manila (1.5–2 h by road)',
    islandGroup: 'Luzon',
  },
}

// ————— map points of interest —————

export const POIS: Poi[] = [
  // stays (subset — the famous ones)
  { id: 'm-stay-1', name: 'Casa Amihan', kind: 'stay', detail: '₱8,500 / night', destination: 'batangas', coords: { lat: 13.84, lng: 120.64 }, refId: 'casa-amihan' },
  { id: 'm-stay-2', name: 'Villa Capiz', kind: 'stay', detail: '₱21,000 / night', destination: 'palawan', coords: { lat: 11.18, lng: 119.39 }, refId: 'villa-capiz' },
  { id: 'm-stay-3', name: 'White Sand Villa', kind: 'stay', detail: '₱19,500 / night', destination: 'boracay', coords: { lat: 11.97, lng: 121.92 }, refId: 'white-sand-villa' },
  { id: 'm-stay-4', name: 'The Cedar Lodge', kind: 'stay', detail: '₱11,200 / night', destination: 'baguio', coords: { lat: 16.42, lng: 120.61 }, refId: 'cedar-lodge' },
  { id: 'm-stay-5', name: 'Coconut Row', kind: 'stay', detail: '₱13,500 / night', destination: 'siargao', coords: { lat: 9.79, lng: 126.13 }, refId: 'coconut-row' },
  // experiences
  ...EXPERIENCES.map((x) => ({
    id: `m-x-${x.id}`,
    name: x.title,
    kind: 'experience' as const,
    detail: `${x.duration} · ₱${x.price.toLocaleString()} / person`,
    destination: x.destination,
    coords: x.coords,
    refId: x.id,
  })),
  // restaurants
  ...RESTAURANTS.map((r) => ({
    id: `m-r-${r.id}`,
    name: r.name,
    kind: 'restaurant' as const,
    detail: `${'₱'.repeat(r.priceRange)} · ★ ${r.rating.toFixed(2)}`,
    destination: r.destination,
    coords: r.coords,
    refId: r.id,
  })),
  // attractions
  { id: 'm-att-1', name: 'Big Lagoon', kind: 'attraction', detail: 'Limestone lagoon · kayak at dawn', destination: 'palawan', coords: { lat: 11.14, lng: 119.31 } },
  { id: 'm-att-2', name: 'Cloud 9 Boardwalk', kind: 'attraction', detail: 'Surf tower & viewing deck', destination: 'siargao', coords: { lat: 9.796, lng: 126.152 } },
  { id: 'm-att-3', name: 'Taal Volcano Crater', kind: 'attraction', detail: 'Caldera viewpoint · boat + hike', destination: 'tagaytay', coords: { lat: 14.002, lng: 120.993 } },
  { id: 'm-att-4', name: 'Kawasan Falls', kind: 'attraction', detail: 'Three turquoise cascades', destination: 'cebu', coords: { lat: 9.809, lng: 123.377 } },
  { id: 'm-att-5', name: 'White Beach, Station 1', kind: 'attraction', detail: 'The powder mile', destination: 'boracay', coords: { lat: 11.97, lng: 121.918 } },
  { id: 'm-att-6', name: 'Wright Park', kind: 'attraction', detail: 'Pines, riding circle, mist', destination: 'baguio', coords: { lat: 16.417, lng: 120.619 } },
  // transport hubs
  { id: 'm-t-1', name: 'Lio Airport', kind: 'transport', detail: 'El Nido gateway', destination: 'palawan', coords: { lat: 11.2, lng: 119.4 } },
  { id: 'm-t-2', name: 'Sayak Airport', kind: 'transport', detail: 'Siargao gateway', destination: 'siargao', coords: { lat: 9.81, lng: 126.17 } },
  { id: 'm-t-3', name: 'Caticlan Port', kind: 'transport', detail: 'Boracay crossing', destination: 'boracay', coords: { lat: 11.92, lng: 121.95 } },
]

export const MAP_CATEGORIES = [
  { key: 'all', label: 'Everything' },
  { key: 'stay', label: 'Stays' },
  { key: 'experience', label: 'Experiences' },
  { key: 'restaurant', label: 'Dining' },
  { key: 'attraction', label: 'Attractions' },
  { key: 'transport', label: 'Transport' },
] as const

// ————— helpers —————

export function getExperience(id: string | undefined): Experience | undefined {
  return EXPERIENCES.find((x) => x.id === id)
}

export function getRestaurant(id: string | undefined): Restaurant | undefined {
  return RESTAURANTS.find((r) => r.id === id)
}

export function getTransport(id: string | undefined): Transport | undefined {
  return TRANSPORTS.find((t) => t.id === id)
}
