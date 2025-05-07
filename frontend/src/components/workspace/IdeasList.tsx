import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { fetchIdeas } from '../../store/slices/ideaSlice'
import { AppDispatch } from '../../store/types'

const IdeasList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { ideas, isLoading, error } = useSelector((state: RootState) => state.ideas)

  useEffect(() => {
    dispatch(fetchIdeas())
  }, [dispatch])

  const ideasArray = Object.values(ideas)

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading ideas...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ideas</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Create Idea
        </button>
      </div>

      {ideasArray.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500 mb-4">You haven't created any ideas yet.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create Your First Idea
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideasArray.map(idea => (
            <div key={idea.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{idea.type}</h2>
                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {idea.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-4">{idea.content}</p>
              <div className="flex justify-end">
                <button className="text-blue-600 hover:underline">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default IdeasList
