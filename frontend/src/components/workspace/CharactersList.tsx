import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { fetchCharacters } from '../../store/slices/characterSlice'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { BookOpen, PlusCircle } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const CharactersList: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { characters, isLoading, error } = useSelector((state: RootState) => state.characters)

  useEffect(() => {
    dispatch(fetchCharacters())
  }, [dispatch])

  const handleCreateCharacter = () => {
    navigate('/workspace/character/new')
  }

  const charactersArray = Object.values(characters)

  return (
    <div className='p-6'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Characters</h1>
        <Button onClick={handleCreateCharacter}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Character
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
    ) : charactersArray.length === 0 ? (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No Characters Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">You haven't created any characters yet.</p>
          <Button onClick={handleCreateCharacter}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Character
          </Button>
        </CardContent>
      </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charactersArray.map(character => (
            <Card
            key={character.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/workspace/characters/${character.id}`)}
          >
            <CardHeader>
              <CardTitle
                className="flex items-center cursor-pointer hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/workspace/characters/${character.id}`);
                }}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {character.name} {character.surname}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {character.nickname ? `"${character.nickname}"` : ''}
              {character.gender && <div className="text-sm text-muted-foreground mt-1">Gender: {character.gender}</div>}
              {character.race && <div className="text-sm text-muted-foreground">Race: {character.race.name}</div>}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="ghost"
                className="text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/workspace/characters/${character.id}`);
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

export default CharactersList
