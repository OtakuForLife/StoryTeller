import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { fetchPlaces, updatePlace, deletePlace } from '../../store/slices/placeSlice'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Trash } from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { Place } from '@/models'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

const PlaceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { places, isLoading, error } = useSelector((state: RootState) => state.places)
  const [formData, setFormData] = useState<Place | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    dispatch(fetchPlaces())
  }, [dispatch])

  useEffect(() => {
    if (id && places[id]) {
      setFormData(places[id])
    }
  }, [id, places])

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading place details...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!formData) {
    return <div className="text-red-500">Place not found</div>
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      if (!prev) return null
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parentId = e.target.value
    setFormData(prev => {
      if (!prev) return null
      if (parentId === '') {
        return {
          ...prev,
          parent: undefined
        }
      } else {
        return {
          ...prev,
          parent: places[parentId]
        }
      }
    })
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
      await dispatch(updatePlace({ id, placeData: formData })).unwrap()
      // Show success message or notification
    } catch (error) {
      console.error('Failed to update place:', error)
      setErrors({ submit: 'Failed to update place. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return

    setIsSubmitting(true)

    try {
      await dispatch(deletePlace(id)).unwrap()
      navigate('/workspace/places')
    } catch (error) {
      console.error('Failed to delete place:', error)
      setErrors({ submit: 'Failed to delete place. Please try again.' })
    } finally {
      setIsSubmitting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className='p-6'>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/workspace/places')}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Places
        </Button>
        <h1 className="text-2xl font-bold">{formData.name}</h1>
      </div>

      <Card>
        <form ref={formRef} className="space-y-8" onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Edit Place</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter place name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="adjectives" className="text-sm font-medium">
                Adjectives
              </label>
              <Textarea
                id="adjectives"
                name="adjectives"
                value={formData.adjectives}
                onChange={handleChange}
                placeholder="Enter adjectives describing this place"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="parent" className="text-sm font-medium">
                Parent Location
              </label>
              <select
                id="parent"
                name="parent"
                value={formData.parent?.id || ''}
                onChange={handleParentChange}
                className="bg-skin-primary w-full rounded-md border border-input px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              >
                <option value="">None (Top-level location)</option>
                {Object.values(places)
                  .filter(place => place.id !== formData.id) // Prevent selecting itself as parent
                  .map((place: Place) => (
                    <option key={place.id} value={place.id}>
                      {place.name}
                    </option>
                  ))}
              </select>
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm">{errors.submit}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Place
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the place
                    and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default PlaceDetails
