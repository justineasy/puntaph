export type DestinationId =
  | 'batangas'
  | 'palawan'
  | 'siargao'
  | 'baguio'
  | 'cebu'
  | 'la-union'
  | 'boracay'
  | 'tagaytay'

export type PropertyType =
  | 'Villa'
  | 'House'
  | 'Loft'
  | 'Condo'
  | 'Cabin'
  | 'Cottage'
  | 'Lodge'
  | 'Guesthouse'

export type Category = 'Beach' | 'Mountain' | 'Luxury' | 'Weekend'

export interface Destination {
  id: DestinationId
  name: string
  line: string
  propertyCount: number
  seed: string
}

export interface Amenity {
  id: string
  label: string
}

export interface Review {
  author: string
  date: string
  rating: number
  text: string
}

export interface Host {
  name: string
  since: number
  blurb: string
  responseRate: string
}

export interface Stay {
  id: string
  name: string
  location: string
  destination: DestinationId
  category: Category
  type: PropertyType
  price: number
  rating: number
  reviews: number
  guests: number
  bedrooms: number
  beds: number
  baths: number
  tagline: string
  about: string
  amenities: string[]
  images: string[]
  host: string
  guestFavorite: boolean
  coords: { lat: number; lng: number }
}

export interface PriceBreakdown {
  nights: number
  nightly: number
  subtotal: number
  cleaning: number
  serviceFee: number
  total: number
}

export interface Trip {
  id: string
  stayId: string
  status: 'upcoming' | 'past' | 'cancelled'
  checkIn: string
  checkOut: string
  guests: number
  total: number
  paymentMethod: string
  bookedAt: string
}

export interface SavedProperty {
  id: string
  savedAt: string
}

export interface GuestSummary {
  adults: number
  children: number
  infants: number
}
