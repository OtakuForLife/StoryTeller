import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { RootState } from '../store'
import { AuthState, logout } from '../store/slices/authSlice'
import { useAppDispatch } from '@/hooks/useAppDispatch'

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user }: AuthState = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <nav className="bg-skin-primary text-skin-primary shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">StoryTeller</Link>
        <div className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <span className="py-2">Welcome, {user?.username}</span>
              <Link to="/workspace" className="py-2 hover:text-skin-primary-hover">Workspace</Link>
              <button
                onClick={handleLogout}
                className="py-2 hover:text-skin-primary-hover"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-2 hover:text-skin-primary-hover">Login</Link>
              <Link to="/register" className="py-2 hover:text-skin-primary-hover">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
