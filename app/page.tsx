'use client'

import { useState } from 'react'

type Recommendation = {
  name: string
  location: string
  price: string
  rating: number
  reason: string
}

const POOLS: Record<string, Recommendation[]> = {
  praia: [
    {
      name: 'Pousada Brisa do Mar',
      location: 'Arraial do Cabo, RJ',
      price: 'R$ 320 / noite',
      rating: 4.8,
      reason: 'Fica a 50 m da praia e tem deck com vista para o mar — perfeito para quem quer relaxar à beira-mar.',
    },
    {
      name: 'Resort Coral Azul',
      location: 'Porto de Galinhas, PE',
      price: 'R$ 580 / noite',
      rating: 4.9,
      reason: 'Acesso privativo às piscinas naturais e passeios de jangada inclusos — ideal para sua viagem de praia.',
    },
    {
      name: 'Vila Coqueiro',
      location: 'Trancoso, BA',
      price: 'R$ 450 / noite',
      rating: 4.7,
      reason: 'Bangalôs entre coqueiros a 200 m do mar, com café da manhã regional e clima descontraído.',
    },
  ],
  montanha: [
    {
      name: 'Chalé da Serra',
      location: 'Campos do Jordão, SP',
      price: 'R$ 380 / noite',
      rating: 4.8,
      reason: 'Chalé aquecido com lareira e trilhas saindo diretamente da propriedade — feito para quem ama montanha.',
    },
    {
      name: 'Pousada Pedra Alta',
      location: 'Gonçalves, MG',
      price: 'R$ 290 / noite',
      rating: 4.6,
      reason: 'Vista panorâmica para a Serra da Mantiqueira e café da manhã colonial com produtos locais.',
    },
    {
      name: 'Eco Refúgio Araucária',
      location: 'Urubici, SC',
      price: 'R$ 340 / noite',
      rating: 4.7,
      reason: 'Cercado por araucárias centenárias, com banheira de imersão e guia de trilhas incluído.',
    },
  ],
  cidade: [
    {
      name: 'Hotel Central Prime',
      location: 'São Paulo, SP',
      price: 'R$ 420 / noite',
      rating: 4.5,
      reason: 'A 5 min a pé dos principais museus e restaurantes — ótima base para explorar a cidade.',
    },
    {
      name: 'Boutique Histórica Santa Teresa',
      location: 'Rio de Janeiro, RJ',
      price: 'R$ 510 / noite',
      rating: 4.8,
      reason: 'Hotel em casarão do século XIX no bairro mais charmoso do Rio, com vista para a Baía de Guanabara.',
    },
    {
      name: 'Apart Hotel Liberdade',
      location: 'Curitiba, PR',
      price: 'R$ 260 / noite',
      rating: 4.4,
      reason: 'Apartamento compacto e bem localizado, a poucos metros de bares, feiras e museus.',
    },
  ],
  romantica: [
    {
      name: 'Suite do Vale',
      location: 'Gramado, RS',
      price: 'R$ 650 / noite',
      rating: 4.9,
      reason: 'Suite com jacuzzi privativa, café da manhã na cama e jantar à luz de velas inclusos.',
    },
    {
      name: 'Pousada Jardim Secreto',
      location: 'Tiradentes, MG',
      price: 'R$ 490 / noite',
      rating: 4.8,
      reason: 'Jardins privativos, decoração aconchegante e localização no centro histórico para passeios a dois.',
    },
    {
      name: 'Villa Dolce Vista',
      location: 'Bento Gonçalves, RS',
      price: 'R$ 560 / noite',
      rating: 4.7,
      reason: 'Vista para os vinhedos, degustação de vinhos e suíte com banheira — perfeito para um escapamento romântico.',
    },
  ],
  aventura: [
    {
      name: 'Base Camp Chapada',
      location: 'Chapada dos Veadeiros, GO',
      price: 'R$ 210 / noite',
      rating: 4.6,
      reason: 'Ponto de partida para as trilhas mais incríveis do Brasil, com pacotes de rapel e cachoeiras.',
    },
    {
      name: 'Pousada Trilha Viva',
      location: 'Bonito, MS',
      price: 'R$ 350 / noite',
      rating: 4.7,
      reason: 'Pacote inclui flutuação no Rio da Prata, mergulho e passeio no Abismo Anhumas.',
    },
    {
      name: 'Eco Lodge Pantanal',
      location: 'Corumbá, MS',
      price: 'R$ 480 / noite',
      rating: 4.8,
      reason: 'Safari fotográfico, observação de onças e capivaras — a aventura mais selvagem do Brasil.',
    },
  ],
  default: [
    {
      name: 'Hotel Vista Serena',
      location: 'Florianópolis, SC',
      price: 'R$ 390 / noite',
      rating: 4.6,
      reason: 'Boa relação custo-benefício com estrutura completa, piscina e ótima localização central.',
    },
    {
      name: 'Pousada Caminho Real',
      location: 'Ouro Preto, MG',
      price: 'R$ 310 / noite',
      rating: 4.5,
      reason: 'Localização privilegiada no centro histórico, café da manhã variado e equipe muito simpática.',
    },
    {
      name: 'Apart Conforto Boa Viagem',
      location: 'Recife, PE',
      price: 'R$ 280 / noite',
      rating: 4.4,
      reason: 'A poucos metros da praia de Boa Viagem com ótimas avaliações de limpeza e atendimento.',
    },
  ],
}

function detectCategory(text: string): keyof typeof POOLS {
  const t = text.toLowerCase()
  if (/praia|mar|oceano|litoral|surf|mergulho|areia/.test(t)) return 'praia'
  if (/montanha|serra|trilha|natureza|cachoeira|mata|floresta/.test(t)) return 'montanha'
  if (/cidade|urbano|museu|cultura|históric|teatro|gastronomia|restaurante/.test(t)) return 'cidade'
  if (/romântic|casal|lua de mel|aniversário|namoro|dois/.test(t)) return 'romantica'
  if (/aventura|radical|rapel|escalada|safari|selva|ecoturismo/.test(t)) return 'aventura'
  return 'default'
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-amber-400 font-semibold text-sm">
      {'★'.repeat(Math.floor(rating))}
      <span className="text-slate-600">{rating.toFixed(1)}</span>
    </span>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Recommendation[]>([])
  const [searched, setSearched] = useState(false)

  function handleSearch() {
    if (!query.trim()) return
    const category = detectCategory(query)
    setResults(POOLS[category])
    setSearched(true)
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Travel<span className="text-blue-600">Match</span> AI
        </h1>
        <p className="text-slate-500 text-lg">Descreva sua viagem e encontre a hospedagem ideal</p>
      </div>

      {/* Search */}
      <div className="w-full max-w-2xl">
        <textarea
          className="w-full rounded-xl border border-slate-200 bg-white p-4 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
          rows={4}
          placeholder="Ex: Quero passar 5 dias na praia com minha família, gosto de snorkeling e de lugares tranquilos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSearch()
          }}
        />
        <button
          onClick={handleSearch}
          disabled={!query.trim()}
          className="mt-3 w-full rounded-xl bg-blue-600 py-3 text-white font-semibold text-base hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Encontrar hospedagens
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div className="w-full max-w-2xl mt-12">
          <h2 className="text-xl font-semibold text-slate-700 mb-6">
            3 recomendações para você
          </h2>
          <div className="flex flex-col gap-5">
            {results.map((rec, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{rec.name}</h3>
                    <p className="text-slate-500 text-sm">{rec.location}</p>
                  </div>
                  <span className="shrink-0 text-blue-700 font-bold text-base bg-blue-50 rounded-lg px-3 py-1">
                    {rec.price}
                  </span>
                </div>
                <Stars rating={rec.rating} />
                <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                  {rec.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
