const OBJECTIVE_LABELS: Record<string, string> = {
  turismo:     'turismo',
  trabalho:    'viagem de negócios',
  descanso:    'descanso',
  gastronomia: 'gastronomia',
  festa:       'vida noturna',
  familia:     'viagem em família',
}

function detectObjective(text: string): string {
  const t = text.toLowerCase()
  if (/trabalho|negócio|reunião|conferência|congresso|business/.test(t)) return 'trabalho'
  if (/descanso|relaxar|tranquil|spa|paz|sossego/.test(t)) return 'descanso'
  if (/gastronomia|restaurante|culinária|comida|food|comer/.test(t)) return 'gastronomia'
  if (/festa|balada|noite|bares|vida noturna|pub|club/.test(t)) return 'festa'
  if (/família|criança|kids|filho|filha|bebê/.test(t)) return 'familia'
  return 'turismo'
}

export type Recommendation = {
  name: string
  location: string
  price: string
  rating: number
  reason: string
}

type Hotel = {
  name: string
  price: string
  rating: number
  baseReason: string
}

type NeighborhoodData = {
  display: string
  hotels: Hotel[]
}

export type POIEntry = {
  pattern: RegExp
  neighborhood: string
  displayName: string
}

export type CityConfig = {
  display: string
  country: string
  keywords: RegExp
  pois: POIEntry[]
  neighborhoodPatterns: Array<{ pattern: RegExp; key: string }>
  neighborhoods: Record<string, NeighborhoodData>
  objectiveDefaults: Record<string, string[]>
}

export const CITIES: Record<string, CityConfig> = {
  roma: {
    display: 'Roma',
    country: 'Itália',
    keywords: /\broma\b/i,
    pois: [
      { pattern: /coliseu|colosseo|colosseum|fórum romano/i, neighborhood: 'monti', displayName: 'Coliseu' },
      { pattern: /vaticano|são pedro|basílica.*pedro|museus.*vaticano/i, neighborhood: 'prati', displayName: 'Vaticano' },
      { pattern: /trastevere/i, neighborhood: 'trastevere', displayName: 'Trastevere' },
      { pattern: /fontana di trevi|trevi|pantheon|piazza navona/i, neighborhood: 'centro', displayName: 'Centro Histórico' },
      { pattern: /villa borghese|borghese/i, neighborhood: 'parioli', displayName: 'Villa Borghese' },
    ],
    neighborhoodPatterns: [
      { pattern: /\bmonti\b/i, key: 'monti' },
      { pattern: /\bprati\b/i, key: 'prati' },
      { pattern: /trastevere/i, key: 'trastevere' },
      { pattern: /centro (histórico|storico)/i, key: 'centro' },
      { pattern: /parioli/i, key: 'parioli' },
    ],
    neighborhoods: {
      monti: {
        display: 'Monti',
        hotels: [
          {
            name: 'Hotel Lancelot',
            price: '€ 180 / noite',
            rating: 4.7,
            baseReason: 'A 5 min a pé do Coliseu, no bairro mais charmoso de Roma, com ruas de paralelepípedo e ótimas trattorias.',
          },
          {
            name: 'Palazzo Manfredi',
            price: '€ 320 / noite',
            rating: 4.9,
            baseReason: 'Vista privilegiada para o Coliseu do terraço — o hotel boutique mais celebrado do bairro Monti.',
          },
        ],
      },
      prati: {
        display: 'Prati',
        hotels: [
          {
            name: 'Hotel San Pietrino',
            price: '€ 150 / noite',
            rating: 4.5,
            baseReason: 'A 10 min a pé do Vaticano, em bairro residencial e tranquilo, com ótimos cafés e restaurantes na rua.',
          },
          {
            name: 'Residenza Paolo VI',
            price: '€ 220 / noite',
            rating: 4.7,
            baseReason: 'Dentro de um convento histórico com vista direta para a Basílica de São Pedro.',
          },
        ],
      },
      trastevere: {
        display: 'Trastevere',
        hotels: [
          {
            name: 'Hotel Santa Maria',
            price: '€ 190 / noite',
            rating: 4.6,
            baseReason: 'Hotel com pátio interno no coração do bairro mais boêmio de Roma, rodeado de cantinas e vida noturna.',
          },
          {
            name: 'Arco del Lauro',
            price: '€ 130 / noite',
            rating: 4.5,
            baseReason: 'Pequena pousada familiar a poucos metros das melhores cantinas e da Piazza Santa Maria.',
          },
        ],
      },
      centro: {
        display: 'Centro Histórico',
        hotels: [
          {
            name: 'Hotel Nazionale',
            price: '€ 250 / noite',
            rating: 4.6,
            baseReason: 'A 2 min da Fontana di Trevi e do Pantheon — localização máxima para fazer tudo a pé.',
          },
          {
            name: 'Relais Navona',
            price: '€ 200 / noite',
            rating: 4.5,
            baseReason: 'Com janelas que dão para a Piazza Navona, no epicentro do centro histórico.',
          },
        ],
      },
      parioli: {
        display: 'Parioli',
        hotels: [
          {
            name: 'Hotel Aldrovandi',
            price: '€ 280 / noite',
            rating: 4.8,
            baseReason: 'Bairro residencial tranquilo próximo à Villa Borghese, ideal para paz e sofisticação fora do caos do centro.',
          },
        ],
      },
    },
    objectiveDefaults: {
      turismo:     ['monti', 'centro', 'prati'],
      trabalho:    ['centro', 'prati', 'monti'],
      descanso:    ['parioli', 'trastevere', 'monti'],
      gastronomia: ['trastevere', 'monti', 'centro'],
      festa:       ['trastevere', 'centro', 'monti'],
      familia:     ['prati', 'centro', 'monti'],
    },
  },

  tokyo: {
    display: 'Tóquio',
    country: 'Japão',
    keywords: /tóquio|tokyo|tokio/i,
    pois: [
      { pattern: /shinjuku/i, neighborhood: 'shinjuku', displayName: 'Shinjuku' },
      { pattern: /shibuya/i, neighborhood: 'shibuya', displayName: 'Shibuya' },
      { pattern: /asakusa|senso.?ji|skytree/i, neighborhood: 'asakusa', displayName: 'Asakusa' },
      { pattern: /akihabara/i, neighborhood: 'akihabara', displayName: 'Akihabara' },
      { pattern: /ginza/i, neighborhood: 'ginza', displayName: 'Ginza' },
      { pattern: /harajuku|takeshita/i, neighborhood: 'harajuku', displayName: 'Harajuku' },
    ],
    neighborhoodPatterns: [
      { pattern: /shinjuku/i, key: 'shinjuku' },
      { pattern: /shibuya/i, key: 'shibuya' },
      { pattern: /asakusa/i, key: 'asakusa' },
      { pattern: /akihabara/i, key: 'akihabara' },
      { pattern: /ginza/i, key: 'ginza' },
      { pattern: /harajuku/i, key: 'harajuku' },
    ],
    neighborhoods: {
      shinjuku: {
        display: 'Shinjuku',
        hotels: [
          {
            name: 'Park Hyatt Tokyo',
            price: '¥ 45.000 / noite',
            rating: 4.9,
            baseReason: 'Icônico hotel no arranha-céu de Shinjuku, com vistas do Monte Fuji e do skyline, e acesso direto ao metrô.',
          },
          {
            name: 'Hotel Gracery Shinjuku',
            price: '¥ 18.000 / noite',
            rating: 4.5,
            baseReason: 'Em cima de Kabukicho com acesso imediato à vida noturna, compras e todos os trens de Shinjuku.',
          },
        ],
      },
      shibuya: {
        display: 'Shibuya',
        hotels: [
          {
            name: 'Cerulean Tower Tokyu Hotel',
            price: '¥ 32.000 / noite',
            rating: 4.7,
            baseReason: 'Com vista para o famoso cruzamento de Shibuya, a 2 min a pé da estação mais movimentada do mundo.',
          },
          {
            name: 'Shibuya Stream Excel Hotel',
            price: '¥ 22.000 / noite',
            rating: 4.6,
            baseReason: 'Hotel moderno sobre o Rio Shibuya, ideal para explorar Harajuku, Omotesando e Daikanyama.',
          },
        ],
      },
      asakusa: {
        display: 'Asakusa',
        hotels: [
          {
            name: 'Asakusa View Hotel',
            price: '¥ 16.000 / noite',
            rating: 4.4,
            baseReason: 'Vista para o templo Senso-ji e o antigo bairro de Asakusa — o Tóquio mais tradicional e autêntico.',
          },
          {
            name: 'Khaosan Tokyo Ninja',
            price: '¥ 8.000 / noite',
            rating: 4.3,
            baseReason: 'Hostel temático a poucos passos do Senso-ji e da Tokyo Skytree, no coração do bairro histórico.',
          },
        ],
      },
      akihabara: {
        display: 'Akihabara',
        hotels: [
          {
            name: 'APA Hotel Akihabara',
            price: '¥ 12.000 / noite',
            rating: 4.3,
            baseReason: 'No centro do distrito eletrônico e de cultura pop — perfeito para fãs de anime, games e gadgets.',
          },
        ],
      },
      ginza: {
        display: 'Ginza',
        hotels: [
          {
            name: 'The Tokyo Station Hotel',
            price: '¥ 55.000 / noite',
            rating: 4.9,
            baseReason: 'Em prédio histórico da estação de Tóquio, no bairro mais luxuoso da cidade, com acesso a todo o metrô.',
          },
          {
            name: 'Mitsui Garden Hotel Ginza',
            price: '¥ 25.000 / noite',
            rating: 4.6,
            baseReason: 'No epicentro do luxo de Tóquio, a poucos passos das boutiques internacionais e galerias de arte.',
          },
        ],
      },
      harajuku: {
        display: 'Harajuku',
        hotels: [
          {
            name: 'Trunk Hotel Harajuku',
            price: '¥ 20.000 / noite',
            rating: 4.5,
            baseReason: 'Próximo à Takeshita Street e Omotesando, ideal para moda, street food e cultura jovem de Tóquio.',
          },
        ],
      },
    },
    objectiveDefaults: {
      turismo:     ['asakusa', 'ginza', 'shinjuku'],
      trabalho:    ['ginza', 'shinjuku', 'shibuya'],
      descanso:    ['asakusa', 'ginza', 'shinjuku'],
      gastronomia: ['ginza', 'shinjuku', 'asakusa'],
      festa:       ['shinjuku', 'shibuya', 'ginza'],
      familia:     ['asakusa', 'shinjuku', 'harajuku'],
    },
  },
}

export function getRecommendations(text: string): Recommendation[] {
  const objective = detectObjective(text)
  const cityKey = Object.keys(CITIES).find(k => CITIES[k].keywords.test(text))

  if (!cityKey) return []

  const city = CITIES[cityKey]
  const sources = new Map<string, string>() // neighborhood key → reason source

  for (const poi of city.pois) {
    if (poi.pattern.test(text) && !sources.has(poi.neighborhood)) {
      sources.set(poi.neighborhood, `poi:${poi.displayName}`)
    }
  }

  for (const np of city.neighborhoodPatterns) {
    if (np.pattern.test(text) && !sources.has(np.key)) {
      sources.set(np.key, 'direct')
    }
  }

  const defaults = city.objectiveDefaults[objective] ?? city.objectiveDefaults['turismo']
  for (const n of defaults) {
    if (sources.size >= 3) break
    if (!sources.has(n)) sources.set(n, `objective:${objective}`)
  }

  const results: Recommendation[] = []

  for (const [nKey, source] of Array.from(sources.entries()).slice(0, 3)) {
    const neighborhood = city.neighborhoods[nKey]
    if (!neighborhood || neighborhood.hotels.length === 0) continue

    const hotel = neighborhood.hotels[0]

    let prefix = ''
    if (source.startsWith('poi:')) {
      prefix = `Você mencionou ${source.slice(4)} — `
    } else if (source === 'direct') {
      prefix = `Em ${neighborhood.display}, como você queria — `
    } else {
      prefix = `Para ${OBJECTIVE_LABELS[objective]} em ${city.display}, ${neighborhood.display} é excelente — `
    }

    results.push({
      name: hotel.name,
      location: `${neighborhood.display}, ${city.display}, ${city.country}`,
      price: hotel.price,
      rating: hotel.rating,
      reason: prefix + hotel.baseReason,
    })
  }

  return results
}

// ── Restaurant ────────────────────────────────────────────────────────────────

export type Restaurant = {
  name: string
  cuisine: string
  neighborhood: string
  priceRange: string
  rating: number
  description: string
  mealType: 'lunch' | 'dinner' | 'both'
}

// ── Attraction ────────────────────────────────────────────────────────────────

export type Attraction = {
  name: string
  type: string
  neighborhood: string
  duration: string
  price: string
  description: string
}

// ── Trip summary ──────────────────────────────────────────────────────────────

export type TripSummary = {
  destination: string
  objective: string
  budget: number | null
  tripDays: number
  interests: string[]
}

// ── City extras data ──────────────────────────────────────────────────────────

const CITY_EXTRAS: Record<string, { restaurants: Restaurant[]; attractions: Attraction[] }> = {
  roma: {
    restaurants: [
      {
        name: 'Da Enzo al 29',
        cuisine: 'Italiana tradicional',
        neighborhood: 'Trastevere',
        priceRange: '€€',
        rating: 4.8,
        mealType: 'both',
        description: 'Trattoria familiar no coração do Trastevere — cacio e pepe e carbonara do jeito que devem ser feitos. Fila na porta todos os dias.',
      },
      {
        name: 'Pizzarium Bonci',
        cuisine: 'Pizza al taglio',
        neighborhood: 'Prati',
        priceRange: '€',
        rating: 4.7,
        mealType: 'lunch',
        description: 'Gabri Bonci transformou pizza de rua em arte. Vendida por peso, com coberturas que mudam todo dia — imperdível ao visitar o Vaticano.',
      },
      {
        name: 'Il Pagliaccio',
        cuisine: 'Alta gastronomia italiana',
        neighborhood: 'Centro Histórico',
        priceRange: '€€€€',
        rating: 4.9,
        mealType: 'dinner',
        description: 'Dois estrelas Michelin no centro histórico. Menu degustação que reinterpreta a cozinha romana com técnica de alto nível.',
      },
    ],
    attractions: [
      {
        name: 'Coliseu e Fórum Romano',
        type: 'Monumento histórico',
        neighborhood: 'Monti',
        duration: '3–4 horas',
        price: '€ 16',
        description: 'O anfiteatro mais famoso do mundo, construído em 72 d.C. O ingresso inclui o Fórum Romano e o Palatino — reserve com antecedência.',
      },
      {
        name: 'Museus do Vaticano e Capela Sistina',
        type: 'Museu',
        neighborhood: 'Prati',
        duration: '3–5 horas',
        price: '€ 20',
        description: 'O maior museu de arte sacra do mundo, com o teto da Sistina pintado por Michelangelo. Reserve com semanas de antecedência no verão.',
      },
      {
        name: 'Fontana di Trevi e Pantheon',
        type: 'Passeio a pé',
        neighborhood: 'Centro Histórico',
        duration: '2 horas',
        price: 'Grátis (Pantheon € 5)',
        description: 'Os dois pontos mais icônicos do centro histórico, a 10 min a pé um do outro. Melhor visitados cedo pela manhã ou à noite.',
      },
    ],
  },

  tokyo: {
    restaurants: [
      {
        name: 'Ichiran Ramen',
        cuisine: 'Ramen japonês',
        neighborhood: 'Shinjuku',
        priceRange: '¥',
        rating: 4.6,
        mealType: 'both',
        description: 'A rede de ramen mais famosa do Japão. Boxes individuais para comer concentrado, com personalização total do caldo. Funciona 24h.',
      },
      {
        name: 'Sukiyabashi Jiro Honten',
        cuisine: 'Sushi omakase',
        neighborhood: 'Ginza',
        priceRange: '¥¥¥¥¥',
        rating: 5.0,
        mealType: 'dinner',
        description: 'Três estrelas Michelin e inspiração do documentário "Jiro Dreams of Sushi". Menu único servido pelo mestre Jiro — reserva com meses de antecedência.',
      },
      {
        name: 'Gonpachi Nishiazabu',
        cuisine: 'Izakaya tradicional',
        neighborhood: 'Shibuya',
        priceRange: '¥¥¥',
        rating: 4.5,
        mealType: 'dinner',
        description: 'O izakaya que inspirou a cena do restaurante em Kill Bill. Robata, yakitori e saquê em ambiente histórico de dois andares com bambus.',
      },
    ],
    attractions: [
      {
        name: 'Templo Senso-ji e Asakusa',
        type: 'Templo histórico',
        neighborhood: 'Asakusa',
        duration: '2–3 horas',
        price: 'Grátis',
        description: 'O templo mais antigo de Tóquio, fundado em 645 d.C. A Nakamise-dori, rua de souvenir até o templo, é uma das mais fotogênicas do Japão.',
      },
      {
        name: 'teamLab Planets',
        type: 'Arte digital imersiva',
        neighborhood: 'Shibuya',
        duration: '1–2 horas',
        price: '¥ 3.200',
        description: 'Instalações onde você caminha descalço por espelhos infinitos, flores digitais e jardins de luz. Experiência única no mundo.',
      },
      {
        name: 'Tokyo Skytree',
        type: 'Mirante',
        neighborhood: 'Asakusa',
        duration: '1–2 horas',
        price: '¥ 2.100',
        description: 'A torre mais alta do Japão (634 m) com vista de 360° da cidade. Em dia claro dá para ver o Monte Fuji. Melhor ao anoitecer.',
      },
    ],
  },
}

// ── Public functions ──────────────────────────────────────────────────────────

export function parseTripSummary(text: string): TripSummary {
  const t = text.toLowerCase()

  const cityKey = Object.keys(CITIES).find(k => CITIES[k].keywords.test(text))
  const destination = cityKey
    ? `${CITIES[cityKey].display}, ${CITIES[cityKey].country}`
    : 'Não identificado'

  const objectiveKey = detectObjective(text)
  const objective = OBJECTIVE_LABELS[objectiveKey]

  // Detect budget as a number (e.g. "R$50", "50 reais", "€80")
  let budget: number | null = null
  const budgetMatch = text.match(/(?:R\$|€)\s*(\d+(?:[.,]\d+)?)|(\d+(?:[.,]\d+)?)\s*reais?/i)
  if (budgetMatch) {
    const raw = (budgetMatch[1] ?? budgetMatch[2]).replace(',', '.')
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) budget = parsed
  }

  // Detect number of days (default 3, cap at 14)
  let tripDays = 3
  const daysMatch = text.match(/(\d+)\s*dias?/i)
  if (daysMatch) {
    const parsed = parseInt(daysMatch[1], 10)
    if (!isNaN(parsed)) tripDays = Math.min(Math.max(parsed, 1), 14)
  }

  // Detect multiple interests
  const interests: string[] = []
  if (/turismo|pontos turísticos|atrações|sightseeing|conhecer|visitar/.test(t)) interests.push('Turismo')
  if (/trabalho|negócio|conferência|congresso/.test(t)) interests.push('Negócios')
  if (/descanso|relaxar|tranquil|spa/.test(t)) interests.push('Descanso')
  if (/gastronomia|restaurante|comida|culinária|comer/.test(t)) interests.push('Gastronomia')
  if (/museu|arte|galeria|cultura/.test(t)) interests.push('Museus e cultura')
  if (/natureza|trilha|parque|cachoeira/.test(t)) interests.push('Natureza')
  if (/compras|shopping/.test(t)) interests.push('Compras')
  if (/praia|mar|litoral/.test(t)) interests.push('Praia')
  if (/festa|balada|vida noturna/.test(t)) interests.push('Vida noturna')
  if (/família|criança|kids/.test(t)) interests.push('Família')
  if (/aventura|radical|esporte/.test(t)) interests.push('Aventura')
  if (cityKey) {
    for (const poi of CITIES[cityKey].pois) {
      if (poi.pattern.test(text)) interests.push(poi.displayName)
    }
  }

  return { destination, objective, budget, tripDays, interests }
}

export function getRestaurants(text: string): Restaurant[] {
  const cityKey = Object.keys(CITIES).find(k => CITIES[k].keywords.test(text))
  if (!cityKey) return []
  return CITY_EXTRAS[cityKey]?.restaurants ?? []
}

export function getAttractions(text: string): Attraction[] {
  const cityKey = Object.keys(CITIES).find(k => CITIES[k].keywords.test(text))
  if (!cityKey) return []
  return CITY_EXTRAS[cityKey]?.attractions ?? []
}

// ── Itinerary ─────────────────────────────────────────────────────────────────

export type ItinerarySlot = {
  period: 'Manhã' | 'Almoço' | 'Tarde' | 'Noite'
  title: string
  subtitle: string
  note: string
  type: 'attraction' | 'restaurant' | 'free'
}

export type ItineraryDay = {
  day: number
  label: string
  slots: ItinerarySlot[]
}

export function generateItinerary(
  hotels: Recommendation[],
  restaurants: Restaurant[],
  attractions: Attraction[],
  tripDays = 3,
): ItineraryDay[] {
  if (attractions.length === 0 || restaurants.length === 0) return []

  function pick<T>(arr: T[], idx: number): T {
    return arr[idx % arr.length]
  }

  function neighborhood(idx: number): string {
    if (hotels.length === 0) return 'destino'
    return pick(hotels, idx).location.split(',')[0].trim()
  }

  function firstSentence(text: string): string {
    return text.split('.')[0] + '.'
  }

  // Split restaurants into lunch and dinner pools with fallback to all
  const lunchPool = restaurants.filter(r => r.mealType === 'lunch' || r.mealType === 'both')
  const dinnerPool = restaurants.filter(r => r.mealType === 'dinner' || r.mealType === 'both')
  const safeLunch = lunchPool.length > 0 ? lunchPool : restaurants
  const safeDinner = dinnerPool.length > 0 ? dinnerPool : restaurants

  function attractionSlot(period: 'Manhã' | 'Tarde', idx: number): ItinerarySlot {
    const a = pick(attractions, idx)
    return {
      period,
      title: a.name,
      subtitle: `${a.type} · ${a.neighborhood}`,
      note: `Duração: ${a.duration}. ${firstSentence(a.description)}`,
      type: 'attraction',
    }
  }

  function lunchSlot(idx: number): ItinerarySlot {
    const r = pick(safeLunch, idx)
    return {
      period: 'Almoço',
      title: r.name,
      subtitle: `${r.cuisine} · ${r.neighborhood}`,
      note: firstSentence(r.description),
      type: 'restaurant',
    }
  }

  function dinnerSlot(idx: number, note?: string): ItinerarySlot {
    const r = pick(safeDinner, idx)
    return {
      period: 'Noite',
      title: r.name,
      subtitle: `${r.cuisine} · ${r.neighborhood}`,
      note: note ?? firstSentence(r.description),
      type: 'restaurant',
    }
  }

  function freeSlot(period: 'Manhã' | 'Tarde', hotelIdx: number, note: string): ItinerarySlot {
    const label = period === 'Manhã' ? 'Manhã tranquila' : 'Tarde livre'
    return {
      period,
      title: `${label} em ${neighborhood(hotelIdx)}`,
      subtitle: 'Passeio livre',
      note,
      type: 'free',
    }
  }

  const clampedDays = Math.max(1, tripDays)
  const days: ItineraryDay[] = []

  for (let i = 0; i < clampedDays; i++) {
    const isFirst = i === 0
    const isLast = i === clampedDays - 1

    const label =
      clampedDays === 1 ? 'Dia único' :
      isFirst           ? 'Chegada e primeiros passos' :
      isLast            ? 'Último dia e despedida' :
                          'Explorando mais a fundo'

    const morning = (isLast && clampedDays > 1)
      ? freeSlot('Manhã', i, 'Café da manhã com calma, caminhada pelo bairro e últimas compras.')
      : attractionSlot('Manhã', i * 2)

    const afternoon = isFirst
      ? attractionSlot('Tarde', i * 2 + 1)
      : freeSlot('Tarde', i, 'Explore o bairro da hospedagem, descanse ou visite algum ponto que chamou atenção.')

    const dinner = isLast
      ? dinnerSlot(i, 'Jantar de despedida — finalize a viagem com a melhor experiência gastronômica do destino.')
      : dinnerSlot(i)

    days.push({ day: i + 1, label, slots: [morning, lunchSlot(i), afternoon, dinner] })
  }

  return days
}
