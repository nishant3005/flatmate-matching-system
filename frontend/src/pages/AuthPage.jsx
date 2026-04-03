import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Home } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [tab, setTab]         = useState('login')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const { login } = useAuth()
  const navigate  = useNavigate()

  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const url  = tab === 'login' ? '/auth/login' : '/auth/signup'
      const body = tab === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }
      const { data } = await api.post(url, body)
      login(data)
      navigate(tab === 'signup' ? '/onboarding' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center px-4">
      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 font-bold text-2xl text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Home size={18} className="text-white" />
            </div>
            FlatMate
          </div>
        </div>

        <div className="glass p-8">
          {/* Tabs */}
          <div className="flex glass rounded-xl p-1 mb-8">
            {['login', 'signup'].map(t => (
              <button key={t} id={`tab-${t}`}
                onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 capitalize
                  ${tab === t ? 'bg-primary-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}>
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-5">
            <AnimatePresence>
              {tab === 'signup' && (
                <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <label className="label">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input id="input-name" name="name" type="text" placeholder="John Doe"
                      value={form.name} onChange={change} required={tab === 'signup'}
                      className="input-field pl-10" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input id="input-email" name="email" type="email" placeholder="you@example.com"
                  value={form.email} onChange={change} required className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input id="input-password" name="password" type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••" value={form.password} onChange={change} required className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </motion.div>
            )}

            <button id="btn-submit-auth" type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {tab === 'login' ? 'Signing in…' : 'Creating account…'}
              </span> : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
