import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import WorkspacePage from '../WorkspacePage'
import authReducer from '../../store/slices/authSlice'
import storyReducer from '../../store/slices/storySlice'
import characterReducer from '../../store/slices/characterSlice'
import placeReducer from '../../store/slices/placeSlice'
import itemReducer from '../../store/slices/itemSlice'
import ideaReducer from '../../store/slices/ideaSlice'
import themeReducer from '../../store/slices/themeSlice'

// Mock the async thunks
vi.mock('../../store/slices/storySlice', async () => {
  const actual = await vi.importActual('../../store/slices/storySlice')
  return {
    ...actual,
    fetchStories: vi.fn().mockReturnValue({ type: 'story/fetchStories' })
  }
})

vi.mock('../../store/slices/characterSlice', async () => {
  const actual = await vi.importActual('../../store/slices/characterSlice')
  return {
    ...actual,
    fetchCharacters: vi.fn().mockReturnValue({ type: 'character/fetchCharacters' })
  }
})

vi.mock('../../store/slices/placeSlice', async () => {
  const actual = await vi.importActual('../../store/slices/placeSlice')
  return {
    ...actual,
    fetchPlaces: vi.fn().mockReturnValue({ type: 'place/fetchPlaces' })
  }
})

vi.mock('../../store/slices/itemSlice', async () => {
  const actual = await vi.importActual('../../store/slices/itemSlice')
  return {
    ...actual,
    fetchItems: vi.fn().mockReturnValue({ type: 'item/fetchItems' })
  }
})

vi.mock('../../store/slices/ideaSlice', async () => {
  const actual = await vi.importActual('../../store/slices/ideaSlice')
  return {
    ...actual,
    fetchIdeas: vi.fn().mockReturnValue({ type: 'idea/fetchIdeas' })
  }
})

// Mock the entire sidebar module
vi.mock('@/components/ui/sidebar', () => {
  const React = require('react')
  
  // Create simplified mock components that don't use the context
  const SidebarContext = React.createContext({
    state: 'expanded',
    toggleSidebar: vi.fn(),
    open: true,
    setOpen: vi.fn(),
    openMobile: false,
    setOpenMobile: vi.fn(),
    isMobile: false
  })
  
  return {
    useSidebar: () => React.useContext(SidebarContext),
    SidebarContext,
    SidebarProvider: ({ children }: { children: React.ReactNode }) => {
      return <div data-testid="sidebar-provider">{children}</div>
    },
    Sidebar: ({ children, className }: { children: React.ReactNode, className?: string }) => {
      return <div data-testid="sidebar" className={className}>{children}</div>
    },
    SidebarHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-header">{children}</div>,
    SidebarContent: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-content">{children}</div>,
    SidebarFooter: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-footer">{children}</div>,
    SidebarTrigger: () => <button data-testid="sidebar-trigger">Toggle</button>,
    SidebarMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-menu">{children}</div>,
    SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-menu-item">{children}</div>,
    SidebarMenuButton: ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => {
      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, { 'data-testid': 'sidebar-menu-button' })
      }
      return <button data-testid="sidebar-menu-button">{children}</button>
    },
    SidebarGroup: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-group">{children}</div>,
    SidebarGroupContent: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-group-content">{children}</div>,
    SidebarSearch: () => <div data-testid="sidebar-search">Search</div>
  }
})

describe('WorkspacePage', () => {
  const renderWithProviders = (
    ui: React.ReactElement,
    {
      initialState = {
        auth: {
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
          },
          isAuthenticated: true,
          isLoading: false,
          error: null
        },
        stories: { stories: {}, isLoading: false, error: null },
        characters: { characters: {}, isLoading: false, error: null },
        places: { places: {}, isLoading: false, error: null },
        items: { items: {}, isLoading: false, error: null },
        ideas: { ideas: {}, isLoading: false, error: null },
        theme: { theme: 'dark' }
      },
      route = '/workspace'
    } = {}
  ) => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        stories: storyReducer,
        characters: characterReducer,
        places: placeReducer,
        items: itemReducer,
        ideas: ideaReducer,
        theme: themeReducer
      },
      preloadedState: initialState
    })

    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/workspace/*" element={ui} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )
  }

  test('renders the workspace page with sidebar', () => {
    renderWithProviders(<WorkspacePage />)

    // Check for sidebar navigation items
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Stories').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Characters').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Places').length).toBeGreaterThan(0)
    //expect(screen.getAllByText('Items').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Ideas').length).toBeGreaterThan(0)
  })

  test('renders the workspace home by default', () => {
    renderWithProviders(<WorkspacePage />)

    // Check for workspace home content
    expect(screen.getByText(/Welcome to your Workspace/)).toBeInTheDocument()
  })
})



