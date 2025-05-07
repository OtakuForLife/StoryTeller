import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { fetchStories } from '../../store/slices/storySlice'
import { fetchCharacters } from '../../store/slices/characterSlice'
import { fetchPlaces } from '../../store/slices/placeSlice'
import { fetchIdeas } from '../../store/slices/ideaSlice'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Book, Users, MapPin, Lightbulb, ArrowRight } from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'

const WorkspaceHome: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { stories, isLoading: storiesLoading } = useSelector((state: RootState) => state.stories)
  const { characters, isLoading: charactersLoading } = useSelector((state: RootState) => state.characters)
  const { places, isLoading: placesLoading } = useSelector((state: RootState) => state.places)
  const { ideas, isLoading: ideasLoading } = useSelector((state: RootState) => state.ideas)

  useEffect(() => {
      dispatch(fetchStories())
      dispatch(fetchCharacters())
      dispatch(fetchPlaces())
      dispatch(fetchIdeas())
  }, [dispatch])

  const isLoading = storiesLoading || charactersLoading || placesLoading || ideasLoading

  const storiesArray = Object.values(stories)
  const charactersArray = Object.values(characters)
  const placesArray = Object.values(places)
  const ideasArray = Object.values(ideas)

  return (
    <div className='p-6'>
      <h1 className="text-3xl font-bold mb-8">Welcome to your Workspace, {user?.username}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stories Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Book className="h-5 w-5" />
              <CardTitle>Stories</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {storiesArray.length} total
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : storiesArray.length === 0 ? (
              <p className="text-sm text-muted-foreground">No stories yet. Create your first story!</p>
            ) : (
              <ul className="space-y-2">
                {storiesArray.slice(0, 3).map(story => (
                  <li key={story.id} className="border-b pb-2">
                    <p className="font-medium">{story.title}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Link
              to="/workspace/stories"
              className="text-sm text-primary flex items-center space-x-1 hover:underline"
            >
              <span>View all stories</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>

        {/* Characters Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <CardTitle>Characters</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {charactersArray.length} total
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : charactersArray.length === 0 ? (
              <p className="text-sm text-muted-foreground">No characters yet. Create your first character!</p>
            ) : (
              <ul className="space-y-2">
                {charactersArray.slice(0, 3).map(character => (
                  <li key={character.id} className="border-b pb-2">
                    <p className="font-medium">{character.name} {character.surname}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Link
              to="/workspace/characters"
              className="text-sm text-primary flex items-center space-x-1 hover:underline"
            >
              <span>View all characters</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>

        {/* Places Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <CardTitle>Places</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {placesArray.length} total
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : placesArray.length === 0 ? (
              <p className="text-sm text-muted-foreground">No places yet. Create your first place!</p>
            ) : (
              <ul className="space-y-2">
                {placesArray.slice(0, 3).map(place => (
                  <li key={place.id} className="border-b pb-2">
                    <p className="font-medium">{place.name}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Link
              to="/workspace/places"
              className="text-sm text-primary flex items-center space-x-1 hover:underline"
            >
              <span>View all places</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>

        {/* Ideas Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <CardTitle>Ideas</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {ideasArray.length} total
            </Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : ideasArray.length === 0 ? (
              <p className="text-sm text-muted-foreground">No ideas yet. Create your first idea!</p>
            ) : (
              <ul className="space-y-2">
                {ideasArray.slice(0, 3).map(idea => (
                  <li key={idea.id} className="border-b pb-2">
                    <p className="font-medium">{idea.content.substring(0, 50)}...</p>
                    <p className="text-xs text-muted-foreground">Type: {idea.type}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter>
            <Link
              to="/workspace/ideas"
              className="text-sm text-primary flex items-center space-x-1 hover:underline"
            >
              <span>View all ideas</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default WorkspaceHome
