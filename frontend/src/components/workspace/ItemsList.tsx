import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { fetchItems } from '../../store/slices/itemSlice'
import { AppDispatch } from '../../store/types'

const ItemsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, isLoading, error } = useSelector((state: RootState) => state.items || { items: {}, isLoading: false, error: null })

  useEffect(() => {
    if (dispatch && fetchItems) {
      dispatch(fetchItems())
    }
  }, [dispatch])

  const itemsArray = Object.values(items || {})

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading items...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Items</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Create Item
        </button>
      </div>

      {itemsArray.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500 mb-4">You haven't created any items yet.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemsArray.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              {item.origin && (
                <p className="text-gray-600 mb-4">{item.origin}</p>
              )}
              {item.owners && item.owners.length > 0 && (
                <p className="text-sm text-gray-500 mb-4">
                  Owned by: {item.owners.map(owner => owner.name).join(', ')}
                </p>
              )}
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

export default ItemsList
