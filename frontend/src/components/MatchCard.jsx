import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, CheckCircle, XCircle, Clock } from 'lucide-react'
import ScoreIndicator from './ScoreIndicator'

export default function MatchCard({ match, index }) {
  const navigate = useNavigate()
  const { matchId, matchedUserName, matchedUserEmail, score, reasons = [], city, lastActiveAt } = match

  // Split reasons into positive and flags
  const positives = reasons.filter(r => !r.toLowerCase().includes('mismatch') && !r.toLowerCase().includes('different') && !r.toLowerCase().includes('no '))
  const flags     = reasons.filter(r =>  r.toLowerCase().includes('mismatch') || r.toLowerCase().includes('different') || r.toLowerCase().includes('no '))

  const initials = matchedUserName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  const colors   = ['from-primary-600 to-primary-400', 'from-accent-600 to-accent-400', 'from-purple-600 to-pink-400']
  
  const formattedActiveTime = lastActiveAt 
    ? new Date(lastActiveAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Unknown'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass-hover p-6 cursor-pointer"
      onClick={() => navigate(`/match/${matchId}`)}
      id={`match-card-${matchId}`}
    >
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg`}>
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg leading-tight">{matchedUserName}</h3>
          <p className="text-white/40 text-sm truncate">{matchedUserEmail}</p>
          <div className="flex items-center gap-3 mt-1 text-white/50 text-xs">
            {city && (
              <span className="flex items-center gap-1">
                <MapPin size={11} /> {city}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={11} /> Active: {formattedActiveTime}
            </span>
          </div>

          {/* Reasons preview */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {positives.slice(0, 2).map(r => (
              <span key={r} className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <CheckCircle size={10} /> {r}
              </span>
            ))}
            {flags.slice(0, 1).map(r => (
              <span key={r} className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">
                <XCircle size={10} /> {r}
              </span>
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="flex-shrink-0">
          <ScoreIndicator score={Math.round(score)} size={76} />
        </div>
      </div>
    </motion.div>
  )
}
