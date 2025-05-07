import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { createCharacter } from '@/store/slices/characterSlice';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dices } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Character, Gender, Race } from '@/models';
import { fetchRaces } from '@/store/slices/raceSlice';
import { generateRandomName } from '@/models/Character';

const NewCharacter: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { races } = useSelector((state: RootState) => state.races || { races: {} })

  const [formData, setFormData] = useState<Partial<Character>>({
    id: '',
    name: '',
    surname: '',
    nickname: '',
    gender: undefined,
    race: undefined
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchRaces())
  }, [dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

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
    const raceId = e.target.value
    if (raceId === '') {
      setFormData(prev => ({
        ...prev,
        race: undefined
      }))
    } else {
      const selectedRace = Object.values(races).find(race => race.id === raceId)
      setFormData(prev => ({
        ...prev,
        race: selectedRace
      }))
    }
  }

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genderValue = e.target.value
    if (genderValue === '') {
      setFormData(prev => ({
        ...prev,
        gender: undefined
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        gender: genderValue as Gender
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await dispatch(createCharacter(formData)).unwrap()
      navigate('/workspace/characters')
    } catch (error) {
      console.error('Failed to create character:', error)
      setErrors({ submit: 'Failed to create character. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGenerateRandomName = () => {
    const { firstName, surname } = generateRandomName()
    setFormData(prev => ({
      ...prev,
      name: firstName,
      surname: surname
    }))
  }

  return (
    <div className='p-6'>
      <h1 className="text-2xl font-bold pb-3">Create New Character</h1>
      <Card>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Character Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className='flex row'>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter character name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="surname" className="text-sm font-medium">
                  Surname
                </label>
                <div className='flex row'>
                  <Input
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Enter character surname"
                  />
                  <Button type="button" variant="outline" onClick={handleGenerateRandomName}>
                    <Dices className="h-4 w-4" />
                  </Button>
                </div>
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
          <CardFooter className="flex justify-center">
            <div className="flex justify-between space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/workspace/characters')}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Character'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default NewCharacter
