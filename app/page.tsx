'use client'

import { useState } from 'react'
import {
  type Recommendation,
  type Restaurant,
  type Attraction,
  type TripSummary,
  type ItineraryDay,
  getRecommendations,
  getRestaurants,
  getAttractions,
  parseTripSummary,
  generateItinerary,
} from './lib/recommendations'

function SwipeCard({
  restaurant: r,
  cursor,
  poolSize,
  onAccept,
  onRefuse,
}: {
  restaurant: Restaurant
  cursor: number
  poolSize: number
  onAccept: () => void
  onRefuse: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{cursor + 1} de {poolSize}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div
          className="bg-emerald-400 h-1.5 rounded-full transition-all"
          style={{ width: `${(cursor / poolSize) * 100}%` }}
        />
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {r.imageUrl && (
          <img
            src={r.imageUrl}
            alt={r.name}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-6 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{r.name}</h3>
              <p className="text-slate-500 text-sm">{r.cuisine} · {r.neighborhood}</p>
            </div>
            <span className="shrink-0 text-emerald-700 font-bold text-base bg-emerald-50 rounded-lg px-3 py-1">
              {r.priceRange}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Stars rating={r.rating} />
            <span className="text-xs text-slate-400">{r.reviewCount.toLocaleString('pt-BR')} avaliações</span>
          </div>
          {r.reviewSnippet && (
            <p className="text-xs text-slate-500 italic border-l-2 border-emerald-200 pl-3">
              &ldquo;{r.reviewSnippet}&rdquo;
            </p>
          )}
          <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
            {r.description}
          </p>
          <div className="flex gap-3 mt-1">
            <button
              onClick={onRefuse}
              className="flex-1 rounded-xl py-3 text-sm font-semibold border-2 border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            >
              ✕ Recusar
            </button>
            <button
              onClick={onAccept}
              className="flex-1 rounded-xl py-3 text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              ✓ Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

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

const VISIBLE = 3

export default function Home() {
  const [query, setQuery] = useState('')
  const [step, setStep] = useState(0)
  const [summary, setSummary] = useState<TripSummary | null>(null)

  // full pools
  const [hotelPool, setHotelPool] = useState<Recommendation[]>([])
  const [restaurantPool, setRestaurantPool] = useState<Restaurant[]>([])
  const [attractionPool, setAttractionPool] = useState<Attraction[]>([])
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([])

  // visible slots (null = dismissed with no replacement available)
  const [shownHotels, setShownHotels] = useState<(Recommendation | null)[]>([])
  const [hotelCursor, setHotelCursor] = useState(0)
  const [lunchCursor, setLunchCursor] = useState(0)
  const [dinnerCursor, setDinnerCursor] = useState(0)
  const [shownAttractions, setShownAttractions] = useState<(Attraction | null)[]>([])
  const [attractionCursor, setAttractionCursor] = useState(0)

  // selections
  const [selectedHotel, setSelectedHotel] = useState<Recommendation | null>(null)
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([])
  const [selectedAttractions, setSelectedAttractions] = useState<Attraction[]>([])

  function handleSearch() {
    if (!query.trim()) return
    const h = getRecommendations(query)
    const r = getRestaurants(query)
    const a = getAttractions(query)
    const s = parseTripSummary(query)

    setSummary(s)
    setHotelPool(h)
    setRestaurantPool(r)
    setAttractionPool(a)
    setItinerary(generateItinerary(h.slice(0, 3), r, a, s.duration))

    setShownHotels(h.slice(0, VISIBLE))
    setHotelCursor(VISIBLE)
    setLunchCursor(0)
    setDinnerCursor(0)
    setShownAttractions(a.slice(0, VISIBLE))
    setAttractionCursor(VISIBLE)

    setSelectedHotel(null)
    setSelectedRestaurants([])
    setSelectedAttractions([])
    setStep(1)
  }

  function dismissHotel(slotIdx: number) {
    setShownHotels(prev => {
      const next = [...prev]
      if (hotelCursor < hotelPool.length) {
        next[slotIdx] = hotelPool[hotelCursor]
        setHotelCursor(c => c + 1)
      } else {
        next[slotIdx] = null
      }
      return next
    })
  }

  const lunchPool = restaurantPool.filter(r => r.mealType === 'lunch' || r.mealType === 'both')
  const dinnerPool = restaurantPool.filter(r => r.mealType === 'dinner' || r.mealType === 'both')
  const currentLunch = lunchPool[lunchCursor] ?? null
  const currentDinner = dinnerPool[dinnerCursor] ?? null
  const lunchDone = lunchPool.length > 0 && lunchCursor >= lunchPool.length
  const dinnerDone = dinnerPool.length > 0 && dinnerCursor >= dinnerPool.length

  function acceptLunch(r: Restaurant) {
    setSelectedRestaurants(prev => [...prev, r])
    setLunchCursor(c => c + 1)
  }
  function refuseLunch() { setLunchCursor(c => c + 1) }
  function acceptDinner(r: Restaurant) {
    setSelectedRestaurants(prev => [...prev, r])
    setDinnerCursor(c => c + 1)
  }
  function refuseDinner() { setDinnerCursor(c => c + 1) }

  function dismissAttraction(slotIdx: number) {
    setShownAttractions(prev => {
      const next = [...prev]
      if (attractionCursor < attractionPool.length) {
        next[slotIdx] = attractionPool[attractionCursor]
        setAttractionCursor(c => c + 1)
      } else {
        next[slotIdx] = null
      }
      return next
    })
  }

  function selectHotel(rec: Recommendation) {
    setSelectedHotel(prev => prev?.name === rec.name ? null : rec)
  }

  function toggleAttraction(a: Attraction) {
    setSelectedAttractions(prev =>
      prev.some(x => x.name === a.name)
        ? prev.filter(x => x.name !== a.name)
        : [...prev, a]
    )
  }

  const allHotelsDismissed = shownHotels.length > 0 && shownHotels.every(h => h === null)
  const allAttractionsDismissed = shownAttractions.length > 0 && shownAttractions.every(a => a === null)

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
              <p className="text-blue-600 font-medium mb-0.5">Duração</p>
              <p className="text-slate-700">{summary.duration} {summary.duration === 1 ? 'dia' : 'dias'}</p>
            </div>
            <div>
              <p className="text-blue-600 font-medium mb-0.5">Objetivo</p>
              <p className="text-slate-700">{summary.objectives.join(', ')}</p>
            </div>
            {summary.preferences.budget !== undefined && (
              <div>
                <p className="text-blue-600 font-medium mb-0.5">Orçamento</p>
                <p className="text-slate-700">R$ {summary.preferences.budget} / dia</p>
              </div>
            )}
            {summary.interests.length > 0 && (
              <div className="col-span-2">
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
            {allHotelsDismissed ? (
              <p className="text-slate-500 text-sm">Não temos mais opções para essa categoria no momento.</p>
            ) : hotelPool.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhuma hospedagem encontrada para este destino ainda.</p>
            ) : shownHotels.map((rec, i) => {
              if (rec === null) return null
              return (
                <div key={rec.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{rec.name}</h3>
                      <p className="text-slate-500 text-sm">{rec.location}</p>
                    </div>
                    <span className="shrink-0 text-blue-700 font-bold text-base bg-blue-50 rounded-lg px-3 py-1">
                      {rec.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Stars rating={rec.rating} />
                    <span className="text-xs text-slate-400">{rec.reviewCount.toLocaleString('pt-BR')} avaliações</span>
                  </div>
                  {rec.reviewSnippet && (
                    <p className="text-xs text-slate-500 italic border-l-2 border-blue-200 pl-3">
                      &ldquo;{rec.reviewSnippet}&rdquo;
                    </p>
                  )}
                  <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                    {rec.reason}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => selectHotel(rec)}
                      className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                        selectedHotel?.name === rec.name
                          ? 'bg-blue-600 text-white'
                          : 'border border-blue-500 text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {selectedHotel?.name === rec.name ? 'Hotel selecionado' : 'Selecionar hotel'}
                    </button>
                    <button
                      onClick={() => dismissHotel(i)}
                      className="rounded-lg py-2 px-3 text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors whitespace-nowrap"
                    >
                      Ver outra opção
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-2xl mt-6">
          <NextStepButton label="Ver restaurantes sugeridos" onClick={() => setStep(3)} />
        </div>
      )}

      {/* ── Etapa 2: Restaurantes (almoço + jantar) ─────────────────────── */}
      {step >= 3 && (
        <div className="w-full max-w-2xl mt-10">
          <StepHeader
            number={2}
            title="Restaurantes sugeridos"
            subtitle="Aceite ou recuse sugestões de almoço e jantar"
          />
          {restaurantPool.length === 0 ? (
            <p className="text-slate-500 text-sm">Nenhum restaurante encontrado para este destino ainda.</p>
          ) : (
            <div className="flex flex-col gap-8">

              {/* ── Almoço ── */}
              <div>
                <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-4">Almoço</p>
                {lunchDone ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                    <p className="font-semibold text-slate-600 text-sm">Sugestões de almoço revisadas</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedRestaurants.filter(r => r.mealType === 'lunch' || r.mealType === 'both').length} aceito(s)
                    </p>
                  </div>
                ) : lunchPool.length === 0 ? (
                  <p className="text-slate-400 text-sm">Nenhuma sugestão de almoço disponível.</p>
                ) : currentLunch && (
                  <SwipeCard
                    restaurant={currentLunch}
                    cursor={lunchCursor}
                    poolSize={lunchPool.length}
                    onAccept={() => acceptLunch(currentLunch)}
                    onRefuse={refuseLunch}
                  />
                )}
              </div>

              {/* ── Jantar ── */}
              <div>
                <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-4">Jantar</p>
                {dinnerDone ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                    <p className="font-semibold text-slate-600 text-sm">Sugestões de jantar revisadas</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedRestaurants.filter(r => r.mealType === 'dinner' || r.mealType === 'both').length} aceito(s)
                    </p>
                  </div>
                ) : dinnerPool.length === 0 ? (
                  <p className="text-slate-400 text-sm">Nenhuma sugestão de jantar disponível.</p>
                ) : currentDinner && (
                  <SwipeCard
                    restaurant={currentDinner}
                    cursor={dinnerCursor}
                    poolSize={dinnerPool.length}
                    onAccept={() => acceptDinner(currentDinner)}
                    onRefuse={refuseDinner}
                  />
                )}
              </div>

            </div>
          )}
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
            {allAttractionsDismissed ? (
              <p className="text-slate-500 text-sm">Não temos mais opções para essa categoria no momento.</p>
            ) : attractionPool.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhuma atração encontrada para este destino ainda.</p>
            ) : shownAttractions.map((a, i) => {
              if (a === null) return null
              return (
                <div key={a.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{a.name}</h3>
                      <p className="text-slate-500 text-sm">{a.type} · {a.neighborhood}</p>
                    </div>
                    <span className="shrink-0 text-violet-700 font-bold text-sm bg-violet-50 rounded-lg px-3 py-1">
                      {a.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{a.reviewCount.toLocaleString('pt-BR')} avaliações</span>
                  </div>
                  <p className="text-xs text-slate-400">Entrada: {a.price}</p>
                  {a.reviewSnippet && (
                    <p className="text-xs text-slate-500 italic border-l-2 border-violet-200 pl-3">
                      &ldquo;{a.reviewSnippet}&rdquo;
                    </p>
                  )}
                  <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                    {a.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAttraction(a)}
                      className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                        selectedAttractions.some(x => x.name === a.name)
                          ? 'bg-violet-600 text-white'
                          : 'border border-violet-500 text-violet-600 hover:bg-violet-50'
                      }`}
                    >
                      {selectedAttractions.some(x => x.name === a.name) ? 'Adicionado' : 'Adicionar'}
                    </button>
                    <button
                      onClick={() => dismissAttraction(i)}
                      className="rounded-lg py-2 px-3 text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors whitespace-nowrap"
                    >
                      Ver outra opção
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="w-full max-w-2xl mt-6">
          <NextStepButton label="Ver roteiro da viagem" onClick={() => setStep(5)} />
        </div>
      )}

      {/* ── Roteiro ────────────────────────────────────────────────────── */}
      {step >= 5 && (
        <div className="w-full max-w-2xl mt-10 mb-4">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Roteiro</p>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">Roteiro da viagem</h2>
          {itinerary.length === 0 ? (
            <p className="text-slate-500 text-sm">Roteiro não disponível para este destino ainda.</p>
          ) : (
            <div className="flex flex-col gap-5">
              {itinerary.map((day) => (
                <div key={day.day} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dia {day.day}</p>
                    <p className="text-base font-bold text-slate-800">{day.label}</p>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {day.slots.map((slot) => (
                      <div key={slot.period} className="px-6 py-4 flex gap-4">
                        <div className="shrink-0 w-14 pt-0.5">
                          <span className={`text-xs font-bold uppercase ${
                            slot.period === 'Manhã'  ? 'text-amber-500'   :
                            slot.period === 'Almoço' ? 'text-emerald-500' :
                            slot.period === 'Tarde'  ? 'text-violet-500'  :
                                                       'text-blue-500'
                          }`}>
                            {slot.period}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-sm">{slot.title}</p>
                          <p className="text-xs text-slate-400 mb-1">{slot.subtitle}</p>
                          <p className="text-xs text-slate-500 leading-relaxed">{slot.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Minha viagem ───────────────────────────────────────────────── */}
      {(selectedHotel || selectedRestaurants.length > 0 || selectedAttractions.length > 0) && (
        <div className="w-full max-w-2xl mt-10 mb-4">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3">Selecionados</p>
          <h2 className="text-xl font-semibold text-slate-700 mb-6">Minha viagem</h2>

          {selectedHotel && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">Hotel</p>
              <div className="bg-white rounded-xl border border-blue-100 p-4">
                <p className="font-semibold text-slate-800">{selectedHotel.name}</p>
                <p className="text-sm text-slate-500">{selectedHotel.location} · {selectedHotel.price}</p>
              </div>
            </div>
          )}

          {selectedRestaurants.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-2">
                Restaurantes ({selectedRestaurants.length})
              </p>
              <div className="flex flex-col gap-2">
                {selectedRestaurants.map((r, i) => (
                  <div key={i} className="bg-white rounded-xl border border-emerald-100 p-4">
                    <p className="font-semibold text-slate-800">{r.name}</p>
                    <p className="text-sm text-slate-500">{r.cuisine} · {r.neighborhood}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedAttractions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-2">
                Atrações ({selectedAttractions.length})
              </p>
              <div className="flex flex-col gap-2">
                {selectedAttractions.map((a, i) => (
                  <div key={i} className="bg-white rounded-xl border border-violet-100 p-4">
                    <p className="font-semibold text-slate-800">{a.name}</p>
                    <p className="text-sm text-slate-500">{a.type} · {a.neighborhood}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </main>
  )
}
