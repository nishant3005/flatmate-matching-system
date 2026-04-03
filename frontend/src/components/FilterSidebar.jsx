import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'

export default function FilterSidebar({ matches, onFilter }) {
  const [minScore, setMinScore] = useState(0)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const filtered = matches.filter(m => m.score >= minScore)
    onFilter(filtered)
  }, [minScore, matches])

  return (
    <>
      {/* Mobile toggle */}
      <button id="filter-toggle" onClick={() => setOpen(o => !o)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30">
        <SlidersHorizontal size={20} className="text-white" />
      </button>

      {/* Sidebar */}
      <aside className={`lg:block ${open ? 'block' : 'hidden'} w-full lg:w-64 flex-shrink-0`}>
        <div className="glass p-5 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-primary-400" /> Filters
            </h3>
            <button onClick={() => setOpen(false)} className="lg:hidden text-white/40 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div>
            <label className="label">
              Min Score: <span className="text-primary-400 font-bold">{minScore}%</span>
            </label>
            <input id="filter-min-score" type="range" min={0} max={100} step={5} value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              className="w-full accent-primary-500 mt-2" />
            <div className="flex justify-between text-xs text-white/30 mt-1">
              <span>0%</span><span>100%</span>
            </div>
          </div>

          {minScore > 0 && (
            <button id="filter-reset" onClick={() => setMinScore(0)}
              className="mt-4 text-xs text-primary-400 hover:text-primary-300 transition-colors">
              Reset filters
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
