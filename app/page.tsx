'use client'

import { useState } from 'react'
import { type Recommendation, getRecommendations } from './lib/recommendations'

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
    setResults(getRecommendations(query))
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
