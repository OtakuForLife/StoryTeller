import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { setupStore } from './store'
import { useEffect } from 'react'
import { loadUser } from './store/slices/authSlice'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import StoryDetailPage from './pages/StoryDetailPage'
import NotFoundPage from './pages/NotFoundPage'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import { useAppDispatch } from './hooks/useAppDispatch'
import { loadTheme } from './store/slices/themeSlice'
import api, { setCsrfToken } from './utils/api'

// Create a component to load user data
const AppContent = () => {
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    // Get CSRF token first
    api.get('/account/csrf/')
      .then(response => {
        if (response.data && response.data.csrfToken) {
          setCsrfToken(response.data.csrfToken)
          // After getting CSRF token, load user data
          dispatch(loadUser())
          dispatch(loadTheme())
        }
      })
      .catch(error => {
        console.error('Error fetching CSRF token:', error)
      })
  }, [dispatch])

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/stories/:id" element={<PrivateRoute><StoryDetailPage /></PrivateRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

function App() {
  const store = setupStore()
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  )
}

export default App




