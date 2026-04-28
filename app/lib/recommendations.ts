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
