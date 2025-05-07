import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { fetchCharacters, updateCharacter, deleteCharacter } from '../../store/slices/characterSlice'
import { fetchRaces } from '../../store/slices/raceSlice'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Trash } from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { Character, Gender, Race } from '@/models'

const CharacterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { characters, isLoading, error } = useSelector((state: RootState) => state.characters)
  const { races } = useSelector((state: RootState) => state.races)
  const [formData, setFormData] = useState<Character | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    // Load races for the dropdown
    dispatch(fetchRaces())

    // If we don't have the character in the store, fetch all characters
    if (!id || (Object.keys(characters).length > 0 && characters[id])) {
      // Character exists in the store, set it as form data
      if (id && characters[id] && !formData) {
        setFormData(characters[id])
      }
    } else {
      // Character doesn't exist in the store, fetch all characters
      dispatch(fetchCharacters())
    }
  }, [dispatch, id, characters, formData])

  // Update form data when characters are loaded
  useEffect(() => {
    if (id && characters[id] && !formData) {
      setFormData(characters[id])
    }
  }, [id, characters, formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return

    const { name, value } = e.target
    setFormData(prev => {
      if (!prev) return null
      return {
        ...prev,
        [name]: value
      }
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!formData) return

    const raceId = e.target.value
    if (raceId === '') {
      setFormData(prev => {
        if (!prev) return null
        return {
          ...prev,
          race: undefined
        }
      })
    } else {
      const selectedRace = Object.values(races).find(race => race.id === raceId)
      setFormData(prev => {
        if (!prev) return null
        return {
          ...prev,
          race: selectedRace
        }
      })
    }
  }

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!formData) return

    const genderValue = e.target.value
    if (genderValue === '') {
      setFormData(prev => {
        if (!prev) return null
        return {
          ...prev,
          gender: undefined
        }
      })
    } else {
      setFormData(prev => {
        if (!prev) return null
        return {
          ...prev,
          gender: genderValue as Gender
        }
      })
    }
  }

  const validateForm = () => {
    if (!formData) return { form: 'No data to submit' }

    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required'
    }

    return newErrors
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (!formData || !id) return

    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await dispatch(updateCharacter({ id, characterData: formData })).unwrap()
      // Show success message or notification
    } catch (error) {
      console.error('Failed to update character:', error)
      setErrors({ submit: 'Failed to update character. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return

    setIsSubmitting(true)

    try {
      await dispatch(deleteCharacter(id)).unwrap()
      navigate('/workspace/characters')
    } catch (error) {
      console.error('Failed to delete character:', error)
      setErrors({ submit: 'Failed to delete character. Please try again.' })
    } finally {
      setIsSubmitting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (isLoading) {
    return (
      <div className='p-6'>
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/workspace/characters')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Characters
          </Button>
          <h1 className="text-2xl font-bold">Loading Character...</h1>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-6'>
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/workspace/characters')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Characters
          </Button>
          <h1 className="text-2xl font-bold">Error</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className='p-6'>
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/workspace/characters')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Characters
          </Button>
          <h1 className="text-2xl font-bold">Character Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>The character you're looking for doesn't exist or has been deleted.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/workspace/characters')}>
              Go Back to Characters
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/workspace/characters')}
          className=""
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Characters
        </Button>
        <div className='flex space-x-3'>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isSubmitting}
          >
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {showDeleteConfirm && (
        <Card className="mb-6 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Confirm Deletion</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Are you sure you want to delete "{formData.name} {formData.surname}"? This action cannot be undone.</p>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Character'}
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <form ref={formRef} className="space-y-8" onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Edit Character</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter character name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="surname" className="text-sm font-medium">
                  Surname
                </label>
                <Input
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="Enter character surname"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="nickname" className="text-sm font-medium">
                Nickname
              </label>
              <Input
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="Enter character nickname"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender || ''}
                onChange={handleGenderChange}
                className="bg-skin-primary w-full rounded-md border border-input px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              >
                <option value="">Select gender</option>
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="race" className="text-sm font-medium">
                Race
              </label>
              <select
                id="race"
                name="race"
                value={formData.race?.id || ''}
                onChange={handleRaceChange}
                className="bg-skin-primary w-full rounded-md border border-input px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              >
                <option value="">Select race</option>
                {Object.values(races).map((race: Race) => (
                  <option key={race.id} value={race.id}>
                    {race.name}
                  </option>
                ))}
              </select>
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm">{errors.submit}</p>
            )}
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

export default CharacterDetails
