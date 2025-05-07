
import { Routes, Route, Navigate } from 'react-router-dom'
import WorkspaceSidebar from '../components/workspace/WorkspaceSidebar'
import IdeasList from '@/components/workspace/IdeasList'
import WorkspaceHome from '@/components/workspace/WorkspaceHome'
import StoriesList from '@/components/workspace/StoriesList'
import NewStory from '@/components/workspace/NewStory'
import StoryDetails from '@/components/workspace/StoryDetails'
import CharactersList from '@/components/workspace/CharactersList'
import NewCharacter from '@/components/workspace/NewCharacter'
import CharacterDetails from '@/components/workspace/CharacterDetails'
import PlacesList from '@/components/workspace/PlacesList'
import NewPlace from '@/components/workspace/NewPlace'
import PlaceDetails from '@/components/workspace/PlaceDetails'
import ItemsList from '@/components/workspace/ItemsList'
import Settings from '@/components/workspace/Settings'
import { SidebarProvider } from '@/components/ui/sidebar'

const WorkspacePage: React.FC = () => {
  return (
    <SidebarProvider defaultOpen={true}>
        <WorkspaceSidebar/>
        <div className='bg-skin-primary text-skin-primary w-full h-full min-h-screen px-10'>
          <Routes>
            <Route index element={<WorkspaceHome />} />
            <Route path="stories" element={<StoriesList />} />
            <Route path="stories/:id" element={<StoryDetails />} />
            <Route path="story/new" element={<NewStory />} />
            <Route path="characters" element={<CharactersList />} />
            <Route path="characters/:id" element={<CharacterDetails />} />
            <Route path="character/new" element={<NewCharacter />} />
            <Route path="places" element={<PlacesList />} />
            <Route path="places/:id" element={<PlaceDetails />} />
            <Route path="place/new" element={<NewPlace />} />
            <Route path="items" element={<ItemsList />} />
            <Route path="ideas" element={<IdeasList />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/workspace" replace />} />
          </Routes>
        </div>
    </SidebarProvider>
  )
}

export default WorkspacePage
