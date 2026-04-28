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
  if (/turismo|pontos? turísticos?|sightseeing|conhecer|visitar|museu|galeria|templo|monumento|atração/.test(t)) return 'turismo'
  if (/gastronomia|restaurante|culinária|comida|food|comer/.test(t)) return 'gastronomia'
  if (/festa|balada|noite|bares|vida noturna|pub|club/.test(t)) return 'festa'
  if (/família|criança|kids|filho|filha|bebê/.test(t)) return 'familia'
  return 'turismo'
}

// Returns every matching objective key — used for multi-objective recommendation blending
function detectObjectives(text: string): string[] {
  const t = text.toLowerCase()
  const found: string[] = []
  if (/trabalho|negócio|reunião|conferência|congresso|business/.test(t)) found.push('trabalho')
  if (/descanso|relaxar|tranquil|spa|paz|sossego/.test(t)) found.push('descanso')
  if (/turismo|pontos? turísticos?|sightseeing|conhecer|visitar|museu|galeria|templo|monumento|atração/.test(t)) found.push('turismo')
  if (/gastronomia|restaurante|culinária|comida|food|comer/.test(t)) found.push('gastronomia')
  if (/festa|balada|noite|bares|vida noturna|pub|club/.test(t)) found.push('festa')
  if (/família|criança|kids|filho|filha|bebê/.test(t)) found.push('familia')
  return found.length > 0 ? found : ['turismo']
}

export type Recommendation = {
  name: string
  location: string
  price: string
  rating: number
  reason: string
  reviewCount: number
  reviewSnippet: string
}

type Hotel = {
  name: string
  price: string
  rating: number
  baseReason: string
  reviewCount: number
  reviewSnippet: string
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
          { name: 'Hotel Lancelot', price: '€ 180 / noite', rating: 4.7, reviewCount: 2847, reviewSnippet: 'Localização perfeita — acordei e o Coliseu estava ali na janela.', baseReason: 'A 5 min a pé do Coliseu, no bairro mais charmoso de Roma, com ruas de paralelepípedo e ótimas trattorias.' },
          { name: 'Palazzo Manfredi', price: '€ 320 / noite', rating: 4.9, reviewCount: 1203, reviewSnippet: 'O melhor café da manhã com vista para o Coliseu da minha vida.', baseReason: 'Vista privilegiada para o Coliseu do terraço — o hotel boutique mais celebrado do bairro Monti.' },
          { name: 'Nerva Boutique Hotel', price: '€ 160 / noite', rating: 4.5, reviewCount: 3412, reviewSnippet: 'Quartos menores, mas o bairro Monti vale cada euro — voltaria amanhã.', baseReason: 'Hotel boutique no coração de Monti, a dois passos do Fórum Romano e das melhores enotecas do bairro.' },
        ],
      },
      prati: {
        display: 'Prati',
        hotels: [
          { name: 'Hotel San Pietrino', price: '€ 150 / noite', rating: 4.5, reviewCount: 3891, reviewSnippet: 'Limpo, acolhedor e a dois passos do Vaticano — superou as expectativas.', baseReason: 'A 10 min a pé do Vaticano, em bairro residencial e tranquilo, com ótimos cafés e restaurantes na rua.' },
          { name: 'Residenza Paolo VI', price: '€ 220 / noite', rating: 4.7, reviewCount: 982, reviewSnippet: 'Dormir com vista para São Pedro não tem preço.', baseReason: 'Dentro de um convento histórico com vista direta para a Basílica de São Pedro.' },
          { name: 'Hotel Dei Consoli', price: '€ 175 / noite', rating: 4.4, reviewCount: 2134, reviewSnippet: 'Ótimo para quem quer explorar o Vaticano sem estresse de transporte.', baseReason: 'A 8 min a pé do Vaticano em Prati, com decoração clássica romana e café da manhã farto.' },
        ],
      },
      trastevere: {
        display: 'Trastevere',
        hotels: [
          { name: 'Hotel Santa Maria', price: '€ 190 / noite', rating: 4.6, reviewCount: 4122, reviewSnippet: 'O pátio florido é um oásis no meio do agito do Trastevere.', baseReason: 'Hotel com pátio interno no coração do bairro mais boêmio de Roma, rodeado de cantinas e vida noturna.' },
          { name: 'Arco del Lauro', price: '€ 130 / noite', rating: 4.5, reviewCount: 5674, reviewSnippet: 'Melhor custo-benefício de Roma — hospitalidade de quem te conhece há anos.', baseReason: 'Pequena pousada familiar a poucos metros das melhores cantinas e da Piazza Santa Maria.' },
          { name: 'Buonanotte Garibaldi', price: '€ 210 / noite', rating: 4.6, reviewCount: 1891, reviewSnippet: 'Casa particular transformada em pousada — parece que você mora em Roma.', baseReason: 'Charme de casa histórica no Trastevere, com jardim privativo e vista para os telhados romanos.' },
        ],
      },
      centro: {
        display: 'Centro Histórico',
        hotels: [
          { name: 'Hotel Nazionale', price: '€ 250 / noite', rating: 4.6, reviewCount: 3208, reviewSnippet: 'Acordei, abri a janela e a Fontana di Trevi estava ali. Inacreditável.', baseReason: 'A 2 min da Fontana di Trevi e do Pantheon — localização máxima para fazer tudo a pé.' },
          { name: 'Relais Navona', price: '€ 200 / noite', rating: 4.5, reviewCount: 2914, reviewSnippet: 'Ver a Piazza Navona de manhã cedo, sem turistas, foi mágico.', baseReason: 'Com janelas que dão para a Piazza Navona, no epicentro do centro histórico.' },
          { name: 'Hotel Due Torri', price: '€ 230 / noite', rating: 4.4, reviewCount: 1876, reviewSnippet: 'Localização imbatível — saí andando para o Pantheon em 3 minutos.', baseReason: 'Hotel histórico entre a Piazza Navona e o Pantheon, ideal para quem quer Roma toda a pé.' },
        ],
      },
      parioli: {
        display: 'Parioli',
        hotels: [
          { name: 'Hotel Aldrovandi', price: '€ 280 / noite', rating: 4.8, reviewCount: 1547, reviewSnippet: 'A tranquilidade de Parioli com a elegância de um grande hotel romano.', baseReason: 'Bairro residencial tranquilo próximo à Villa Borghese, ideal para paz e sofisticação fora do caos do centro.' },
        ],
      },
      testaccio: {
        display: 'Testaccio',
        hotels: [
          { name: 'Hotel San Anselmo', price: '€ 165 / noite', rating: 4.5, reviewCount: 2341, reviewSnippet: 'Bairro autêntico sem turista, comida incrível e metro na porta.', baseReason: 'No bairro mais autêntico de Roma, perto do Mercado de Testaccio e das melhores cantinas da cidade.' },
          { name: 'Aventino Garden Inn', price: '€ 145 / noite', rating: 4.4, reviewCount: 1923, reviewSnippet: 'Vista do buraco da fechadura do Cavalieri di Malta — experiência única.', baseReason: 'No cume do Aventino, com jardins tranquilos e vista privilegiada do Tibre e do centro histórico.' },
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
          { name: 'Park Hyatt Tokyo', price: '¥ 45.000 / noite', rating: 4.9, reviewCount: 8234, reviewSnippet: 'O bar do 52º andar ao anoitecer é uma das vistas mais bonitas do mundo.', baseReason: 'Icônico hotel no arranha-céu de Shinjuku, com vistas do Monte Fuji e do skyline, e acesso direto ao metrô.' },
          { name: 'Hotel Gracery Shinjuku', price: '¥ 18.000 / noite', rating: 4.5, reviewCount: 12483, reviewSnippet: 'Kabukicho é agitado mas o hotel é um refúgio de conforto e organização.', baseReason: 'Em cima de Kabukicho com acesso imediato à vida noturna, compras e todos os trens de Shinjuku.' },
          { name: 'Shinjuku Granbell Hotel', price: '¥ 14.000 / noite', rating: 4.4, reviewCount: 9871, reviewSnippet: 'Design moderno, boa localização e preço justo para Shinjuku.', baseReason: 'Hotel design em Shinjuku com quartos compactos e bem planejados, a 5 min a pé da estação central.' },
        ],
      },
      shibuya: {
        display: 'Shibuya',
        hotels: [
          { name: 'Cerulean Tower Tokyu Hotel', price: '¥ 32.000 / noite', rating: 4.7, reviewCount: 6891, reviewSnippet: 'Ver o cruzamento de Shibuya do quarto é uma experiência única.', baseReason: 'Com vista para o famoso cruzamento de Shibuya, a 2 min a pé da estação mais movimentada do mundo.' },
          { name: 'Shibuya Stream Excel Hotel', price: '¥ 22.000 / noite', rating: 4.6, reviewCount: 9341, reviewSnippet: 'Hotel moderno, equipe impecável e em cima da estação de Shibuya.', baseReason: 'Hotel moderno sobre o Rio Shibuya, ideal para explorar Harajuku, Omotesando e Daikanyama.' },
        ],
      },
      asakusa: {
        display: 'Asakusa',
        hotels: [
          { name: 'Asakusa View Hotel', price: '¥ 16.000 / noite', rating: 4.4, reviewCount: 7102, reviewSnippet: 'Acordar com o Senso-ji iluminado pela manhã é inesquecível.', baseReason: 'Vista para o templo Senso-ji e o antigo bairro de Asakusa — o Tóquio mais tradicional e autêntico.' },
          { name: 'Khaosan Tokyo Ninja', price: '¥ 8.000 / noite', rating: 4.3, reviewCount: 15892, reviewSnippet: 'Ótimo para conhecer mochileiros do mundo inteiro no Japão.', baseReason: 'Hostel temático a poucos passos do Senso-ji e da Tokyo Skytree, no coração do bairro histórico.' },
          { name: 'Remm Asakusa', price: '¥ 12.000 / noite', rating: 4.5, reviewCount: 11234, reviewSnippet: 'Quarto silencioso, cama confortável e Asakusa histórico na porta.', baseReason: 'Hotel moderno no bairro histórico de Asakusa, com quartos bem insonorizados e café da manhã japonês.' },
        ],
      },
      akihabara: {
        display: 'Akihabara',
        hotels: [
          { name: 'APA Hotel Akihabara', price: '¥ 12.000 / noite', rating: 4.3, reviewCount: 18234, reviewSnippet: 'Quarto pequeno mas muito funcional — do jeito japonês de fazer hotel.', baseReason: 'No centro do distrito eletrônico e de cultura pop — perfeito para fãs de anime, games e gadgets.' },
          { name: 'Dormy Inn Akihabara', price: '¥ 10.500 / noite', rating: 4.4, reviewCount: 14321, reviewSnippet: 'Onsen no topo do prédio após um dia em Akihabara — relaxante demais.', baseReason: 'Com banho termal (onsen) no rooftop, a poucos metros das lojas de eletrônicos e cultura pop.' },
        ],
      },
      ginza: {
        display: 'Ginza',
        hotels: [
          { name: 'The Tokyo Station Hotel', price: '¥ 55.000 / noite', rating: 4.9, reviewCount: 5892, reviewSnippet: 'Ficar num patrimônio histórico com toda a modernidade de um hotel de luxo.', baseReason: 'Em prédio histórico da estação de Tóquio, no bairro mais luxuoso da cidade, com acesso a todo o metrô.' },
          { name: 'Mitsui Garden Hotel Ginza', price: '¥ 25.000 / noite', rating: 4.6, reviewCount: 11234, reviewSnippet: 'Custo-benefício imbatível para a região de Ginza, tudo muito limpo.', baseReason: 'No epicentro do luxo de Tóquio, a poucos passos das boutiques internacionais e galerias de arte.' },
        ],
      },
      harajuku: {
        display: 'Harajuku',
        hotels: [
          { name: 'Trunk Hotel Harajuku', price: '¥ 20.000 / noite', rating: 4.5, reviewCount: 4123, reviewSnippet: 'Design pensado nos mínimos detalhes, café incrível e equipe bilíngue.', baseReason: 'Próximo à Takeshita Street e Omotesando, ideal para moda, street food e cultura jovem de Tóquio.' },
        ],
      },
      ueno: {
        display: 'Ueno',
        hotels: [
          { name: 'Hotel Coco Grand Ueno', price: '¥ 13.500 / noite', rating: 4.4, reviewCount: 8934, reviewSnippet: 'Parque de Ueno na porta — ótima base para museus e o lado clássico de Tóquio.', baseReason: 'Ao lado do Parque de Ueno, com acesso fácil ao zoo, museus e ao bairro de Asakusa.' },
          { name: 'APA Hotel Ueno-Ekimae', price: '¥ 9.800 / noite', rating: 4.2, reviewCount: 21043, reviewSnippet: 'Preço justo e localização central para explorar Tóquio de metrô.', baseReason: 'Em frente à estação de Ueno — linha Yamanote na porta, ideal para se mover por toda a cidade.' },
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
  const objectives = detectObjectives(text)
  const cityKey = Object.keys(CITIES).find(k => CITIES[k].keywords.test(text))

  if (!cityKey) return []

  const city = CITIES[cityKey]
  const orderedNeighborhoods: string[] = []
  const neighborhoodSources = new Map<string, string>()

  // 1. POI mentions — highest priority
  for (const poi of city.pois) {
    if (poi.pattern.test(text) && !neighborhoodSources.has(poi.neighborhood)) {
      neighborhoodSources.set(poi.neighborhood, `poi:${poi.displayName}`)
      orderedNeighborhoods.push(poi.neighborhood)
    }
  }

  // 2. Direct neighborhood mentions
  for (const np of city.neighborhoodPatterns) {
    if (np.pattern.test(text) && !neighborhoodSources.has(np.key)) {
      neighborhoodSources.set(np.key, 'direct')
      orderedNeighborhoods.push(np.key)
    }
  }

  // 3. Round-robin across all detected objectives' default neighborhoods
  //    e.g. turismo=[monti,centro,prati] + gastronomia=[trastevere,monti,centro]
  //    → monti(T), trastevere(G), centro(T), prati(T)   (duplicates skipped)
  const defaultLists = objectives.map(
    obj => city.objectiveDefaults[obj] ?? city.objectiveDefaults['turismo']
  )
  const maxLen = Math.max(...defaultLists.map(l => l.length))
  for (let i = 0; i < maxLen; i++) {
    for (const list of defaultLists) {
      const n = list[i]
      if (n && !neighborhoodSources.has(n)) {
        neighborhoodSources.set(n, `objective:${objectives.join('+')}`)
        orderedNeighborhoods.push(n)
      }
    }
  }

  // 4. Remaining neighborhoods — fill the pool tail
  for (const nKey of Object.keys(city.neighborhoods)) {
    if (!neighborhoodSources.has(nKey)) {
      neighborhoodSources.set(nKey, 'extra')
      orderedNeighborhoods.push(nKey)
    }
  }

  // Build combined objective label for reason prefix
  const objectiveLabel = objectives
    .map(o => OBJECTIVE_LABELS[o] ?? o)
    .join(' e ')

  const results: Recommendation[] = []

  for (const nKey of orderedNeighborhoods) {
    const neighborhood = city.neighborhoods[nKey]
    if (!neighborhood) continue
    const source = neighborhoodSources.get(nKey) ?? 'extra'

    for (const hotel of neighborhood.hotels) {
      let prefix = ''
      if (source.startsWith('poi:')) {
        prefix = `Você mencionou ${source.slice(4)} — `
      } else if (source === 'direct') {
        prefix = `Em ${neighborhood.display}, como você queria — `
      } else if (source.startsWith('objective:')) {
        prefix = `Para ${objectiveLabel} em ${city.display}, ${neighborhood.display} é excelente — `
      } else {
        prefix = `Em ${neighborhood.display}, ${city.display} — `
      }

      results.push({
        name: hotel.name,
        location: `${neighborhood.display}, ${city.display}, ${city.country}`,
        price: hotel.price,
        rating: hotel.rating,
        reason: prefix + hotel.baseReason,
        reviewCount: hotel.reviewCount,
        reviewSnippet: hotel.reviewSnippet,
      })
    }
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
  reviewCount: number
  reviewSnippet: string
}

// ── Attraction ────────────────────────────────────────────────────────────────

export type Attraction = {
  name: string
  type: string
  neighborhood: string
  duration: string
  price: string
  description: string
  reviewCount: number
  reviewSnippet: string
}

// ── Trip summary ──────────────────────────────────────────────────────────────

export type TripSummary = {
  destination: string
  duration: number
  objectives: string[]
  preferences: {
    budget?: number
    quality?: 'low' | 'medium' | 'high'
  }
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
        reviewCount: 6234,
        reviewSnippet: 'A carbonara mais autêntica que comi em Roma — impossível não pedir de novo.',
      },
      {
        name: 'Pizzarium Bonci',
        cuisine: 'Pizza al taglio',
        neighborhood: 'Prati',
        priceRange: '€',
        rating: 4.7,
        mealType: 'lunch',
        description: 'Gabri Bonci transformou pizza de rua em arte. Vendida por peso, com coberturas que mudam todo dia — imperdível ao visitar o Vaticano.',
        reviewCount: 8921,
        reviewSnippet: 'Saí do Vaticano e fui direto aqui — melhor decisão da viagem.',
      },
      {
        name: 'Il Pagliaccio',
        cuisine: 'Alta gastronomia italiana',
        neighborhood: 'Centro Histórico',
        priceRange: '€€€€',
        rating: 4.9,
        mealType: 'dinner',
        description: 'Dois estrelas Michelin no centro histórico. Menu degustação que reinterpreta a cozinha romana com técnica de alto nível.',
        reviewCount: 2187,
        reviewSnippet: 'Experiência gastronômica inesquecível — cada prato é uma obra de arte.',
      },
      {
        name: 'Supplì Roma',
        cuisine: 'Street food romano',
        neighborhood: 'Trastevere',
        priceRange: '€',
        rating: 4.6,
        mealType: 'lunch',
        description: 'O lugar definitivo para o supplì alla romana — bolinho de arroz frito com ragù e mozzarella filante. Fila constante de moradores locais.',
        reviewCount: 11432,
        reviewSnippet: 'Melhor supplì de Roma sem discussão — ainda penso nele semanas depois.',
      },
      {
        name: 'Osteria dell\'Angelo',
        cuisine: 'Cucina romana',
        neighborhood: 'Prati',
        priceRange: '€€',
        rating: 4.6,
        mealType: 'dinner',
        description: 'Cucina romana clássica às terças e quintas com menu fixo e preço fixo — gricia, coda alla vaccinara e tiramisù da casa. Reserva obrigatória.',
        reviewCount: 4891,
        reviewSnippet: 'Menu fixo impecável, ambiente descontraído e preço justo para a região.',
      },
      {
        name: 'Ristorante Settimio all\'Arancio',
        cuisine: 'Cucina romana clássica',
        neighborhood: 'Centro Histórico',
        priceRange: '€€€',
        rating: 4.5,
        mealType: 'both',
        description: 'Trattoria histórica a 3 minutos do Pantheon, em funcionamento desde 1938. Bucatini all\'amatriciana e saltimbocca alla romana impecáveis.',
        reviewCount: 3742,
        reviewSnippet: 'Tradição romana em cada garfada — um dos restaurantes mais honestos do centro.',
      },
      {
        name: 'Mercato Centrale Roma',
        cuisine: 'Mercado gastronômico',
        neighborhood: 'Monti',
        priceRange: '€€',
        rating: 4.5,
        mealType: 'lunch',
        description: 'Mercado dentro da Estação Termini com bancas de produtores italianos. Pasta fresca, pane, gelato artesanal e vinho natural — tudo excelente.',
        reviewCount: 14328,
        reviewSnippet: 'Ideal para almoçar rápido e bem antes de pegar o trem. Voltei dois dias seguidos.',
      },
      {
        name: 'Piperno',
        cuisine: 'Culinária judaico-romana',
        neighborhood: 'Testaccio',
        priceRange: '€€€',
        rating: 4.7,
        mealType: 'dinner',
        description: 'O mais tradicional restaurante da cozinha judaico-romana, especialidade em carciofi alla giudia (alcachofras fritas) e fritto misto. Desde 1860.',
        reviewCount: 3219,
        reviewSnippet: 'As alcachofras à la judia são as melhores de Roma — venha com fome.',
      },
      {
        name: 'L\'Asino d\'Oro',
        cuisine: 'Cucina umbra-romana criativa',
        neighborhood: 'Monti',
        priceRange: '€€€',
        rating: 4.6,
        mealType: 'dinner',
        description: 'Chef Lucio Sforza reinterpreta os ingredientes da Úmbria e do Lácio com técnica moderna. Um dos endereços mais criativos do bairro Monti.',
        reviewCount: 2634,
        reviewSnippet: 'Surpreendente — pratos simples executados com perfeição rara em Roma.',
      },
      {
        name: 'Gelateria del Teatro',
        cuisine: 'Gelato artesanal',
        neighborhood: 'Centro Histórico',
        priceRange: '€',
        rating: 4.8,
        mealType: 'both',
        description: 'Gelato feito na hora com ingredientes sazonais — limão siciliano, pistache de Bronte, figos e combinações inusitadas. A 5 min da Piazza Navona.',
        reviewCount: 19847,
        reviewSnippet: 'O gelato de figo com nozes mudou minha relação com sorvete para sempre.',
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
        reviewCount: 48234,
        reviewSnippet: 'Nenhuma foto prepara para a escala real do Coliseu — absolutamente impressionante.',
      },
      {
        name: 'Museus do Vaticano e Capela Sistina',
        type: 'Museu',
        neighborhood: 'Prati',
        duration: '3–5 horas',
        price: '€ 20',
        description: 'O maior museu de arte sacra do mundo, com o teto da Sistina pintado por Michelangelo. Reserve com semanas de antecedência no verão.',
        reviewCount: 52891,
        reviewSnippet: 'A Capela Sistina ao vivo deixa sem fala — chegue cedo para aproveitar melhor.',
      },
      {
        name: 'Fontana di Trevi e Pantheon',
        type: 'Passeio a pé',
        neighborhood: 'Centro Histórico',
        duration: '2 horas',
        price: 'Grátis (Pantheon € 5)',
        description: 'Os dois pontos mais icônicos do centro histórico, a 10 min a pé um do outro. Melhor visitados cedo pela manhã ou à noite.',
        reviewCount: 63142,
        reviewSnippet: 'Ver a Fontana di Trevi ao amanhecer quase sem turistas é mágico — acorde cedo.',
      },
      {
        name: 'Galeria Borghese',
        type: 'Museu de arte',
        neighborhood: 'Parioli',
        duration: '2 horas',
        price: '€ 20',
        description: 'Uma das coleções de arte mais impressionantes do mundo em visitas limitadas a 2h. Bernini, Caravaggio, Tiziano — reserve com semanas de antecedência.',
        reviewCount: 21347,
        reviewSnippet: 'O Apolo e Dafne de Bernini ao vivo é literalmente de tirar o fôlego.',
      },
      {
        name: 'Campo de\' Fiori e arredores',
        type: 'Praça histórica e mercado',
        neighborhood: 'Centro Histórico',
        duration: '1–2 horas',
        price: 'Grátis',
        description: 'Praça vibrante com mercado pela manhã e vida noturna intensa após o anoitecer. Rodeia de vinoteche, bares e uma das melhores livrarias de Roma.',
        reviewCount: 18923,
        reviewSnippet: 'O mercado de manhã e o aperitivo à tardinha — dois mundos no mesmo lugar.',
      },
      {
        name: 'Buraco da Fechadura dos Cavalieri di Malta',
        type: 'Ponto de vista secreto',
        neighborhood: 'Testaccio',
        duration: '30 minutos',
        price: 'Grátis',
        description: 'Mirante improvável: olhando pelo buraco da fechadura do portão dos Cavaleiros de Malta, você vê o domo de São Pedro enquadrado perfeitamente por ciprestes.',
        reviewCount: 9841,
        reviewSnippet: 'Um buraco de fechadura que emoldura São Pedro — vale cada segundo da fila.',
      },
      {
        name: 'Piazza Navona ao anoitecer',
        type: 'Praça barroca',
        neighborhood: 'Centro Histórico',
        duration: '1 hora',
        price: 'Grátis',
        description: 'A praça barroca mais grandiosa de Roma, com a Fontana dei Quattro Fiumi de Bernini ao centro. Artistas de rua, sorveterias e cafés ao redor.',
        reviewCount: 34781,
        reviewSnippet: 'Sentar em frente à fonte de Bernini com um gelato na mão — isso é Roma.',
      },
      {
        name: 'Catacumbas de San Callisto',
        type: 'Sítio arqueológico',
        neighborhood: 'Testaccio',
        duration: '1–2 horas',
        price: '€ 8',
        description: 'Vinte quilômetros de túneis subterrâneos com 500 mil sepulturas cristãs dos séculos II ao IV. Visita guiada obrigatória — experiência fascinante e arrepiante.',
        reviewCount: 12483,
        reviewSnippet: 'Uma Roma completamente diferente, subterrânea e silenciosa. Imperdível para quem gosta de história.',
      },
      {
        name: 'Mercado de Testaccio',
        type: 'Mercado local',
        neighborhood: 'Testaccio',
        duration: '1–2 horas',
        price: 'Grátis',
        description: 'O mercado de bairro mais autêntico de Roma, funcionando no mesmo local desde os anos 1800. Queijos, embutidos, frutas sazonais e comida para viagem.',
        reviewCount: 8234,
        reviewSnippet: 'Aqui você come como um romano de verdade — sem cardápio em inglês e melhor assim.',
      },
      {
        name: 'Piazza del Popolo e Villa Borghese',
        type: 'Praça e jardim histórico',
        neighborhood: 'Parioli',
        duration: '2–3 horas',
        price: 'Grátis',
        description: 'Praça neoclássica com duas igrejas gêmeas e um obelisco egípcio, seguida de uma caminhada pelo parque Villa Borghese com vista panorâmica da cidade.',
        reviewCount: 16234,
        reviewSnippet: 'A vista do terraço do Pincio sobre Roma ao pôr do sol é a mais bonita da cidade.',
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
        reviewCount: 43218,
        reviewSnippet: 'A experiência de comer sozinho no box é única — o caldo de tonkotsu é viciante.',
      },
      {
        name: 'Sukiyabashi Jiro Honten',
        cuisine: 'Sushi omakase',
        neighborhood: 'Ginza',
        priceRange: '¥¥¥¥¥',
        rating: 5.0,
        mealType: 'dinner',
        description: 'Três estrelas Michelin e inspiração do documentário "Jiro Dreams of Sushi". Menu único servido pelo mestre Jiro — reserva com meses de antecedência.',
        reviewCount: 3421,
        reviewSnippet: 'Uma refeição de 20 minutos que mudou para sempre o que penso sobre sushi.',
      },
      {
        name: 'Gonpachi Nishiazabu',
        cuisine: 'Izakaya tradicional',
        neighborhood: 'Shibuya',
        priceRange: '¥¥¥',
        rating: 4.5,
        mealType: 'dinner',
        description: 'O izakaya que inspirou a cena do restaurante em Kill Bill. Robata, yakitori e saquê em ambiente histórico de dois andares com bambus.',
        reviewCount: 18743,
        reviewSnippet: 'A robata grelhada na frente da sua mesa e o ambiente incrível fazem tudo valer.',
      },
      {
        name: 'Tsukiji Outer Market',
        cuisine: 'Frutos do mar e street food',
        neighborhood: 'Ginza',
        priceRange: '¥¥',
        rating: 4.7,
        mealType: 'lunch',
        description: 'O mercado externo de Tsukiji permanece o melhor lugar de Tóquio para tamagoyaki, uni fresco, ostras e sushi de manhã cedo. Chegue antes das 9h.',
        reviewCount: 61234,
        reviewSnippet: 'O sushi mais fresco que já comi na vida — às 7h da manhã, ainda assim impecável.',
      },
      {
        name: 'Afuri',
        cuisine: 'Ramen de yuzu',
        neighborhood: 'Harajuku',
        priceRange: '¥¥',
        rating: 4.6,
        mealType: 'both',
        description: 'Ramen leve e perfumado com yuzu — diferente do estilo pesado de Sapporo. Caldo de frango com toque cítrico que surpreende pela elegância.',
        reviewCount: 24891,
        reviewSnippet: 'O ramen de yuzu shio é o mais refrescante e delicado que já experimentei.',
      },
      {
        name: 'Uobei Sushi Shibuya',
        cuisine: 'Sushi conveyor belt',
        neighborhood: 'Shibuya',
        priceRange: '¥',
        rating: 4.5,
        mealType: 'both',
        description: 'Sushi por trilho com pedido por tablet e entrega por bala rápida na mesa — experiência ultra-eficiente tipicamente japonesa. Ótima relação preço-qualidade.',
        reviewCount: 38421,
        reviewSnippet: 'Pedir pelo tablet e receber em segundos é a coisa mais japonesa que você vai viver.',
      },
      {
        name: 'Tempura Kondo',
        cuisine: 'Tempura haute cuisine',
        neighborhood: 'Ginza',
        priceRange: '¥¥¥¥',
        rating: 4.8,
        mealType: 'dinner',
        description: 'Uma estrela Michelin em Ginza. O chef Fumio Kondo faz tempura vegetariana elevada ao nível de haute cuisine — aspargos, beterraba e pérola de milho.',
        reviewCount: 4218,
        reviewSnippet: 'A tempura de cenoura do chef Kondo tem mais sabor do que qualquer carne que já comi.',
      },
      {
        name: 'Torikizoku',
        cuisine: 'Yakitori popular',
        neighborhood: 'Shinjuku',
        priceRange: '¥',
        rating: 4.5,
        mealType: 'dinner',
        description: 'Rede de yakitori de preço fixo (¥ 298 por espeto) onde tudo no cardápio custa o mesmo. Informalidade japonesa pura — cerveja gelada, fumaça e companhia.',
        reviewCount: 52341,
        reviewSnippet: 'Pedir dez espetos de tudo e pagar preço popular — a melhor noite de Tóquio.',
      },
      {
        name: 'Kikunoi Akasaka',
        cuisine: 'Kaiseki japonês',
        neighborhood: 'Ginza',
        priceRange: '¥¥¥¥',
        rating: 4.9,
        mealType: 'dinner',
        description: 'Kaiseki tradicional em ambiente de jardim japonês. Cada prato reflete a estação do ano com ingredientes sazonais selecionados. Três estrelas Michelin.',
        reviewCount: 2891,
        reviewSnippet: 'O kaiseki mais poético que já vivi — cada prato é uma pintura comestível.',
      },
      {
        name: 'Nakamura-ya Curry',
        cuisine: 'Curry indo-japonês',
        neighborhood: 'Shinjuku',
        priceRange: '¥¥',
        rating: 4.4,
        mealType: 'lunch',
        description: 'O curry indo-japonês original, desenvolvido na Nakamura-ya desde 1927. Receita mais encorpada e aromática que os currys comuns — com pão naan fresco.',
        reviewCount: 9123,
        reviewSnippet: 'Um curry que resiste ao tempo — e que entende os dois mundos que mistura.',
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
        reviewCount: 87341,
        reviewSnippet: 'O portão Kaminarimon de madrugada, sem ninguém, é uma das fotos mais incríveis do Japão.',
      },
      {
        name: 'teamLab Planets',
        type: 'Arte digital imersiva',
        neighborhood: 'Shibuya',
        duration: '1–2 horas',
        price: '¥ 3.200',
        description: 'Instalações onde você caminha descalço por espelhos infinitos, flores digitais e jardins de luz. Experiência única no mundo.',
        reviewCount: 52341,
        reviewSnippet: 'Entrei descrente e saí completamente transformado — não existe nada igual no planeta.',
      },
      {
        name: 'Tokyo Skytree',
        type: 'Mirante',
        neighborhood: 'Asakusa',
        duration: '1–2 horas',
        price: '¥ 2.100',
        description: 'A torre mais alta do Japão (634 m) com vista de 360° da cidade. Em dia claro dá para ver o Monte Fuji. Melhor ao anoitecer.',
        reviewCount: 64218,
        reviewSnippet: 'Ver Tóquio do alto ao anoitecer com o Fuji no horizonte é de partir o coração de beleza.',
      },
      {
        name: 'Santuário Meiji Jingu',
        type: 'Santuário xintoísta',
        neighborhood: 'Harajuku',
        duration: '1–2 horas',
        price: 'Grátis',
        description: 'Santuário dedicado ao Imperador Meiji, no coração de uma floresta artificial de 100 hectares — surreal estar nesse silêncio a 5 min de Shinjuku.',
        reviewCount: 43218,
        reviewSnippet: 'Entrar na floresta e esquecer que você está numa metrópole de 14 milhões — único.',
      },
      {
        name: 'Shibuya Crossing e Scramble Square',
        type: 'Ícone urbano e mirante',
        neighborhood: 'Shibuya',
        duration: '1–2 horas',
        price: 'Grátis (mirante ¥ 2.000)',
        description: 'O cruzamento mais famoso do mundo, com 3.000 pessoas cruzando a cada sinal verde. O mirante do Scramble Square no 46º andar oferece a vista definitiva.',
        reviewCount: 91234,
        reviewSnippet: 'Ficar no meio do cruzamento e olhar para todos os lados é de cair o queixo.',
      },
      {
        name: 'Harajuku — Takeshita Street e Omotesando',
        type: 'Moda e cultura jovem',
        neighborhood: 'Harajuku',
        duration: '2–3 horas',
        price: 'Grátis',
        description: 'Dois mundos em 10 min de caminhada: a excentricidade máxima da Takeshita Street e a elegância de Omotesando, a "Champs-Élysées japonesa".',
        reviewCount: 38921,
        reviewSnippet: 'Passei de cosplay extremo para boutiques de luxo em 10 minutos — só possível em Tóquio.',
      },
      {
        name: 'Parque de Ueno e museus',
        type: 'Parque e complexo de museus',
        neighborhood: 'Ueno',
        duration: '3–4 horas',
        price: 'Grátis (museus variam)',
        description: 'O maior parque urbano de Tóquio concentra o Museu Nacional, o zoo, o Museu de Arte Ocidental e o planetário. Na primavera, os cerejeiras são inesquecíveis.',
        reviewCount: 56123,
        reviewSnippet: 'Na época das cerejeiras é o lugar mais bonito do Japão — chegue antes do amanhecer.',
      },
      {
        name: 'Shinjuku Gyoen',
        type: 'Jardim nacional',
        neighborhood: 'Shinjuku',
        duration: '2–3 horas',
        price: '¥ 500',
        description: 'O jardim mais bonito de Tóquio, com seções japonesa, francesa e inglesa. Famoso pelas cerejeiras em março-abril, mas impressionante em qualquer estação.',
        reviewCount: 34821,
        reviewSnippet: 'Uma tarde no Gyoen desacelera completamente — é impossível não ficar por horas.',
      },
      {
        name: 'Akihabara — eletrônicos e cultura pop',
        type: 'Bairro temático',
        neighborhood: 'Akihabara',
        duration: '2–3 horas',
        price: 'Grátis',
        description: 'O epicentro mundial de anime, manga e eletrônicos. Lojas de 8 andares de componentes eletrônicos, cafés temáticos e arcades de última geração.',
        reviewCount: 47231,
        reviewSnippet: 'Entrei para comprar uma coisa e saí três horas depois com bolsos cheios e sorrindo.',
      },
      {
        name: 'Ginza — Arte e Arquitetura',
        type: 'Bairro cultural',
        neighborhood: 'Ginza',
        duration: '2–3 horas',
        price: 'Grátis',
        description: 'O bairro mais sofisticado de Tóquio, com galerias de arte, cafés históricos e a arquitetura da Ginza Six. Aos domingos, a rua principal fecha para pedestres.',
        reviewCount: 28341,
        reviewSnippet: 'Caminhar por Ginza no domingo sem carros é uma das experiências mais agradáveis de Tóquio.',
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

  // Duration (default 3, cap at 14)
  let duration = 3
  const daysMatch = text.match(/(\d+)\s*dias?/i)
  if (daysMatch) {
    const parsed = parseInt(daysMatch[1], 10)
    if (!isNaN(parsed)) duration = Math.min(Math.max(parsed, 1), 14)
  }

  // Multiple objectives — all that apply, in priority order
  const objectives: string[] = []
  if (/trabalho|negócio|reunião|conferência|congresso|business/.test(t)) objectives.push('Negócios')
  if (/descanso|relaxar|tranquil|spa|paz|sossego/.test(t)) objectives.push('Descanso')
  if (/turismo|pontos? turísticos?|sightseeing|conhecer|visitar|museu|galeria|templo|monumento|atração/.test(t)) objectives.push('Turismo')
  if (/gastronomia|restaurante|culinária|comida|food|comer/.test(t)) objectives.push('Gastronomia')
  if (/festa|balada|noite|bares|vida noturna|pub|club/.test(t)) objectives.push('Vida noturna')
  if (/família|criança|kids|filho|filha|bebê/.test(t)) objectives.push('Família')
  if (objectives.length === 0) objectives.push('Turismo')

  // Preferences
  let budget: number | undefined
  const budgetMatch = text.match(/(?:R\$|€)\s*(\d+(?:[.,]\d+)?)|(\d+(?:[.,]\d+)?)\s*reais?/i)
  if (budgetMatch) {
    const raw = (budgetMatch[1] ?? budgetMatch[2]).replace(',', '.')
    const parsed = parseFloat(raw)
    if (!isNaN(parsed)) budget = parsed
  }

  let quality: 'low' | 'medium' | 'high' | undefined
  if (/comer bem|alta gastronomia|fine dining|michelin|luxo|melhor restaurante|bom restaurante|qualidade alta/.test(t)) {
    quality = 'high'
  } else if (/barato|econômico|baixo custo|sem gastar muito|acessível/.test(t)) {
    quality = 'low'
  }

  const preferences: TripSummary['preferences'] = {}
  if (budget !== undefined) preferences.budget = budget
  if (quality !== undefined) preferences.quality = quality

  // Interests (broader tags, including POIs)
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

  return { destination, duration, objectives, preferences, interests }
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
