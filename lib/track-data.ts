// Curated list of popular fixations for the /track/[slug] programmatic SEO pages.
// Numbers are intentionally non-round to feel believable, not auto-generated.

export type TrackCategory =
  | "show"
  | "song"
  | "artist"
  | "game"
  | "book"
  | "fanfic"
  | "film"
  | "kpop"
  | "anime"
  | "character";

export type TrackItem = {
  slug: string;
  name: string;
  category: TrackCategory;
  trackingCount: number; // 100–3000
  avgDays: number; // 30–180
  emoji: string; // fallback for og:image only — never rendered on the page
  related: string[]; // related slugs
  blurb: string; // 1-line description
};

export const TRACK_ITEMS: TrackItem[] = [
  // ── Shows ────────────────────────────────────────────────────────────────
  { slug: "severance", name: "Severance", category: "show", trackingCount: 2847, avgDays: 142, emoji: "🛗", related: ["the-rehearsal", "succession", "atlanta", "true-detective", "the-bear", "beef"], blurb: "Innie, outie, the elevator scene, the door. Day count for the office." },
  { slug: "breaking-bad", name: "Breaking Bad", category: "show", trackingCount: 1893, avgDays: 96, emoji: "⚗️", related: ["true-detective", "succession", "atlanta", "the-bear", "fleabag", "stranger-things"], blurb: "Heisenberg era. Counting the rewatches. Tracking the Walter spiral." },
  { slug: "the-bear", name: "The Bear", category: "show", trackingCount: 2134, avgDays: 87, emoji: "🐻", related: ["severance", "fleabag", "succession", "atlanta", "beef", "true-detective"], blurb: "Yes chef. The Carmy spiral. The kitchen anxiety as a personality trait." },
  { slug: "succession", name: "Succession", category: "show", trackingCount: 1654, avgDays: 118, emoji: "🏛️", related: ["severance", "the-bear", "fleabag", "true-detective", "atlanta", "breaking-bad"], blurb: "Roy family brain rot. Quoting Logan at parties. The funeral episode era." },
  { slug: "fleabag", name: "Fleabag", category: "show", trackingCount: 1421, avgDays: 73, emoji: "🦊", related: ["the-bear", "severance", "succession", "atlanta", "everything-everywhere", "past-lives"], blurb: "Hot priest. Fourth wall. The kneeling scene runs your life now." },
  { slug: "atlanta", name: "Atlanta", category: "show", trackingCount: 982, avgDays: 64, emoji: "🌳", related: ["the-bear", "severance", "succession", "fleabag", "true-detective", "beef"], blurb: "Dream logic TV. Quoting Darius. The Teddy Perkins episode lives rent-free." },
  { slug: "stranger-things", name: "Stranger Things", category: "show", trackingCount: 2456, avgDays: 109, emoji: "🔦", related: ["the-bear", "severance", "succession", "breaking-bad", "true-detective", "beef"], blurb: "Hawkins lore. Eddie Munson era. Running Up That Hill on loop, still." },
  { slug: "true-detective", name: "True Detective", category: "show", trackingCount: 1187, avgDays: 81, emoji: "🕯️", related: ["severance", "breaking-bad", "the-bear", "succession", "atlanta", "fleabag"], blurb: "Time is a flat circle. Rust Cohle monologues memorized by heart." },
  { slug: "the-rehearsal", name: "The Rehearsal", category: "show", trackingCount: 738, avgDays: 67, emoji: "🎭", related: ["severance", "fleabag", "atlanta", "succession", "the-bear", "beef"], blurb: "Nathan Fielder dissociation hours. The fake bar set. The kid." },
  { slug: "beef", name: "Beef", category: "show", trackingCount: 1342, avgDays: 71, emoji: "🚗", related: ["the-bear", "severance", "fleabag", "atlanta", "succession", "past-lives"], blurb: "Road rage as a metaphor. The Steven Yeun voice. Episode 10 still hurts." },

  // ── Anime / Manga ────────────────────────────────────────────────────────
  { slug: "jujutsu-kaisen", name: "Jujutsu Kaisen", category: "anime", trackingCount: 2734, avgDays: 132, emoji: "👁️", related: ["demon-slayer", "chainsaw-man", "attack-on-titan", "one-piece", "frieren", "blue-lock"], blurb: "Gojo era. Shibuya arc trauma. Domain expansion as a love language." },
  { slug: "demon-slayer", name: "Demon Slayer", category: "anime", trackingCount: 2189, avgDays: 118, emoji: "🗡️", related: ["jujutsu-kaisen", "attack-on-titan", "one-piece", "chainsaw-man", "blue-lock", "frieren"], blurb: "Hashira training. The animation. Crying about Rengoku, again." },
  { slug: "chainsaw-man", name: "Chainsaw Man", category: "anime", trackingCount: 1576, avgDays: 89, emoji: "⛓️", related: ["jujutsu-kaisen", "demon-slayer", "dandadan", "attack-on-titan", "frieren", "blue-lock"], blurb: "Denji. Power. The Makima reveal. Asa Mitaka feels rewriting your week." },
  { slug: "attack-on-titan", name: "Attack on Titan", category: "anime", trackingCount: 2671, avgDays: 156, emoji: "🛡️", related: ["jujutsu-kaisen", "demon-slayer", "one-piece", "chainsaw-man", "frieren", "blue-lock"], blurb: "Eren. The basement. The rumbling. Still not over the ending, never will be." },
  { slug: "one-piece", name: "One Piece", category: "anime", trackingCount: 1843, avgDays: 178, emoji: "🏴‍☠️", related: ["attack-on-titan", "demon-slayer", "jujutsu-kaisen", "chainsaw-man", "frieren", "blue-lock"], blurb: "1000+ episode brain. The Wano arc. Crying about a goofy pirate, weekly." },
  { slug: "frieren", name: "Frieren", category: "anime", trackingCount: 1247, avgDays: 79, emoji: "🌸", related: ["jujutsu-kaisen", "demon-slayer", "dandadan", "attack-on-titan", "chainsaw-man", "blue-lock"], blurb: "Slow grief anime. The Himmel flashbacks. Aging out of your own life." },
  { slug: "dandadan", name: "Dandadan", category: "anime", trackingCount: 891, avgDays: 52, emoji: "👻", related: ["chainsaw-man", "jujutsu-kaisen", "frieren", "demon-slayer", "blue-lock", "attack-on-titan"], blurb: "Aliens and ghosts and a love story. The opening on loop." },
  { slug: "blue-lock", name: "Blue Lock", category: "anime", trackingCount: 1093, avgDays: 64, emoji: "⚽", related: ["jujutsu-kaisen", "chainsaw-man", "demon-slayer", "attack-on-titan", "dandadan", "frieren"], blurb: "Isagi flow state. Bachira voice. Becoming weird about soccer." },

  // ── K-pop ────────────────────────────────────────────────────────────────
  { slug: "bts", name: "BTS", category: "kpop", trackingCount: 2934, avgDays: 167, emoji: "💜", related: ["blackpink", "twice", "newjeans", "seventeen", "stray-kids", "ateez"], blurb: "Bias eras across seven members. The military hiatus. The reunion countdown." },
  { slug: "blackpink", name: "Blackpink", category: "kpop", trackingCount: 2381, avgDays: 121, emoji: "🩷", related: ["bts", "twice", "newjeans", "le-sserafim", "ive", "ateez"], blurb: "Jennie era. The solo activities. The Coachella moment, still." },
  { slug: "twice", name: "Twice", category: "kpop", trackingCount: 1734, avgDays: 103, emoji: "🍭", related: ["bts", "blackpink", "newjeans", "le-sserafim", "ive", "seventeen"], blurb: "Nine members, nine biases. The setlist memorized. The fancams." },
  { slug: "newjeans", name: "NewJeans", category: "kpop", trackingCount: 2143, avgDays: 87, emoji: "🐰", related: ["le-sserafim", "ive", "blackpink", "twice", "bts", "seventeen"], blurb: "Y2K revival. Bunny aesthetic. Streaming Super Shy until your ears bleed." },
  { slug: "le-sserafim", name: "Le Sserafim", category: "kpop", trackingCount: 1487, avgDays: 76, emoji: "🦋", related: ["newjeans", "ive", "twice", "blackpink", "bts", "ateez"], blurb: "Fearless concept. Chaewon era. The choreo as a personality trait." },
  { slug: "ateez", name: "Ateez", category: "kpop", trackingCount: 1632, avgDays: 112, emoji: "🏴", related: ["stray-kids", "seventeen", "bts", "blackpink", "newjeans", "le-sserafim"], blurb: "Pirate era forever. The stages. Hongjoong as a way of life." },
  { slug: "stray-kids", name: "Stray Kids", category: "kpop", trackingCount: 1923, avgDays: 134, emoji: "🐺", related: ["ateez", "seventeen", "bts", "blackpink", "newjeans", "twice"], blurb: "5-STAR era. Bang Chan ment. Maknae line as a personality crisis." },
  { slug: "seventeen", name: "Seventeen", category: "kpop", trackingCount: 1764, avgDays: 119, emoji: "💎", related: ["stray-kids", "ateez", "bts", "twice", "blackpink", "newjeans"], blurb: "Thirteen members. Self-produced. The vocal team destroys you weekly." },
  { slug: "ive", name: "Ive", category: "kpop", trackingCount: 1289, avgDays: 81, emoji: "🤍", related: ["newjeans", "le-sserafim", "twice", "blackpink", "bts", "stray-kids"], blurb: "Wonyoung era. The princess concept. After Like in your bones still." },

  // ── Pop artists ──────────────────────────────────────────────────────────
  { slug: "taylor-swift", name: "Taylor Swift", category: "artist", trackingCount: 2987, avgDays: 174, emoji: "🧣", related: ["sabrina-carpenter", "chappell-roan", "billie-eilish", "phoebe-bridgers", "mitski", "the-weeknd"], blurb: "Era tracking. TTPD. The vault tracks. Crying in a stadium parking lot." },
  { slug: "sabrina-carpenter", name: "Sabrina Carpenter", category: "artist", trackingCount: 2143, avgDays: 92, emoji: "🎀", related: ["taylor-swift", "chappell-roan", "charli-xcx", "billie-eilish", "phoebe-bridgers", "mitski"], blurb: "Espresso summer. Short n' Sweet era. The outro variations, weekly." },
  { slug: "chappell-roan", name: "Chappell Roan", category: "artist", trackingCount: 1876, avgDays: 71, emoji: "👑", related: ["sabrina-carpenter", "taylor-swift", "charli-xcx", "billie-eilish", "mitski", "phoebe-bridgers"], blurb: "Pink Pony Club. Femininomenon. Drag-coded popstar living rent-free." },
  { slug: "charli-xcx", name: "Charli XCX", category: "artist", trackingCount: 1654, avgDays: 84, emoji: "🟢", related: ["sabrina-carpenter", "chappell-roan", "taylor-swift", "the-weeknd", "billie-eilish", "frank-ocean"], blurb: "Brat summer. The 360. Listing your feelings as Apple choreography." },
  { slug: "the-weeknd", name: "The Weeknd", category: "artist", trackingCount: 1432, avgDays: 109, emoji: "🥀", related: ["frank-ocean", "billie-eilish", "taylor-swift", "mitski", "phoebe-bridgers", "hozier"], blurb: "After Hours red suit era. Blinding Lights brain. The trilogy revisited." },
  { slug: "billie-eilish", name: "Billie Eilish", category: "artist", trackingCount: 1798, avgDays: 96, emoji: "🍃", related: ["mitski", "phoebe-bridgers", "frank-ocean", "taylor-swift", "the-weeknd", "chappell-roan"], blurb: "Hit Me Hard and Soft. The Lunch summer. Whisper-vocals as therapy." },
  { slug: "frank-ocean", name: "Frank Ocean", category: "artist", trackingCount: 1287, avgDays: 142, emoji: "🌊", related: ["the-weeknd", "mitski", "phoebe-bridgers", "billie-eilish", "hozier", "taylor-swift"], blurb: "Blonde anniversary spiral. Waiting for new music. Nights still ruins you." },
  { slug: "mitski", name: "Mitski", category: "artist", trackingCount: 1543, avgDays: 118, emoji: "🌙", related: ["phoebe-bridgers", "billie-eilish", "frank-ocean", "hozier", "the-weeknd", "taylor-swift"], blurb: "My Love Mine All Mine. Be the cowboy. Crying in transit, on schedule." },
  { slug: "phoebe-bridgers", name: "Phoebe Bridgers", category: "artist", trackingCount: 1376, avgDays: 124, emoji: "💀", related: ["mitski", "billie-eilish", "frank-ocean", "hozier", "the-weeknd", "taylor-swift"], blurb: "Punisher era. Boygenius reunion. Screaming in a car about a ghost." },
  { slug: "hozier", name: "Hozier", category: "artist", trackingCount: 1654, avgDays: 137, emoji: "🌿", related: ["mitski", "phoebe-bridgers", "frank-ocean", "the-weeknd", "taylor-swift", "billie-eilish"], blurb: "Bog era. Unreal Unearth. Too Sweet on loop. The forest is calling." },

  // ── Games ────────────────────────────────────────────────────────────────
  { slug: "baldurs-gate-3", name: "Baldur's Gate 3", category: "game", trackingCount: 2487, avgDays: 158, emoji: "🎲", related: ["elden-ring", "stardew-valley", "persona-5", "hades", "genshin-impact", "league-of-legends"], blurb: "Astarion era. Save scumming romance routes. 200 hours and counting." },
  { slug: "genshin-impact", name: "Genshin Impact", category: "game", trackingCount: 2143, avgDays: 174, emoji: "🌟", related: ["baldurs-gate-3", "persona-5", "league-of-legends", "stardew-valley", "elden-ring", "hades"], blurb: "Pulling for a 5-star. The lore. Sumeru still living in your head." },
  { slug: "elden-ring", name: "Elden Ring", category: "game", trackingCount: 1876, avgDays: 121, emoji: "⚔️", related: ["baldurs-gate-3", "hades", "persona-5", "stardew-valley", "genshin-impact", "league-of-legends"], blurb: "Maidenless behavior. The boss runs. NG+ as a personality." },
  { slug: "stardew-valley", name: "Stardew Valley", category: "game", trackingCount: 1734, avgDays: 167, emoji: "🌾", related: ["baldurs-gate-3", "hades", "genshin-impact", "persona-5", "elden-ring", "league-of-legends"], blurb: "Year 4 farm. Marrying Shane. Forgetting what real seasons feel like." },
  { slug: "persona-5", name: "Persona 5", category: "game", trackingCount: 1432, avgDays: 134, emoji: "🃏", related: ["baldurs-gate-3", "genshin-impact", "elden-ring", "hades", "stardew-valley", "league-of-legends"], blurb: "Phantom Thieves era. The soundtrack on loop. Confidant maxing as therapy." },
  { slug: "hades", name: "Hades", category: "game", trackingCount: 1287, avgDays: 97, emoji: "🔥", related: ["baldurs-gate-3", "elden-ring", "persona-5", "stardew-valley", "genshin-impact", "league-of-legends"], blurb: "Dying to Theseus. The dialogue tree. Megaera living rent-free." },
  { slug: "league-of-legends", name: "League of Legends", category: "game", trackingCount: 1987, avgDays: 178, emoji: "🛡️", related: ["genshin-impact", "baldurs-gate-3", "elden-ring", "persona-5", "hades", "stardew-valley"], blurb: "One more game. The new champ. Worlds run as a yearly mental event." },

  // ── Films ────────────────────────────────────────────────────────────────
  { slug: "dune", name: "Dune", category: "film", trackingCount: 1632, avgDays: 89, emoji: "🏜️", related: ["oppenheimer", "everything-everywhere", "past-lives", "challengers", "severance", "the-bear"], blurb: "Part Two brain. Chani. The sandworm scene replays unprompted, daily." },
  { slug: "oppenheimer", name: "Oppenheimer", category: "film", trackingCount: 1487, avgDays: 78, emoji: "⚛️", related: ["dune", "everything-everywhere", "past-lives", "challengers", "severance", "succession"], blurb: "Cillian Murphy era. Three hours of dread you'd happily rewatch monthly." },
  { slug: "everything-everywhere", name: "Everything Everywhere All At Once", category: "film", trackingCount: 1376, avgDays: 96, emoji: "🥯", related: ["past-lives", "challengers", "dune", "fleabag", "beef", "the-bear"], blurb: "Be a rock. Mother-daughter spiral. The Wong Kar-wai homage as a feeling." },
  { slug: "past-lives", name: "Past Lives", category: "film", trackingCount: 1187, avgDays: 102, emoji: "🪡", related: ["everything-everywhere", "challengers", "fleabag", "beef", "dune", "the-bear"], blurb: "In-yun. The bar scene. Crying about a person you barely remember." },
  { slug: "challengers", name: "Challengers", category: "film", trackingCount: 1543, avgDays: 73, emoji: "🎾", related: ["past-lives", "everything-everywhere", "dune", "oppenheimer", "the-bear", "fleabag"], blurb: "Zendaya era. Three-way tension. The score won't leave your prefrontal cortex." },

  // ── Books / BookTok ──────────────────────────────────────────────────────
  { slug: "acotar", name: "ACOTAR", category: "book", trackingCount: 2438, avgDays: 143, emoji: "🦇", related: ["fourth-wing", "throne-of-glass", "the-secret-history", "marauders-era", "taylor-swift", "hozier"], blurb: "Rhysand era. Velaris in your dreams. Re-reading Mist and Fury, again." },
  { slug: "fourth-wing", name: "Fourth Wing", category: "book", trackingCount: 2187, avgDays: 87, emoji: "🐉", related: ["acotar", "throne-of-glass", "the-secret-history", "marauders-era", "hozier", "taylor-swift"], blurb: "Xaden. The riders quadrant. Waiting for Onyx Storm like it's a religious holiday." },
  { slug: "the-secret-history", name: "The Secret History", category: "book", trackingCount: 1287, avgDays: 121, emoji: "🏛️", related: ["acotar", "fourth-wing", "throne-of-glass", "marauders-era", "fleabag", "succession"], blurb: "Dark academia brain. Translating Greek you don't know. Hating Henry, loving him." },
  { slug: "throne-of-glass", name: "Throne of Glass", category: "book", trackingCount: 1432, avgDays: 156, emoji: "👑", related: ["acotar", "fourth-wing", "the-secret-history", "marauders-era", "taylor-swift", "hozier"], blurb: "Rowaelin. Eight books deep. The ending still hurts. Worth it." },

  // ── Fanfic / Fandom Eras ─────────────────────────────────────────────────
  { slug: "marauders-era", name: "Marauders Era", category: "fanfic", trackingCount: 1876, avgDays: 167, emoji: "🌙", related: ["acotar", "fourth-wing", "the-secret-history", "throne-of-glass", "hozier", "taylor-swift"], blurb: "Wolfstar brain. All The Young Dudes spiral. Crying about fictional teenagers." },
  { slug: "kpop-demon-hunters", name: "K-pop Demon Hunters", category: "fanfic", trackingCount: 1093, avgDays: 64, emoji: "🗡️", related: ["bts", "blackpink", "stray-kids", "ateez", "newjeans", "marauders-era"], blurb: "Rumi era. Saja Boys spiral. Soda Pop on loop, still." },
];

export function getTrackItem(slug: string): TrackItem | undefined {
  return TRACK_ITEMS.find((t) => t.slug === slug);
}

export function getRelatedItems(item: TrackItem): TrackItem[] {
  return item.related
    .map((slug) => TRACK_ITEMS.find((t) => t.slug === slug))
    .filter((t): t is TrackItem => Boolean(t));
}

export const TRACK_SLUGS = TRACK_ITEMS.map((t) => t.slug);

export const CATEGORY_LABEL: Record<TrackCategory, string> = {
  show: "TV shows",
  song: "songs",
  artist: "music artists",
  game: "video games",
  book: "books",
  fanfic: "fandoms",
  film: "films",
  kpop: "K-pop",
  anime: "anime",
  character: "characters",
};

export const CATEGORY_SINGULAR: Record<TrackCategory, string> = {
  show: "a TV show",
  song: "a song",
  artist: "an artist",
  game: "a video game",
  book: "a book",
  fanfic: "a fandom",
  film: "a film",
  kpop: "a K-pop group",
  anime: "an anime",
  character: "a character",
};
