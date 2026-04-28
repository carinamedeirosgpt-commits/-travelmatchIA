'use client'

import { useState } from 'react'
import {
  type Recommendation,
  type Restaurant,
  type Attraction,
  type TripSummary,
  getRecommendations,
  getRestaurants,
  getAttractions,
  parseTripSummary,
} from './lib/recommendations'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-amber-400 font-semibold text-sm">
      {'★'.repeat(Math.floor(rating))}
      <span className="text-slate-600">{rating.toFixed(1)}</span>
    </span>
  )
}

function StepHeader({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">Etapa {number}</p>
      <h2 className="text-xl font-semibold text-slate-700">{title}</h2>
      <p className="text-slate-400 text-sm">{subtitle}</p>
    </div>
  )
}

function NextStepButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border-2 border-blue-500 text-blue-600 py-3 font-semibold text-base hover:bg-blue-50 transition-colors"
    >
      {label} &rarr;
    </button>
  )
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [step, setStep] = useState(0)
  const [summary, setSummary] = useState<TripSummary | null>(null)
  const [hotels, setHotels] = useState<Recommendation[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [attractions, setAttractions] = useState<Attraction[]>([])

  function handleSearch() {
    if (!query.trim()) return
    setSummary(parseTripSummary(query))
    setHotels(getRecommendations(query))
    setRestaurants(getRestaurants(query))
    setAttractions(getAttractions(query))
    setStep(1)
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Travel<span className="text-blue-600">Match</span> AI
        </h1>
        <p className="text-slate-500 text-lg">Descreva sua viagem e monte seu plano completo</p>
      </div>

      {/* Search */}
      <div className="w-full max-w-2xl">
        <textarea
          className="w-full rounded-xl border border-slate-200 bg-white p-4 text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
          rows={4}
          placeholder="Ex: Vou para Roma e quero conhecer o Coliseu, Vaticano e Trastevere..."
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
          Planejar viagem
        </button>
      </div>

      {/* ── Resumo ─────────────────────────────────────────────────────── */}
      {step >= 1 && summary && (
        <div className="w-full max-w-2xl mt-10">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">O que entendemos</p>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-600 font-medium mb-0.5">Destino</p>
              <p className="text-slate-700">{summary.destination}</p>
            </div>
            <div>
              <p className="text-blue-600 font-medium mb-0.5">Objetivo</p>
              <p className="text-slate-700">{summary.objective}</p>
            </div>
            {summary.budget && (
              <div>
                <p className="text-blue-600 font-medium mb-0.5">Orçamento</p>
                <p className="text-slate-700">{summary.budget}</p>
              </div>
            )}
            {summary.interests.length > 0 && (
              <div className={summary.budget ? '' : 'col-span-2'}>
                <p className="text-blue-600 font-medium mb-0.5">Interesses</p>
                <p className="text-slate-700">{summary.interests.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="w-full max-w-2xl mt-4">
          <NextStepButton label="Ver hospedagens recomendadas" onClick={() => setStep(2)} />
        </div>
      )}

      {/* ── Etapa 1: Hospedagens ────────────────────────────────────────── */}
      {step >= 2 && (
        <div className="w-full max-w-2xl mt-10">
          <StepHeader
            number={1}
            title="Hospedagens recomendadas"
            subtitle="Selecionadas com base no destino e nos seus interesses"
          />
          <div className="flex flex-col gap-5">
            {hotels.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhuma hospedagem encontrada para este destino ainda.</p>
            ) : hotels.map((rec, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3">
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

      {step === 2 && (
        <div className="w-full max-w-2xl mt-6">
          <NextStepButton label="Ver restaurantes sugeridos" onClick={() => setStep(3)} />
        </div>
      )}

      {/* ── Etapa 2: Restaurantes ───────────────────────────────────────── */}
      {step >= 3 && (
        <div className="w-full max-w-2xl mt-10">
          <StepHeader
            number={2}
            title="Restaurantes sugeridos"
            subtitle="Para explorar a gastronomia local durante a viagem"
          />
          <div className="flex flex-col gap-5">
            {restaurants.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhum restaurante encontrado para este destino ainda.</p>
            ) : restaurants.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{r.name}</h3>
                    <p className="text-slate-500 text-sm">{r.cuisine} · {r.neighborhood}</p>
                  </div>
                  <span className="shrink-0 text-emerald-700 font-bold text-base bg-emerald-50 rounded-lg px-3 py-1">
                    {r.priceRange}
                  </span>
                </div>
                <Stars rating={r.rating} />
                <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="w-full max-w-2xl mt-6">
          <NextStepButton label="Ver atrações e atividades" onClick={() => setStep(4)} />
        </div>
      )}

      {/* ── Etapa 3: Atrações ──────────────────────────────────────────── */}
      {step >= 4 && (
        <div className="w-full max-w-2xl mt-10">
          <StepHeader
            number={3}
            title="Pontos turísticos e atividades"
            subtitle="O que fazer e visitar durante a viagem"
          />
          <div className="flex flex-col gap-5">
            {attractions.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhuma atração encontrada para este destino ainda.</p>
            ) : attractions.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{a.name}</h3>
                    <p className="text-slate-500 text-sm">{a.type} · {a.neighborhood}</p>
                  </div>
                  <span className="shrink-0 text-violet-700 font-bold text-sm bg-violet-50 rounded-lg px-3 py-1">
                    {a.duration}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Entrada: {a.price}</p>
                <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="w-full max-w-2xl mt-6">
          <NextStepButton label="Ver roteiro da viagem" onClick={() => setStep(5)} />
        </div>
      )}

      {/* ── Roteiro (placeholder) ──────────────────────────────────────── */}
      {step >= 5 && (
        <div className="w-full max-w-2xl mt-10 mb-4">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Em breve</p>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">Roteiro da viagem</h2>
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xl font-bold">
              ?
            </div>
            <p className="text-slate-700 font-semibold">Roteiro personalizado dia a dia</p>
            <p className="text-slate-400 text-sm max-w-sm">
              Em uma próxima versão vamos montar seu roteiro completo com base nas hospedagens, restaurantes e atrações selecionados acima.
            </p>
          </div>
        </div>
      )}

    </main>
  )
}
