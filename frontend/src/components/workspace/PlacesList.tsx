import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { fetchPlaces } from '../../store/slices/placeSlice'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PlusCircle, MapPin } from 'lucide-react'

const PlacesList: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { places, isLoading, error } = useSelector((state: RootState) => state.places)

  useEffect(() => {
    dispatch(fetchPlaces())
  }, [dispatch])

  const placesArray = Object.values(places)

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading places...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  const handleCreatePlace = () => {
    navigate('/workspace/place/new')
  }

  return (
    <div className='p-6'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Places</h1>
        <Button onClick={handleCreatePlace}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Place
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      ) : placesArray.length === 0 ? (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>No Places Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">You haven't created any places yet.</p>
            <Button onClick={handleCreatePlace}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Place
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placesArray.map(place => (
            <Card
              key={place.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/workspace/places/${place.id}`)}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center cursor-pointer hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/workspace/places/${place.id}`);
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {place.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {place.adjectives && (
                  <p className="text-muted-foreground line-clamp-3">{place.adjectives}</p>
                )}
                {place.parent && (
                  <div className="text-sm text-muted-foreground mt-1">Located in: {place.parent.name}</div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="ghost"
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/workspace/places/${place.id}`);
                  }}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default PlacesList
