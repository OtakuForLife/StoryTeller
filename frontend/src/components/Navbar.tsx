import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { logout } from '../store/slices/authSlice'

const Navbar: React.FC = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">StoryTeller</Link>
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <span className="py-2">Welcome, {user?.username}</span>
              <Link to="/dashboard" className="py-2 hover:text-blue-200">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="py-2 hover:text-blue-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-2 hover:text-blue-200">Login</Link>
              <Link to="/register" className="py-2 hover:text-blue-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
