import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Moon, Sparkles, Heart, DollarSign, Utensils, Briefcase, Users, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const STEPS = [
  { title: 'Location & Budget', icon: MapPin },
  { title: 'Sleep & Cleanliness', icon: Moon },
  { title: 'Habits', icon: Heart },
  { title: 'Lifestyle', icon: Sparkles },
]

const INIT = {
  city: '', budgetMin: '', budgetMax: '', sleepCycle: '',
  cleanliness: '', smoking: '', drinking: '',
  foodPreference: '', workType: '', guestsFrequency: '',
}

const Radio = ({ name, value, current, onChange, label }) => (
  <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-150
    ${current === value ? 'border-primary-500 bg-primary-500/15 text-white' : 'border-white/10 text-white/60 hover:border-white/25 hover:text-white/80'}`}>
    <input type="radio" name={name} value={value} checked={current === value} onChange={onChange} className="hidden" />
    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
      ${current === value ? 'border-primary-400' : 'border-white/30'}`}>
      {current === value && <div className="w-2 h-2 bg-primary-400 rounded-full" />}
    </div>
    <span className="text-sm font-medium capitalize">{label}</span>
  </label>
)

export default function OnboardingPage() {
  const [step, setStep]   = useState(0)
  const [form, setForm]   = useState(INIT)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/preferences/me')
      .then(res => {
        if (res.data) {
          setForm({
            ...INIT,
            ...res.data,
            smoking: res.data.smoking !== undefined ? String(res.data.smoking) : '',
            drinking: res.data.drinking !== undefined ? String(res.data.drinking) : '',
          })
        }
      })
      .catch(() => {})
  }, [])

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const next = () => { setError(''); setStep(s => Math.min(s + 1, STEPS.length - 1)) }
  const prev = () => { setError(''); setStep(s => Math.max(s - 1, 0)) }

  const submit = async () => {
    setSaving(true); setError('')
    try {
      await api.post('/preferences', {
        ...form,
        budgetMin:       Number(form.budgetMin),
        budgetMax:       Number(form.budgetMax),
        cleanliness:     Number(form.cleanliness),
        guestsFrequency: Number(form.guestsFrequency),
        smoking:  form.smoking  === 'true',
        drinking: form.drinking === 'true',
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save preferences.')
    } finally { setSaving(false) }
  }

  const stepContent = [
    /* Step 0 — Location & Budget */
    <div className="space-y-5" key="s0">
      <div>
        <label className="label"><MapPin size={14} className="inline mr-1" />City</label>
        <input id="pref-city" name="city" value={form.city} onChange={change} placeholder="e.g. Mumbai"
          className="input-field" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Budget Min (₹)</label>
          <input id="pref-budget-min" name="budgetMin" type="number" value={form.budgetMin} onChange={change}
            placeholder="5000" className="input-field" />
        </div>
        <div>
          <label className="label">Budget Max (₹)</label>
          <input id="pref-budget-max" name="budgetMax" type="number" value={form.budgetMax} onChange={change}
            placeholder="15000" className="input-field" />
        </div>
      </div>
    </div>,

    /* Step 1 — Sleep & Cleanliness */
    <div className="space-y-6" key="s1">
      <div>
        <label className="label mb-3 block"><Moon size={14} className="inline mr-1" />Sleep Cycle</label>
        <div className="grid grid-cols-3 gap-2">
          {[['EARLY_BIRD','Early Bird'],['NIGHT_OWL','Night Owl'],['FLEXIBLE','Flexible']].map(([v,l]) => (
            <Radio key={v} name="sleepCycle" value={v} current={form.sleepCycle} onChange={change} label={l} />
          ))}
        </div>
      </div>
      <div>
        <label className="label">Cleanliness Level: <span className="text-primary-400 font-bold">{form.cleanliness || '?'}/5</span></label>
        <input id="pref-cleanliness" name="cleanliness" type="range" min="1" max="5" value={form.cleanliness || 3} onChange={change}
          className="w-full accent-primary-500 mt-2" />
        <div className="flex justify-between text-xs text-white/30 mt-1"><span>Relaxed</span><span>Spotless</span></div>
      </div>
    </div>,

    /* Step 2 — Habits */
    <div className="space-y-6" key="s2">
      <div>
        <label className="label mb-3 block">Smoking</label>
        <div className="grid grid-cols-2 gap-2">
          {[['true','Yes, I smoke'],['false','No, I don\'t']].map(([v,l]) => (
            <Radio key={v} name="smoking" value={v} current={form.smoking} onChange={change} label={l} />
          ))}
        </div>
      </div>
      <div>
        <label className="label mb-3 block">Drinking</label>
        <div className="grid grid-cols-2 gap-2">
          {[['true','Yes, occasionally'],['false','No, I don\'t']].map(([v,l]) => (
            <Radio key={v} name="drinking" value={v} current={form.drinking} onChange={change} label={l} />
          ))}
        </div>
      </div>
    </div>,

    /* Step 3 — Lifestyle */
    <div className="space-y-6" key="s3">
      <div>
        <label className="label mb-3 block"><Utensils size={14} className="inline mr-1" />Food Preference</label>
        <div className="grid grid-cols-2 gap-2">
          {[['VEG','Vegetarian'],['NON_VEG','Non-Veg'],['VEGAN','Vegan'],['EGGETARIAN','Eggetarian'],['ANY','No Preference']].map(([v,l]) => (
            <Radio key={v} name="foodPreference" value={v} current={form.foodPreference} onChange={change} label={l} />
          ))}
        </div>
      </div>
      <div>
        <label className="label mb-3 block"><Briefcase size={14} className="inline mr-1" />Work Type</label>
        <div className="grid grid-cols-2 gap-2">
          {[['WORK_FROM_HOME','WFH'],['OFFICE','Office'],['HYBRID','Hybrid'],['STUDENT','Student']].map(([v,l]) => (
            <Radio key={v} name="workType" value={v} current={form.workType} onChange={change} label={l} />
          ))}
        </div>
      </div>
      <div>
        <label className="label"><Users size={14} className="inline mr-1" />Guest Frequency: <span className="text-primary-400 font-bold">{form.guestsFrequency || '?'}/5</span></label>
        <input id="pref-guests" name="guestsFrequency" type="range" min="1" max="5" value={form.guestsFrequency || 3} onChange={change}
          className="w-full accent-primary-500 mt-2" />
        <div className="flex justify-between text-xs text-white/30 mt-1"><span>Rarely</span><span>Always</span></div>
      </div>
    </div>,
  ]

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${i < step ? 'bg-primary-500 border-primary-500' : i === step ? 'border-primary-400 bg-primary-500/20' : 'border-white/15 bg-transparent'}`}>
                  {i < step ? <Check size={14} className="text-white" /> : <s.icon size={14} className={i === step ? 'text-primary-400' : 'text-white/30'} />}
                </div>
                <span className={`text-xs hidden sm:block ${i === step ? 'text-primary-400' : 'text-white/30'}`}>{s.title}</span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-white/10 rounded-full">
            <motion.div className="h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>

        {/* Card */}
        <div className="glass p-8">
          <h2 className="text-2xl font-bold text-white mb-2">{STEPS[step].title}</h2>
          <p className="text-white/50 text-sm mb-7">Step {step + 1} of {STEPS.length}</p>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {stepContent[step]}
            </motion.div>
          </AnimatePresence>

          {error && <div className="mt-5 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</div>}

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button id="btn-prev-step" onClick={prev} className="btn-ghost flex items-center gap-2">
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button id="btn-next-step" onClick={next} className="btn-primary flex items-center gap-2 ml-auto">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button id="btn-submit-prefs" onClick={submit} disabled={saving} className="btn-primary ml-auto flex items-center gap-2">
                {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : <><Check size={16} /> Save & Find Matches</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
