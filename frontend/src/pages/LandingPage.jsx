import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Star, Shield, Zap, ArrowRight, Users } from 'lucide-react'
import Navbar from '../components/Navbar'

const features = [
  { icon: Zap,    title: 'Smart Matching',     desc: 'Weighted compatibility scores across sleep cycle, budget, habits and more.' },
  { icon: Shield, title: 'Explainable Scores', desc: 'Know exactly why someone is a great match — no black boxes.' },
  { icon: Users,  title: 'City-Based Search',  desc: 'Find flatmates in your city with overlapping budgets automatically.' },
  { icon: Star,   title: 'Top 20 Matches',     desc: 'Ranked results so you always see the best matches first.' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-hero">
      <Navbar />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24">
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-primary-300 font-medium mb-6">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse-slow" />
            AI-Powered Flatmate Matching
          </span>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-transparent leading-tight mb-6">
            Find Your Perfect<br />
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Flatmate
            </span>
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-10">
            Answer a few lifestyle questions and we'll match you with the most compatible flatmates
            using our smart scoring engine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth')}
              className="btn-primary flex items-center gap-2 text-lg"
              id="hero-get-started"
            >
              Get Started <ArrowRight size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/auth')}
              className="btn-ghost text-lg"
              id="hero-login"
            >
              Sign In
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-6 text-center">
          {[['95%', 'Match Accuracy'], ['5 mins', 'To Setup'], ['Top 20', 'Ranked Matches']].map(([val, label]) => (
            <motion.div key={label} whileHover={{ y: -4 }} className="glass p-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">{val}</div>
              <div className="text-white/50 text-sm mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Why FlatMate?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} whileHover={{ y: -4 }} className="glass-hover p-6 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                <Icon className="text-primary-400" size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-white/50 text-sm">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="text-center py-8 text-white/30 text-sm border-t border-white/5">
        © 2024 FlatMate — Built with ❤️
      </footer>
    </div>
  )
}
