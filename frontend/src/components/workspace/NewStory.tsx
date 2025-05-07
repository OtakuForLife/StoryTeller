import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStory } from '../../store/slices/storySlice'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dices } from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { Story } from '@/models'
import { generateRandomTitle } from '@/models/Story'

const NewStory: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<Story>({
    id: '',
    title: '',
    promise: '',
    plot: '',
    emotional_matter: '',
    universal_truth: '',
    logline: '',
    events: [],
    chapters: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
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
      await dispatch(createStory(formData)).unwrap()
      navigate('/workspace/stories')
    } catch (error) {
      console.error('Failed to create story:', error)
      setErrors({ submit: 'Failed to create story. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='p-6'>
      <h1 className="text-2xl font-bold pb-3">Create New Story</h1>
      <Card>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Story Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <div className='flex row'>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter story title"
                className={errors.title ? "border-red-500" : ""}
              />
              <Button type="button" variant="outline" onClick={() => {formData.title = generateRandomTitle(); setFormData({...formData})}}>
                <Dices className="h-4 w-4" />
              </Button>

              </div>
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="logline" className="text-sm font-medium">
                Logline
              </label>
              <textarea
                id="logline"
                name="logline"
                value={formData.logline}
                onChange={handleChange}
                placeholder="When [inciting incident] happens to [protagonist], they must [objective], or else [stakes] - but [obstacle] stands in their way"
                className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="promise" className="text-sm font-medium">
                Promise
              </label>
              <textarea
                id="promise"
                name="promise"
                value={formData.promise}
                onChange={handleChange}
                placeholder="What does your story promise to the reader?"
                className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="plot" className="text-sm font-medium">
                Plot
              </label>
              <textarea
                id="plot"
                name="plot"
                value={formData.plot}
                onChange={handleChange}
                placeholder="What happens in your story?"
                className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="emotional_matter" className="text-sm font-medium">
                Emotional Matter
              </label>
              <textarea
                id="emotional_matter"
                name="emotional_matter"
                value={formData.emotional_matter}
                onChange={handleChange}
                placeholder="Why does this matter to the protagonist?"
                className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="universal_truth" className="text-sm font-medium">
                Universal Truth
              </label>
              <textarea
                id="universal_truth"
                name="universal_truth"
                value={formData.universal_truth}
                onChange={handleChange}
                placeholder="What universal truth does this reveal about human nature?"
                className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              />
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
              onClick={() => navigate('/workspace/stories')}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Story'}
            </Button></div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default NewStory
