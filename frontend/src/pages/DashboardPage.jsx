import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Zap, RefreshCw, Settings, Users, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import MatchCard from '../components/MatchCard'
import FilterSidebar from '../components/FilterSidebar'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const [matches,         setMatches]         = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])
  const [loading,         setLoading]         = useState(true)
  const [computing,       setComputing]       = useState(false)
  const [error,           setError]           = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchMatches = useCallback(async () => {
    try {
      const { data } = await api.get('/matches')
      setMatches(data)
      setFilteredMatches(data)
    } catch {
      setError('Failed to load matches.')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchMatches() }, [fetchMatches])

  const compute = async () => {
    setComputing(true); setError('')
    try {
      const { data } = await api.post('/matches/compute')
      setMatches(data)
      setFilteredMatches(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Matching failed. Make sure preferences are saved.')
    } finally { setComputing(false) }
  }

  const top = filteredMatches[0]

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Matches</h1>
            <p className="text-white/50 mt-1">
              {filteredMatches.length} compatible flatmate{filteredMatches.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="flex gap-3">
            <button id="btn-edit-prefs" onClick={() => navigate('/onboarding')}
              className="btn-ghost flex items-center gap-2 text-sm">
              <Settings size={15} /> Edit Preferences
            </button>
            <button id="btn-compute" onClick={compute} disabled={computing}
              className="btn-primary flex items-center gap-2 text-sm">
              {computing
                ? <><RefreshCw size={15} className="animate-spin" />Computing…</>
                : <><Zap size={15} />Find Matches</>}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {/* Stats */}
        {matches.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: Users,  label: 'Total Matches',  value: matches.length },
              { icon: Trophy, label: 'Best Score',      value: `${Math.round(matches[0]?.score || 0)}%` },
              { icon: Zap,    label: 'Avg Score',       value: `${Math.round(matches.reduce((a,m)=>a+m.score,0)/matches.length)}%` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass p-4 text-center">
                <Icon size={18} className="text-primary-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="text-white/40 text-xs">{label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-6">
          <FilterSidebar matches={matches} onFilter={setFilteredMatches} />

          {/* Match list */}
          <div className="flex-1 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass h-32 animate-pulse" />
              ))
            ) : filteredMatches.length === 0 ? (
              <div className="glass p-16 text-center">
                <Users size={40} className="text-white/20 mx-auto mb-4" />
                <h3 className="text-white/60 font-medium mb-2">No matches yet</h3>
                <p className="text-white/30 text-sm mb-6">
                  {matches.length === 0
                    ? 'Click "Find Matches" to compute your compatibility scores.'
                    : 'Try lowering the minimum score filter.'}
                </p>
                {matches.length === 0 && (
                  <button id="btn-compute-empty" onClick={compute} disabled={computing} className="btn-primary">
                    {computing ? 'Computing…' : 'Find Matches'}
                  </button>
                )}
              </div>
            ) : (
              filteredMatches.map((m, i) => <MatchCard key={m.matchId} match={m} index={i} />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
