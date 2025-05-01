import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { fetchStory, updateStory } from '../store/slices/dataSlice'

const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentStory, isLoading, error } = useSelector((state: RootState) => state.stories)
  
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [activeTab, setActiveTab] = useState('details')
  
  useEffect(() => {
    if (id) {
      dispatch(fetchStory(parseInt(id)))
    }
  }, [dispatch, id])
  
  useEffect(() => {
    if (currentStory) {
      setTitle(currentStory.title)
      setDescription(currentStory.description)
    }
  }, [currentStory])
  
  const handleUpdateStory = (e: React.FormEvent) => {
    e.preventDefault()
    if (id) {
      dispatch(updateStory({ id: parseInt(id), storyData: { title, description } }))
      setIsEditing(false)
    }
  }
  
  if (isLoading || !currentStory) {
    return <div className="text-center py-8">Loading story details...</div>
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:underline flex items-center"
        >
          ← Back to Dashboard
        </button>
      </div>
      
      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Story</h2>
          <form onSubmit={handleUpdateStory}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{currentStory.title}</h1>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-gray-600 mb-4">{currentStory.description}</p>
          <div className="text-sm text-gray-500">
            <p>Created: {new Date(currentStory.created_at).toLocaleDateString()}</p>
            <p>Last updated: {new Date(currentStory.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'details' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'characters' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('characters')}
          >
            Characters ({currentStory.characters.length})
          </button>
          <button
            className={`px-4 py-3 font-medium ${activeTab === 'chapters' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('chapters')}
          >
            Chapters ({currentStory.chapters.length})
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'details' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Story Details</h2>
              <p className="text-gray-600">
                This section will contain additional details about your story, such as genre, target audience, themes, etc.
              </p>
            </div>
          )}
          
          {activeTab === 'characters' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Characters</h2>
                <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                  Add Character
                </button>
              </div>
              
              {currentStory.characters.length === 0 ? (
                <p className="text-gray-600">No characters have been added to this story yet.</p>
              ) : (
                <div className="space-y-4">
                  {currentStory.characters.map((character) => (
                    <div key={character.id} className="border rounded-md p-4">
                      <h3 className="font-semibold">{character.name}</h3>
                      <p className="text-gray-600">{character.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'chapters' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Chapters</h2>
                <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                  Add Chapter
                </button>
              </div>
              
              {currentStory.chapters.length === 0 ? (
                <p className="text-gray-600">No chapters have been added to this story yet.</p>
              ) : (
                <div className="space-y-4">
                  {currentStory.chapters.map((chapter) => (
                    <div key={chapter.id} className="border rounded-md p-4">
                      <h3 className="font-semibold">{chapter.title}</h3>
                      <p className="text-gray-500 text-sm mb-2">Order: {chapter.order}</p>
                      <p className="text-gray-600 line-clamp-3">{chapter.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StoryDetailPage
