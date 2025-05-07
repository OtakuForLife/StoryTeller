import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Book, 
  Users, 
  MapPin, 
  Package, 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react'

interface WorkspaceNavbarProps {
  collapsed: boolean
  toggleSidebar: () => void
}

const WorkspaceNavbar: React.FC<WorkspaceNavbarProps> = ({ collapsed, toggleSidebar }) => {
  const navItems = [
    { path: '/workspace', label: 'Workspace', icon: <Home size={20} /> },
    { path: '/workspace/stories', label: 'Stories', icon: <Book size={20} /> },
    { path: '/workspace/characters', label: 'Characters', icon: <Users size={20} /> },
    { path: '/workspace/places', label: 'Places', icon: <MapPin size={20} /> },
    { path: '/workspace/items', label: 'Items', icon: <Package size={20} /> },
    { path: '/workspace/ideas', label: 'Ideas', icon: <Lightbulb size={20} /> },
  ]

  return (
    <div 
      className={`bg-gray-800 text-white h-full fixed left-0 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex justify-end p-2">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 ${
                    isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
                  } transition-colors ${
                    collapsed ? 'justify-center' : ''
                  }`
                }
                end={item.path === '/workspace'}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default WorkspaceNavbar
