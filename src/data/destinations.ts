import type { Destination } from '../types'

export const DESTINATIONS: Destination[] = [
  { id: 'batangas', name: 'Batangas', line: 'Your weekend, closer than you think.', propertyCount: 9, seed: 'punta-dest-batangas' },
  { id: 'palawan', name: 'Palawan', line: 'Blue horizons. Slow mornings.', propertyCount: 8, seed: 'punta-dest-palawan' },
  { id: 'siargao', name: 'Siargao', line: 'Salt air. Barefoot afternoons.', propertyCount: 7, seed: 'punta-dest-siargao' },
  { id: 'baguio', name: 'Baguio', line: 'Cool mornings above the clouds.', propertyCount: 7, seed: 'punta-dest-baguio' },
  { id: 'cebu', name: 'Cebu', line: 'Old streets, open water.', propertyCount: 7, seed: 'punta-dest-cebu' },
  { id: 'la-union', name: 'La Union', line: 'Sunsets worth the drive.', propertyCount: 6, seed: 'punta-dest-la-union' },
  { id: 'boracay', name: 'Boracay', line: 'White sand, soft evenings.', propertyCount: 5, seed: 'punta-dest-boracay' },
  { id: 'tagaytay', name: 'Tagaytay', line: 'Fog, ridges, and warm soup.', propertyCount: 4, seed: 'punta-dest-tagaytay' },
]

export const DESTINATION_NAMES = DESTINATIONS.map((d) => d.name)

export function destLine(name: string): string {
  return DESTINATIONS.find((d) => d.name === name)?.line ?? ''
}
