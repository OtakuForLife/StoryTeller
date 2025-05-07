import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../../store'
import { fetchStories } from '../../store/slices/storySlice'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PlusCircle, BookOpen } from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'

const StoriesList: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { stories, isLoading, error } = useSelector((state: RootState) => state.stories)

  useEffect(() => {
      dispatch(fetchStories())
  }, [dispatch])

  const handleCreateStory = () => {
    navigate('/workspace/story/new')
  }

  const storiesArray = Object.values(stories)

  return (
    <div className='p-6'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stories</h1>
        <Button onClick={handleCreateStory}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Story
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
      ) : storiesArray.length === 0 ? (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>No Stories Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">You haven't created any stories yet.</p>
            <Button onClick={handleCreateStory}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Story
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storiesArray.map(story => (
            <Card
              key={story.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/workspace/stories/${story.id}`)}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center cursor-pointer hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/workspace/stories/${story.id}`);
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {story.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {story.logline && (
                  <p className="text-muted-foreground line-clamp-3">{story.logline}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="ghost"
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/workspace/stories/${story.id}`);
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

export default StoriesList
