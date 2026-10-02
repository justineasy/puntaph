import type { Host } from '../types'

export const HOSTS: Record<string, Host> = {
  amihan: {
    name: 'Amihan Reyes',
    since: 2017,
    blurb:
      'Born in Batangas, Amihan opened her family’s coastal land to travelers who want the sea without the noise. She still greets most guests herself.',
    responseRate: '100%',
  },
  santos: {
    name: 'Marco & Ella Santos',
    since: 2018,
    blurb:
      'An architect and a chef who build and host together. Every stay includes their small guide to the neighborhood — the best bakeries, sunsets, and shortcuts.',
    responseRate: '98%',
  },
  mateo: {
    name: 'Mateo Villaluna',
    since: 2016,
    blurb:
      'A former boatman turned host, Mateo knows every cove and sandbar by heart. Ask him where the water is calmest this week.',
    responseRate: '97%',
  },
  liwayway: {
    name: 'Liwayway Cruz',
    since: 2019,
    blurb:
      'Liwayway grows the coffee served at her mountain houses and roasts it every Friday. Mornings here start with a cup and a view above the clouds.',
    responseRate: '99%',
  },
  gabriel: {
    name: 'Gabriel Mendoza',
    since: 2020,
    blurb:
      'Gabriel restores old houses for a living. His guesthomes keep their original bones — capiz windows, wide plank floors, and all.',
    responseRate: '96%',
  },
  isa: {
    name: 'Isabel Navarro',
    since: 2018,
    blurb:
      'Isabel left city law to run a small collection of surf-side houses. Her house manual is famously short: lock up, rinse boards, be kind.',
    responseRate: '100%',
  },
  renzo: {
    name: 'Renzo & Pia Delgado',
    since: 2017,
    blurb:
      'A couple who traded weekends in the city for a lifetime by the shore. They plant a tree for every booking they host.',
    responseRate: '98%',
  },
  corazon: {
    name: 'Corazon Aguilar',
    since: 2015,
    blurb:
      'The longest-hosting keeper on PUNTA. Corazon’s kitchens have fed three generations of returning guests.',
    responseRate: '99%',
  },
}

/** Homepage owner spotlight — hosts speak under the big quote. */
export interface OwnerSpotlight {
  quote: string
  name: string
  role: string
  /** Stay id, used for the "visit the stay" link. */
  stayId: string
  property: string
  place: string
}

/** Rotates every ROTATE_MS in Home.tsx — one entry per host, in HOSTS order. */
export const OWNER_SPOTLIGHTS: OwnerSpotlight[] = [
  {
    quote: 'They came for a weekend and left with a standing reservation.',
    name: 'Amihan Reyes',
    role: 'Owner',
    stayId: 'casa-amihan',
    property: 'Casa Amihan',
    place: 'Calatagan, Batangas',
  },
  {
    quote: 'A home is just a host who never left.',
    name: 'Marco & Ella Santos',
    role: 'Owners',
    stayId: 'villa-solana',
    property: 'Villa Solana',
    place: 'Laiya, Batangas',
  },
  {
    quote: 'The sea writes the schedule. We simply keep the door open.',
    name: 'Mateo Villaluna',
    role: 'Owner',
    stayId: 'villa-tala',
    property: 'Villa Tala',
    place: 'Tingloy, Batangas',
  },
  {
    quote: 'Old houses keep time better than we do.',
    name: 'Gabriel Mendoza',
    role: 'Owner',
    stayId: 'driftwood-house',
    property: 'The Driftwood House',
    place: 'Nasugbu, Batangas',
  },
  {
    quote: 'Good mornings are grown, not bought.',
    name: 'Liwayway Cruz',
    role: 'Owner',
    stayId: 'pine-house',
    property: 'Pine House',
    place: 'Camp John Hay, Baguio',
  },
  {
    quote: 'Lock up, rinse the boards, be kind. That is the whole manual.',
    name: 'Isabel Navarro',
    role: 'Owner',
    stayId: 'casa-paz',
    property: 'Casa Paz',
    place: 'Port Barton, Palawan',
  },
  {
    quote: 'Every booking plants a tree. The shore is filling in nicely.',
    name: 'Renzo & Pia Delgado',
    role: 'Owners',
    stayId: 'villa-capiz',
    property: 'Villa Capiz',
    place: 'El Nido, Palawan',
  },
  {
    quote: 'Three generations of guests, one long table.',
    name: 'Corazon Aguilar',
    role: 'Owner',
    stayId: 'hacienda-verde',
    property: 'Hacienda Verde',
    place: 'Lipa, Batangas',
  },
]
