/**
 * THE PUNTA EDIT — long-form stories.
 * Each story is a small magazine feature: standfirst, sections with a
 * pull quote, practical field notes, and the stays that anchor it.
 * Keys match the edit cards on the homepage and the editImage() pool.
 */

export interface StorySection {
  heading: string
  body: string[]
}

export interface StoryFieldNote {
  label: string
  note: string
}

export interface Story {
  key: string
  title: string
  place: string
  dek: string
  /** Longer standfirst shown under the hero. */
  standfirst: string
  byline: string
  sections: StorySection[]
  pullQuote: string
  fieldNotes: StoryFieldNote[]
  /** Stays featured in "Where to sleep" — ids from properties.ts */
  stayIds: string[]
}

export const STORIES: Story[] = [
  {
    key: 'batangas-water',
    title: 'A weekend by the water',
    place: 'Batangas',
    dek: 'Two nights, one long shoreline, and the best lomi in San Juan. Our editors map the perfect 48 hours south of Manila.',
    standfirst:
      'Batangas is the sea closest to the city that still feels like a decision. Two hours of highway, a ridge, and then the water opens up — grey-sand coves, working fish ports, and houses worth parking yourself in front of for a whole weekend.',
    byline: 'By the Punta Editors',
    sections: [
      {
        heading: 'The drive south',
        body: [
          'Leave before the city wakes. SLEX thins out after the toll gates, and by the time the road starts to climb you can smell the sea through the vents. The rule our editors keep: no stops until the ridge. Then one stop, at the viewpoint where Taal Lake spreads out below like a held breath, coffee in paper cups, and back on the road.',
          'Check-in is usually around two, which is exactly right. There is time to unpack, walk the property once, and claim the good chair on the terrace before the light turns gold.',
        ],
      },
      {
        heading: 'Two nights, one shoreline',
        body: [
          'Day one belongs to the water. Calatagan and Laiya face different seas — one glassy and shallow, the other open and loud — so pick the house first and let the beach follow. Swim before lunch while the tide is high, eat under a fan, then do the thing no one admits is the whole point: the long afternoon nap to the sound of the breakwater.',
          'The second day is for the small museums of the coast — the fish port at dawn, the market where mahi-mahi costs less than gas money, the roadside stands selling mangoes by the bucket. Ask your host which boat leaves when. In Batangas, the boats are the schedule.',
        ],
      },
      {
        heading: 'Lomi in San Juan',
        body: [
          'You cannot leave without it. Lomi is the dish this province argues about the loudest, and San Juan makes the version worth driving for: thick, almost gelatinous broth, a soft egg folded in at the end, calamansi on the side and chili on the table. It is a bowl built for the tricycle ride home after a night swim.',
          'Every host keeps a different favorite — Casa Marisol’s Marco has a list he will recite unprompted — and that is the correct way to find it. Trust the house, not the app.',
        ],
      },
      {
        heading: 'Sunset protocol',
        body: [
          'The west-facing coves get the good light around five-thirty. The protocol is simple: something cold, someone on the grill, and no phones on the terrace after the first true orange appears over the water. Batangas sunsets are not rare enough to photograph. They are frequent enough to become a habit — which is better.',
        ],
      },
    ],
    pullQuote: 'The sea here is close enough to keep as a habit, not a holiday.',
    fieldNotes: [
      { label: 'When to go', note: 'October to March — the amihan season keeps the water calm and the evenings cool.' },
      { label: 'How long', note: 'Two nights. One is a drive; three needs a reason.' },
      { label: 'Eat', note: 'Lomi in San Juan, lomi in Lipa — then argue about it on the way home.' },
      { label: 'Bring', note: 'Reef-safe sunscreen, cash for the market, and nothing that beeps.' },
    ],
    stayIds: ['casa-amihan', 'villa-solana', 'casa-marisol', 'the-boatshed'],
  },
  {
    key: 'baguio-morning',
    title: 'A slower kind of morning',
    place: 'Baguio',
    dek: 'Frost on pine needles, kapeng barako at seven, and the city still asleep below. Where to wake up when you need to reset.',
    standfirst:
      'Baguio does not ask you to do anything. That is the whole offer. The air arrives cold at six, the pines hold the fog like a debt, and the best schedule in the Philippines is the one with nothing on it until lunch.',
    byline: 'By the Punta Editors',
    sections: [
      {
        heading: 'Above the clouds',
        body: [
          'The city sits a mile high, and the houses that matter sit higher. Camp John Hay’s trails start where the roads give up; Artillery Hill holds its ridge above the bowl; Tuba gets the fog first and keeps it longest. Pick a house by its morning, not its evening — in Baguio, mornings are the destination.',
          'What the cold does to a house is the quiet luxury here: blankets with weight, fireplaces in service since the fifties, windows that fog from the inside while the valley stays blue and far below.',
        ],
      },
      {
        heading: 'The first cup',
        body: [
          'Kapeng barako is a Batangas bean with a Baguio following. It arrives strong enough to stand a spoon in, brewed while the floorboards are still cold, and it tastes like the reason people move uphill. Some hosts roast their own — Liwayway’s Friday roasts at the Cedar Lodge have a waiting list that is really just her neighbor list.',
          'The editors’ rule: first coffee outside, whatever the temperature. The pines drip, the mist moves, and the day agrees to start slowly.',
        ],
      },
      {
        heading: 'The market at seven',
        body: [
          'Baguio Market before eight is a different country: strawberries still cold from La Trinidad, coffee beans by the kilo, ube in violet pyramids, and vegetables that make the city’s supermarkets look like a rumor. Bring a canvas bag and eat breakfast from the stalls — pandesal, kesong puti, hot tsokolate from a thermos lid.',
          'By nine the market belongs to everyone. At seven it is yours.',
        ],
      },
      {
        heading: 'Evening, by the fire',
        body: [
          'The cold returns around five and the city follows it indoors. This is fireplace hours: a novel you have been pretending to read, cocoa from the market, and the particular smell of pine smoke that will cling to your jacket for weeks and be, every time you smell it afterward, the whole trip in one breath.',
        ],
      },
    ],
    pullQuote: 'The best schedule in the Philippines is the one with nothing on it until lunch.',
    fieldNotes: [
      { label: 'When to go', note: 'December to February for true frost mornings; March for the strawberries at their loudest.' },
      { label: 'How long', note: 'Three nights. The second morning is when you finally slow down.' },
      { label: 'Eat', note: 'Market breakfast at seven, bulalo somewhere with fog, sundown cocoa at home.' },
      { label: 'Bring', note: 'Real layers — 12°C afternoons drop to 8°C by dinner — and a bag for coffee beans.' },
    ],
    stayIds: ['pine-house', 'cedar-lodge', 'fog-cabin', 'overlook-1909'],
  },
  {
    key: 'siargao-island',
    title: 'Island time',
    place: 'Siargao',
    dek: 'The island runs on tide charts and tricycle schedules. Here is how to spend a week when the schedule is the tide.',
    standfirst:
      'Siargao rearranges your clock. The day starts with the swell report, pauses with the tide, and ends early — not because there is nothing to do, but because the things worth doing all happen with the water, and the water keeps its own hours.',
    byline: 'By the Punta Editors',
    sections: [
      {
        heading: 'The tide is the timetable',
        body: [
          'Every plan on the island is really a plan about water height. The reef breaks work on a rising tide; the lagoons empty at ebb; the sandbars appear for an hour and then file away. Learn to read the tide chart taped inside the sari-sari store and you have learned the island.',
          'This is the rare place where asking "what time is it" sounds like a mistake and asking "where’s the water" sounds like wisdom.',
        ],
      },
      {
        heading: 'Cloud 9 before breakfast',
        body: [
          'The famous wave earns its name at dawn, before the line-up fills. Paddle out at first light and the tower is a silhouette, the boardwalk creaks somewhere behind you, and the channel is glass. Non-surfers should come anyway — the boardwalk at 5:40 is the best seat on the island, and the coconut pan de sal at the gate after is a just reward.',
          'Breakfast afterward is not optional. It is part of the session.',
        ],
      },
      {
        heading: 'North to Burgos',
        body: [
          'Rent the scooter. The north road past General Luna thins into coconut avenues — a corridor of palms leaning over the asphalt like a hall of columns — and ends at beaches with nobody’s footprints but yours. Burgos sits at the windy end, solar-powered and slow, exactly as far as you should go in a day.',
          'Stop whenever the palms part. That is the whole itinerary.',
        ],
      },
      {
        heading: 'Magpupungko at ebb',
        body: [
          'The rock pools only exist when the tide leaves, and they are worth rearranging a week around. Time the ebb, arrive before the vans, and walk out onto the reef floor where the sea has left behind basins of perfectly clear water and the tidal flats steam in the sun. By noon the sea takes it all back. The pools are not a place. They are an appointment.',
        ],
      },
    ],
    pullQuote: 'The water keeps its own hours, and the island is happier for it.',
    fieldNotes: [
      { label: 'When to go', note: 'March to October for glass and sun; amihan swells (Oct–Feb) for the serious surf.' },
      { label: 'How long', note: 'A week. Three days is a trailer; the island only opens up on day four.' },
      { label: 'Eat', note: 'Catch of the day at the General Luna stalls, and everything grilled at the roadside.' },
      { label: 'Bring', note: 'A scooter license, reef shoes, dry bags — and no itinerary that cannot move with the tide.' },
    ],
    stayIds: ['coconut-row', 'casa-luna', 'barracuda-shack', 'magpupungko-lodge'],
  },
]

export function getStory(key: string | undefined): Story | undefined {
  return STORIES.find((s) => s.key === key)
}

/** Rough reading time from the body copy — good enough for a byline. */
export function readingTime(story: Story): number {
  const words = story.sections.reduce(
    (n, sec) => n + sec.body.join(' ').split(/\s+/).length,
    0,
  )
  return Math.max(2, Math.round(words / 210))
}

/** The story after this one, wrapping — used for "next story" navigation. */
export function nextStory(key: string): Story {
  const i = STORIES.findIndex((s) => s.key === key)
  return STORIES[(i + 1 + STORIES.length) % STORIES.length] ?? STORIES[0]
}
