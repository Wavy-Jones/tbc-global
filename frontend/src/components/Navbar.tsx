import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, LayoutDashboard, FileText, Home } from 'lucide-react'

export function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="bg-[#1e3a5f] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center font-black text-white text-sm">
              TBC
            </div>
            <span className="font-bold text-lg">TBC Global</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            {!user && (
              <>
                <a href="#how-it-works" className="text-gray-300 hover:text-white text-sm transition-colors">How It Works</a>
                <a href="#products" className="text-gray-300 hover:text-white text-sm transition-colors">Products</a>
                <Link to="/login" className="text-gray-300 hover:text-white text-sm transition-colors">Login</Link>
                <Link to="/register" className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                  Apply Now
                </Link>
              </>
            )}

            {user && (
              <>
                {isAdmin ? (
                  <Link to="/admin" className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm transition-colors">
                    <LayoutDashboard size={16} /> Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/dashboard" className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm transition-colors">
                      <Home size={16} /> Dashboard
                    </Link>
                    <Link to="/apply" className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm transition-colors">
                      <FileText size={16} /> Apply
                    </Link>
                  </>
                )}

                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-blue-700">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-amber-400 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 text-gray-300 hover:text-red-400 transition-colors text-sm"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
