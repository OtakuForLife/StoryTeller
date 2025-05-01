import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../store'
import { fetchStories, createStory, deleteStory } from '../store/slices/dataSlice'
import { useAppDispatch } from '../hooks/useAppDispatch'

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { stories, isLoading, error } = useSelector((state: RootState) => state.stories)
  
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  useEffect(() => {
    dispatch(fetchStories())
  }, [dispatch])
  
  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(createStory({ title, description }))
    setTitle('')
    setDescription('')
    setShowCreateForm(false)
  }
  
  const handleDeleteStory = (id: number) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      dispatch(deleteStory(id))
    }
  }
  
  if (isLoading && stories.length === 0) {
    return <div className="text-center py-8">Loading your stories...</div>
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Stories</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showCreateForm ? 'Cancel' : 'Create New Story'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Story</h2>
          <form onSubmit={handleCreateStory}>
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
            
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Story
            </button>
          </form>
        </div>
      )}
      
      {!Array.isArray(stories) || stories.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">You haven't created any stories yet.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="text-blue-600 hover:underline"
          >
            Create your first story
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div key={story.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{story.description}</p>
              
              <div className="flex justify-between items-center">
                <Link
                  to={`/stories/${story.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleDeleteStory(story.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardPage


