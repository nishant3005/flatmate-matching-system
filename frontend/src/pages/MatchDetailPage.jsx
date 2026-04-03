import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, XCircle, User, MapPin } from 'lucide-react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import ScoreIndicator from '../components/ScoreIndicator'
import { useAuth } from '../context/AuthContext'

const FieldRow = ({ label, mine, theirs, match }) => (
  <div className={`flex items-center justify-between py-3 border-b border-white/5 last:border-0
    ${match ? '' : 'bg-red-500/5 -mx-4 px-4 rounded-lg'}`}>
    <div className="text-white/40 text-xs w-28 flex-shrink-0">{label}</div>
    <div className="flex items-center gap-3 flex-1 justify-end">
      <span className="text-white/70 text-sm text-right flex-1">{mine ?? '—'}</span>
      <div className="w-5 flex justify-center flex-shrink-0">
        {match
          ? <CheckCircle size={14} className="text-emerald-400" />
          : <XCircle size={14} className="text-red-400" />}
      </div>
      <span className="text-white/70 text-sm text-right flex-1">{theirs ?? '—'}</span>
    </div>
  </div>
)

const fmt = v => v ? String(v).replace(/_/g,' ').toLowerCase().replace(/^\w/, c => c.toUpperCase()) : '—'

export default function MatchDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [match,   setMatch]   = useState(null)
  const [myPref,  setMyPref]  = useState(null)
  const [theirPref, setTheirPref] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [matchesRes, myPrefRes] = await Promise.all([
          api.get('/matches'),
          api.get('/preferences/me'),
        ])
        const found = matchesRes.data.find(m => String(m.matchId) === String(id))
        if (!found) { navigate('/dashboard'); return }
        setMatch(found)
        setMyPref(myPrefRes.data)
        const { data: tp } = await api.get(`/preferences/${found.matchedUserId}`)
        setTheirPref(tp)
      } catch { navigate('/dashboard') }
      finally { setLoading(false) }
    }
    load()
  }, [id, navigate])

  if (loading) return (
    <div className="min-h-screen bg-page flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!match) return null

  const initials = match.matchedUserName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || '?'

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">

        {/* Back */}
        <button id="btn-back" onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-xl shadow-primary-500/20">
              {initials}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white">{match.matchedUserName}</h1>
              <p className="text-white/50 text-sm">{match.matchedUserEmail}</p>
              {match.city && (
                <div className="flex items-center gap-1 mt-1 justify-center sm:justify-start text-white/40 text-sm">
                  <MapPin size={13} /> {match.city}
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <ScoreIndicator score={Math.round(match.score)} size={100} />
              <p className="text-center text-white/40 text-xs mt-2">Compatibility</p>
            </div>
          </div>
        </motion.div>

        {/* Reasons */}
        {match.reasons?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6 mb-6">
            <h2 className="font-semibold text-white mb-4">Match Insights</h2>
            <div className="flex flex-wrap gap-2">
              {match.reasons.map(r => {
                const isFlag = r.toLowerCase().includes('mismatch') || r.toLowerCase().includes('different') || r.toLowerCase().includes('no ')
                return (
                  <span key={r} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border
                    ${isFlag ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'}`}>
                    {isFlag ? <XCircle size={12} /> : <CheckCircle size={12} />} {r}
                  </span>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Side-by-side comparison */}
        {myPref && theirPref && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6">
            <h2 className="font-semibold text-white mb-5">Preference Comparison</h2>
            <div className="flex items-center justify-between mb-4 text-xs text-white/40 font-medium uppercase tracking-wider">
              <span className="flex items-center gap-1"><User size={11} /> You</span>
              <span></span>
              <span className="flex items-center gap-1">{match.matchedUserName?.split(' ')[0]} <User size={11} /></span>
            </div>
            <div className="space-y-0">
              <FieldRow label="City"           mine={myPref.city}                    theirs={theirPref.city}                    match={myPref.city?.toLowerCase() === theirPref.city?.toLowerCase()} />
              <FieldRow label="Sleep Cycle"    mine={fmt(myPref.sleepCycle)}          theirs={fmt(theirPref.sleepCycle)}          match={myPref.sleepCycle === theirPref.sleepCycle} />
              <FieldRow label="Cleanliness"    mine={`${myPref.cleanliness}/5`}        theirs={`${theirPref.cleanliness}/5`}        match={Math.abs((myPref.cleanliness||0)-(theirPref.cleanliness||0)) <= 1} />
              <FieldRow label="Budget"         mine={`₹${myPref.budgetMin}–${myPref.budgetMax}`} theirs={`₹${theirPref.budgetMin}–${theirPref.budgetMax}`} match={myPref.budgetMin <= theirPref.budgetMax && theirPref.budgetMin <= myPref.budgetMax} />
              <FieldRow label="Smoking"        mine={myPref.smoking ? 'Yes':'No'}      theirs={theirPref.smoking ? 'Yes':'No'}      match={myPref.smoking === theirPref.smoking} />
              <FieldRow label="Drinking"       mine={myPref.drinking ? 'Yes':'No'}     theirs={theirPref.drinking ? 'Yes':'No'}     match={myPref.drinking === theirPref.drinking} />
              <FieldRow label="Food"           mine={fmt(myPref.foodPreference)}       theirs={fmt(theirPref.foodPreference)}       match={myPref.foodPreference === theirPref.foodPreference || myPref.foodPreference === 'ANY' || theirPref.foodPreference === 'ANY'} />
              <FieldRow label="Work Type"      mine={fmt(myPref.workType)}             theirs={fmt(theirPref.workType)}             match={myPref.workType === theirPref.workType} />
              <FieldRow label="Guests"         mine={`${myPref.guestsFrequency}/5`}    theirs={`${theirPref.guestsFrequency}/5`}    match={Math.abs((myPref.guestsFrequency||0)-(theirPref.guestsFrequency||0)) <= 1} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
