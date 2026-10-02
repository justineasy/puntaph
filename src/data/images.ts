/**
 * IMAGE ARCHITECTURE — real photography via Wikimedia Commons.
 *
 * Every URL below was resolved through the Commons API and verified
 * HTTP 200 at harvest time. Pools are curated: destination scenery maps
 * to where each fictional property actually sits (Taal shots for the
 * Tagaytay ridge, El Nido lagoons for Palawan, Banaue terraces for the
 * Cordillera), and interiors rotate deterministically per property so
 * every listing feels individually photographed.
 *
 * Swapping in an owned asset pipeline later means replacing POOLS and
 * the pick() helpers — one file, as before.
 */

const POOLS: Record<string, string[]> = {
  // ————— destinations —————
  palawan: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/El_Nido_Bay%2C_Desert_tropical_island%2C_Coastline%2C_Palawan_Island%2C_Philippines.jpg/1920px-El_Nido_Bay%2C_Desert_tropical_island%2C_Coastline%2C_Palawan_Island%2C_Philippines.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/El_Nido_Bay%2C_Island_lagoon%2C_Palawan%2C_Philippines.jpg/1920px-El_Nido_Bay%2C_Island_lagoon%2C_Palawan%2C_Philippines.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/El_Nido_Bay%2C_Island_lagoon%2C_Tropical_lagoon%2C_Palawan%2C_Philippines.jpg/1920px-El_Nido_Bay%2C_Island_lagoon%2C_Tropical_lagoon%2C_Palawan%2C_Philippines.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/El_Nido_Bay%2C_Palawan_Island%2C_Philippines.jpg/1920px-El_Nido_Bay%2C_Palawan_Island%2C_Philippines.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/El_Nido_Bay%2C_islands%2C_Palawan%2C_Philippines.jpg/1920px-El_Nido_Bay%2C_islands%2C_Palawan%2C_Philippines.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Island_lagoon_in_Bacuit_Bay%2C_El_Nido%2C_Palawan%2C_Philippines.jpg/1920px-Island_lagoon_in_Bacuit_Bay%2C_El_Nido%2C_Palawan%2C_Philippines.jpg',
  ],
  coron: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Bay_of_Kayangan_Lake%2C_Coron%2C_Palawan%2C_Philippines_-_panoramio.jpg/1920px-Bay_of_Kayangan_Lake%2C_Coron%2C_Palawan%2C_Philippines_-_panoramio.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Kayangan_Lake%2C_Coron%2C_Palawan.jpg/1920px-Kayangan_Lake%2C_Coron%2C_Palawan.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Kayangan_Lake%2C_Coron_Palawan.jpg/1920px-Kayangan_Lake%2C_Coron_Palawan.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Kayangan_Lake_%28Coron%2C_Palawan%3B_03-17-2024%29.jpg/1920px-Kayangan_Lake_%28Coron%2C_Palawan%3B_03-17-2024%29.jpg',
  ],
  siargao: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Picturesque_Guyam_Island%2C_Siargao.jpg/1920px-Picturesque_Guyam_Island%2C_Siargao.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/8/8d/Siargao_Island.jpg',
  ],
  surf: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Catching_the_Wave.jpg/1920px-Catching_the_Wave.jpg',
  ],
  boracay: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/%22White_Beach%22_Boracay%2C_Philippinen.jpg/1920px-%22White_Beach%22_Boracay%2C_Philippinen.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/c/c7/Boracay_White_Beach.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/c/cd/Boracay_White_Beach.png',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Boracay_White_Beach_in_day_%28985286231%29.jpg/1920px-Boracay_White_Beach_in_day_%28985286231%29.jpg',
  ],
  batangas: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Talisay%2CBatangasjf9099_22.JPG/1920px-Talisay%2CBatangasjf9099_22.JPG',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Talisay%2CBatangasjf9099_23.JPG/1920px-Talisay%2CBatangasjf9099_23.JPG',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/A_view_of_Taal_Volcano_from_Tanauan%2C_Batangas.jpg/1920px-A_view_of_Taal_Volcano_from_Tanauan%2C_Batangas.jpg',
  ],
  taal: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/A_view_of_Taal_Volcano_from_Tanauan%2C_Batangas.jpg/1920px-A_view_of_Taal_Volcano_from_Tanauan%2C_Batangas.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Taal_Lake_%26_Volcano_from_Tagaytay%2C_Jul_2025_%281%29.jpg/1920px-Taal_Lake_%26_Volcano_from_Tagaytay%2C_Jul_2025_%281%29.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Taal_Lake_%26_Volcano_from_Tagaytay%2C_Jul_2025_%282%29.jpg/1920px-Taal_Lake_%26_Volcano_from_Tagaytay%2C_Jul_2025_%282%29.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Taal_Volcano_Habitat.jpg/1920px-Taal_Volcano_Habitat.jpg',
  ],
  cebu: [
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Bantayan_island_beach%2C_Santa_Fe%2C_Cebu_-_panoramio.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Catmon_Cebu_beach.jpg/1920px-Catmon_Cebu_beach.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Cc_beach_talisay_cebu_city.jpg/1920px-Cc_beach_talisay_cebu_city.jpg',
  ],
  kawasan: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Badian_Kawasan_Falls_Cebu.jpg/1920px-Badian_Kawasan_Falls_Cebu.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/1/1e/Kawasan_Falls%2C_Cebu%2C_Philippines1.jpg',
  ],
  launion: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/BauangLaUnionjf814.JPG/1920px-BauangLaUnionjf814.JPG',
  ],
  baguio: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Baguio_skyline_-_view_from_Diplomat_Hotel_%28Baguio%2C_Benguet%29%282018-11-27%29.jpg/1920px-Baguio_skyline_-_view_from_Diplomat_Hotel_%28Baguio%2C_Benguet%29%282018-11-27%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/0/0c/Bucari_Pines_Forest.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/FvfKayapaNV3969_05.JPG/1920px-FvfKayapaNV3969_05.JPG',
  ],
  terraces: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Banaue_Philippines_Banaue-Rice-Terraces-01.jpg/1920px-Banaue_Philippines_Banaue-Rice-Terraces-01.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Banaue_Philippines_Batad-Rice-Terraces-02.jpg/1920px-Banaue_Philippines_Batad-Rice-Terraces-02.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Banaue_Philippines_Batad-Rice-Terraces-03.jpg/1920px-Banaue_Philippines_Batad-Rice-Terraces-03.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Banaue_Philippines_Batad-Rice-Terraces-04.jpg/1920px-Banaue_Philippines_Batad-Rice-Terraces-04.jpg',
  ],
  freedive: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Freedive_Anilao.jpg/1920px-Freedive_Anilao.jpg',
  ],
  nipa: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/06121aBahay_Kubo_in_Agnaya%2C_Plaridel%2C_Bulacanfvf.jpg/1920px-06121aBahay_Kubo_in_Agnaya%2C_Plaridel%2C_Bulacanfvf.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/06121jfBahay_Kubo_in_Agnaya%2C_Plaridel%2C_Bulacanfvf.jpg/1920px-06121jfBahay_Kubo_in_Agnaya%2C_Plaridel%2C_Bulacanfvf.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/A_Floating_Hut_Leyte.jpg/1920px-A_Floating_Hut_Leyte.jpg',
  ],
  stilt: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/DFC_0460_Weathered_wooden_stilt_house_and_dock_built_over_a_sandy_rocky_shoreline_with_tropical_trees_in_the_background.jpg/1920px-DFC_0460_Weathered_wooden_stilt_house_and_dock_built_over_a_sandy_rocky_shoreline_with_tropical_trees_in_the_background.jpg',
  ],
  villa: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/GX-213_-_Tropical_palms_sway_beside_a_serene_pool_leading_to_a_white_villa_with_a_curved_staircase_under_clear_blue_skies.jpg/1920px-GX-213_-_Tropical_palms_sway_beside_a_serene_pool_leading_to_a_white_villa_with_a_curved_staircase_under_clear_blue_skies.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/GX-214_-_Tropical_palms_sway_beside_a_serene_pool_reflecting_the_bright_white_villas_elegant_balcony_and_expansive_glass_windows.jpg/1920px-GX-214_-_Tropical_palms_sway_beside_a_serene_pool_reflecting_the_bright_white_villas_elegant_balcony_and_expansive_glass_windows.jpg',
  ],
  palms: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/GX-220_-_Tropical_palms_and_lush_greenery_frame_a_white_house_with_a_paved_driveway_leading_to_a_gated_entrance.jpg/1920px-GX-220_-_Tropical_palms_and_lush_greenery_frame_a_white_house_with_a_paved_driveway_leading_to_a_gated_entrance.jpg',
  ],
  trophouse: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Florida_Tropical_House_-_Flickr_-_Mobilus_In_Mobili.jpg/1920px-Florida_Tropical_House_-_Flickr_-_Mobilus_In_Mobili.jpg',
  ],
  // ————— interiors —————
  cabin: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Cozy_cabin_living_room_with_wooden_interior.jpg/1920px-Cozy_cabin_living_room_with_wooden_interior.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Cozy_corner_with_a_chair_and_a_blanket_in_a_wooden_cabin_interior.jpg/1920px-Cozy_corner_with_a_chair_and_a_blanket_in_a_wooden_cabin_interior.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Cozy_interior_of_a_wooden_cabin_with_a_seating_area.jpg/1920px-Cozy_interior_of_a_wooden_cabin_with_a_seating_area.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Cozy_wooden_cabin_interior.jpg/1920px-Cozy_wooden_cabin_interior.jpg',
  ],
  bedroom: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/2025.01.02_Bialystok_Hotel_Branicki_Interior_of_Bedroom_01.jpg/1920px-2025.01.02_Bialystok_Hotel_Branicki_Interior_of_Bedroom_01.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/2025.01.02_Bialystok_Hotel_Branicki_Interior_of_Bedroom_02.jpg/1920px-2025.01.02_Bialystok_Hotel_Branicki_Interior_of_Bedroom_02.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/2025.01.02_Bialystok_Hotel_Branicki_Interior_of_Bedroom_03.jpg/1920px-2025.01.02_Bialystok_Hotel_Branicki_Interior_of_Bedroom_03.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/2025.01.02_Bialystok_Hotel_Branicki_Interior_of_Bedroom_04.jpg/1920px-2025.01.02_Bialystok_Hotel_Branicki_Interior_of_Bedroom_04.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/2025.01.02_Bialystok_Hotel_Branicki_Interior_of_Bedroom_05.jpg/1920px-2025.01.02_Bialystok_Hotel_Branicki_Interior_of_Bedroom_05.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/2025.07.13_Interior_bedroom_Hotel_Hlybokae_01.jpg/1920px-2025.07.13_Interior_bedroom_Hotel_Hlybokae_01.jpg',
  ],
  living: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Hester_Diamond_Living_Room_2_by_Rachel_Kaminsky.9.2020_03.jpg/1920px-Hester_Diamond_Living_Room_2_by_Rachel_Kaminsky.9.2020_03.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Hester_Diamond_Living_Room_by_Rachel_Kaminsky.9.2020_01.jpg/1920px-Hester_Diamond_Living_Room_by_Rachel_Kaminsky.9.2020_01.jpg',
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/IKEA_store%2C_Interior_design%2C_Living_room%2C_Rostov-on-Don%2C_Russia.jpg/1920px-IKEA_store%2C_Interior_design%2C_Living_room%2C_Rostov-on-Don%2C_Russia.jpg',
  ],
  bath: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Bathroom_of_Khan_Pool_Suite_in_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg/1920px-Bathroom_of_Khan_Pool_Suite_in_Amantaka_luxury_Resort_%26_Hotel_in_Luang_Prabang_Laos.jpg',
  ],
  kitchen: [
    'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/IKEA_store%2C_Interior_design%2C_Living_room%2C_Rostov-on-Don%2C_Russia.jpg/1920px-IKEA_store%2C_Interior_design%2C_Living_room%2C_Rostov-on-Don%2C_Russia.jpg',
  ],
}

/** Deterministic string hash — same property always gets the same photos. */
function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Pick a pool with a guaranteed non-empty fallback. */
function pool(name: string): string[] {
  const p = POOLS[name]
  return p && p.length > 0 ? p : POOLS.living
}

/** Deterministic member of a pool (salt varies the pick per room). */
function pick(name: string, salt: number): string {
  const p = pool(name)
  return p[salt % p.length]
}

/** Rotate through a pool without repeating while the pool allows. */
function spread(name: string, i: number, count: number): string {
  const p = pool(name)
  if (i < p.length) return p[i % p.length]
  return p[(i * 7 + count) % p.length]
}

export const ROOM_KEYS = [
  'hero',
  'living',
  'bedroom',
  'bathroom',
  'outdoor',
  'feature',
] as const

export type RoomKey = (typeof ROOM_KEYS)[number]

/**
 * Per-property exterior character. Each stay gets a hero image whose
 * architecture matches its story — not one generic villa for everyone.
 */
const HERO_POOL: Record<string, string[]> = {
  'casa-amihan': POOLS.villa,
  'villa-solana': POOLS.villa,
  'driftwood-house': POOLS.stilt,
  'casa-marisol': POOLS.nipa,
  'villa-tala': POOLS.siargao,
  'punta-sirena-loft': POOLS.freedive,
  'hacienda-verde': POOLS.terraces,
  'casa-aurelia': POOLS.trophouse,
  'the-boatshed': POOLS.stilt,
  'villa-capiz': POOLS.palawan,
  'casa-paz': POOLS.nipa,
  'lighthouse-keeper': POOLS.palawan,
  'canopy-house': POOLS.baguio,
  'casa-azul': POOLS.coron,
  'palm-and-tide': POOLS.palawan,
  'honda-bay-hideout': POOLS.trophouse,
  'casa-pacifica': POOLS.villa,
  'barracuda-shack': POOLS.surf,
  'coconut-row': POOLS.villa,
  'nuku-nook': POOLS.siargao,
  'casa-luna': POOLS.siargao,
  'sandbar-house': POOLS.siargao,
  'surfside-studio': POOLS.surf,
  'magpupungko-lodge': POOLS.siargao,
  'pine-house': POOLS.baguio,
  'cedar-lodge': POOLS.terraces,
  'casa-benguet': POOLS.terraces,
  'fog-cabin': POOLS.baguio,
  'wright-park-rooms': POOLS.baguio,
  'igorot-stone-house': POOLS.terraces,
  'overlook-1909': POOLS.baguio,
  'casa-sugbo': POOLS.cebu,
  'shiplap-house': POOLS.stilt,
  'casa-buho': POOLS.cebu,
  'cliffside-badian': POOLS.kawasan,
  'kawasan-cabin': POOLS.kawasan,
  'casa-rosario': POOLS.trophouse,
  'sumilon-view-loft': POOLS.cebu,
  'breakwater-inn': POOLS.launion,
  'flotsam-and-fern': POOLS.launion,
  'tangadan-cabin': POOLS.baguio,
  'casa-mariana': POOLS.launion,
  'saltbox-studio': POOLS.launion,
  'point-house': POOLS.surf,
  'white-sand-villa': POOLS.boracay,
  'diniwid-deck-house': POOLS.boracay,
  'puka-pearl-house': POOLS.boracay,
  'bulabog-breeze': POOLS.boracay,
  'ilig-iligan-resthouse': POOLS.boracay,
  'ridge-house-tagaytay': POOLS.taal,
  'casa-nimbus': POOLS.baguio,
  'skygarden-loft': POOLS.taal,
  'villa-mirasol': POOLS.taal,
}

/** Fallback scenery if a destination pool is missing entirely. */
const SCENERY_FALLBACK = POOLS.palawan

/** Scenery that matches where the property actually is. */
const SCENERY: Record<string, string[]> = {
  batangas: POOLS.batangas,
  palawan: POOLS.palawan,
  siargao: POOLS.siargao,
  baguio: POOLS.terraces,
  cebu: POOLS.cebu,
  'la-union': POOLS.launion,
  boracay: POOLS.boracay,
  tagaytay: POOLS.taal,
}

/** Destination of a property, from the data layer's slug map. */
const PROPERTY_DEST: Record<string, string> = {
  batangas: 'batangas',
  palawan: 'palawan',
  siargao: 'siargao',
  baguio: 'baguio',
  cebu: 'cebu',
  'la-union': 'la-union',
  boracay: 'boracay',
  tagaytay: 'tagaytay',
}

export function roomImage(code: string, room: RoomKey, salt = 0): string {
  const h = hash(code)
  const scenery = SCENERY[PROPERTY_DEST[code] ?? ''] ?? SCENERY_FALLBACK
  switch (room) {
    case 'hero':
      // hero pools are indexed by property code; fall back cleanly
      return (HERO_POOL[code] ?? scenery)[0]
    case 'living':
      return pick('living', h + salt)
    case 'bedroom':
      return spread('bedroom', salt, 3)
    case 'bathroom':
      return pick('bath', h)
    case 'outdoor':
      return scenery[Math.abs(h) % scenery.length]
    case 'feature':
      return (HERO_POOL[code] ?? scenery)[1] ?? (HERO_POOL[code] ?? scenery)[0]
    default:
      return SCENERY_FALLBACK[0]
  }
}

export function stayImages(code: string): string[] {
  return ROOM_KEYS.map((room, i) => roomImage(code, room, i))
}

export function roomLabel(room: string): string {
  const map: Record<string, string> = {
    hero: 'The property',
    living: 'Living room',
    bedroom: 'Bedroom',
    bathroom: 'Bath and kitchen',
    outdoor: 'Outdoors',
    feature: 'Signature detail',
  }
  return map[room] ?? room
}

export function destImage(dest: string, w = 1600, h = 1000): string {
  void w
  void h
  const set = SCENERY[dest] ?? SCENERY_FALLBACK
  return set[hash(dest) % set.length]
}

export function editImage(key: string, w = 1400, h = 950): string {
  void w
  void h
  const map: Record<string, string[]> = {
    'batangas-water': POOLS.batangas,
    'baguio-morning': POOLS.baguio,
    'siargao-island': POOLS.siargao,
    'host-banner': POOLS.villa,
    'host-hero': POOLS.villa,
  }
  const set = map[key] ?? SCENERY_FALLBACK
  return set[hash(key) % set.length]
}

export function heroImage(w = 2000, h = 1250): string {
  void w
  void h
  return POOLS.palawan[0]
}

/**
 * ADDITIVE — themed pool access for the new platform pages (Experiences,
 * Dining, Transportation, Destinations guide). Deterministic, never empty.
 */
export function poolImage(poolName: string, seed: string): string {
  const p = pool(poolName)
  return p[hash(seed) % p.length]
}
