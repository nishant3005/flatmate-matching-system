/** Animated score ring — props: score (0-100), size */
export default function ScoreIndicator({ score = 0, size = 80 }) {
  const r   = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const pct  = Math.min(100, Math.max(0, score))
  const dash = (pct / 100) * circ
  const gap  = circ - dash

  const color = pct >= 75 ? '#22d3ee' : pct >= 50 ? '#7c3aed' : pct >= 30 ? '#f59e0b' : '#ef4444'
  const label = pct >= 75 ? 'Excellent' : pct >= 50 ? 'Good' : pct >= 30 ? 'Fair' : 'Low'

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="score-ring -rotate-90">
        {/* BG track */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6} />
        {/* Progress arc */}
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="-mt-[62px] flex flex-col items-center" style={{ height: size - 12 }}>
        <span className="text-lg font-bold text-white leading-none mt-6">{pct}%</span>
        <span className="text-[10px] font-medium mt-0.5" style={{ color }}>{label}</span>
      </div>
    </div>
  )
}
