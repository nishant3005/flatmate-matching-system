import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, LogOut, User } from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white" id="nav-logo">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <Home size={16} className="text-white" />
          </div>
          FlatMate
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" id="nav-dashboard"
                className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                Dashboard
              </Link>
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-xl">
                <User size={14} className="text-primary-400" />
                <span className="text-sm text-white/80">{user?.name}</span>
              </div>
              <button onClick={handleLogout} id="nav-logout"
                className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors">
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <Link to="/auth" id="nav-signin"
              className="btn-primary py-2 px-5 text-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
