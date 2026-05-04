import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, LayoutDashboard, FileText, Home } from 'lucide-react'

export function Navbar() {
  const { user, logout, isAdmin } = useAuth()

  return (
    <nav className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white rounded-xl p-2 shadow-md group-hover:shadow-lg transition-all">
              <img src="/logo.jpeg" alt="TBC Global Finance" className="h-9 w-9 object-contain" />
            </div>
            <span className="font-black text-lg leading-tight text-gray-900">
              TBC Global <span className="text-gray-600 font-normal text-sm block -mt-1">Finance</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            {!user && (
              <>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">How It Works</a>
                <a href="#products" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Products</a>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105">
                  Apply Now
                </Link>
              </>
            )}

            {user && (
              <>
                {isAdmin ? (
                  <Link to="/admin" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                    <LayoutDashboard size={16} /> Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/dashboard" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                      <Home size={16} /> Dashboard
                    </Link>
                    <Link to="/apply" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                      <FileText size={16} /> Apply
                    </Link>
                  </>
                )}

                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-300">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
                    <p className="text-xs text-green-600 capitalize font-medium">{user.role}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
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
