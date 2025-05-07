import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Chart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';

import { RootState } from '../../store'
import { fetchStories, updateStory, deleteStory } from '../../store/slices/storySlice'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Trash, BookOpen, LayoutList, Clock, Sparkles, BookText } from 'lucide-react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { Story } from '@/models'

const StoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { stories, isLoading, error } = useSelector((state: RootState) => state.stories)

  const [formData, setFormData] = useState<Story | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [timelineState, setTimelineState] = useState({

    series: [
      {
        data: [
          {
            x: 'Code',
            y: [
              new Date('2019-03-02').getTime(),
              new Date('2019-03-04').getTime()
            ],
            fillColor: '#00E396'
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-04').getTime(),
              new Date('2019-03-08').getTime()
            ]
          },
          {
            x: 'Validation',
            y: [
              new Date('2019-03-08').getTime(),
              new Date('2019-03-12').getTime()
            ]
          },
          {
            x: 'Deployment',
            y: [
              new Date('2019-03-12').getTime(),
              new Date('2019-03-18').getTime()
            ]
          }
        ]
      }
    ],
    options: {
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            hideOverflowingLabels: false
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val: any, opt: any) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
        }
      },
      xaxis: {
        type: 'datetime'
      }
    },
  });


  useEffect(() => {
    // If we don't have the story in the store, fetch all stories
    if (!id || (Object.keys(stories).length > 0 && stories[id])) {
      // Story exists in the store, set it as form data
      if (id && stories[id] && !formData) {
        setFormData(stories[id])
      }
    } else {
      // Story doesn't exist in the store, fetch all stories
      dispatch(fetchStories())
    }
  }, [dispatch, id, stories, formData])

  // Update form data when stories are loaded
  useEffect(() => {
    if (id && stories[id] && !formData) {
      setFormData(stories[id])
    }
  }, [id, stories, formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const validateForm = () => {
    if (!formData) return { form: 'No data to submit' }

    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
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
      await dispatch(updateStory({ id: id, storyData: formData })).unwrap()
      // Show success message or notification
    } catch (error) {
      console.error('Failed to update story:', error)
      setErrors({ submit: 'Failed to update story. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return

    setIsSubmitting(true)

    try {
      await dispatch(deleteStory(id)).unwrap()
      navigate('/workspace/stories')
    } catch (error) {
      console.error('Failed to delete story:', error)
      setErrors({ submit: 'Failed to delete story. Please try again.' })
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
            onClick={() => navigate('/workspace/stories')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Stories
          </Button>
          <h1 className="text-2xl font-bold">Loading Story...</h1>
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
            onClick={() => navigate('/workspace/stories')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Stories
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
            onClick={() => navigate('/workspace/stories')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Stories
          </Button>
          <h1 className="text-2xl font-bold">Story Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>The story you're looking for doesn't exist or has been deleted.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/workspace/stories')}>
              Go Back to Stories
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
          onClick={() => navigate('/workspace/stories')}
          className=""
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Stories
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
            <p>Are you sure you want to delete "{formData.title}"? This action cannot be undone.</p>
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
              {isSubmitting ? 'Deleting...' : 'Delete Story'}
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        {errors.submit && (
          <p className="text-red-500 text-sm">{errors.submit}</p>
        )}
        <form ref={formRef} className="space-y-8" onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Edit Story</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="w-full justify-start mb-4">
                  <TabsTrigger value="basic" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                    Basic Info
                  </TabsTrigger>
                <TabsTrigger value="structure" className="flex items-center gap-2">
                  <LayoutList className="h-4 w-4" />
                  Structure
                </TabsTrigger>
                <TabsTrigger value="themes" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Themes
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="chapters" className="flex items-center gap-2">
                  <BookText className="h-4 w-4" />
                  Chapters
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter story title"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="logline" className="text-sm font-medium">
                    Logline
                  </label>
                  <Textarea
                    id="logline"
                    name="logline"
                    value={formData.logline}
                    onChange={handleChange}
                    placeholder="When [inciting incident] happens to [protagonist], they must [objective], or else [stakes] - but [obstacle] stands in their way"
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    A concise summary of your story that captures its essence and hooks the reader.
                  </p>
                </div>
              </TabsContent>

              {/* Structure Tab */}
              <TabsContent value="structure" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="promise" className="text-sm font-medium">
                    Promise
                  </label>
                  <Textarea
                    id="promise"
                    name="promise"
                    value={formData.promise}
                    onChange={handleChange}
                    placeholder="What does your story promise to the reader?"
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    The implicit agreement you make with your reader about what kind of experience they'll have.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="plot" className="text-sm font-medium">
                    Plot
                  </label>
                  <Textarea
                    id="plot"
                    name="plot"
                    value={formData.plot}
                    onChange={handleChange}
                    placeholder="What happens in your story?"
                    className="min-h-[200px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    The sequence of events that make up your story.
                  </p>
                </div>
              </TabsContent>

              {/* Themes Tab */}
              <TabsContent value="themes" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="emotional_matter" className="text-sm font-medium">
                    Emotional Matter
                  </label>
                  <Textarea
                    id="emotional_matter"
                    name="emotional_matter"
                    value={formData.emotional_matter}
                    onChange={handleChange}
                    placeholder="Why does this matter to the protagonist?"
                    className="min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    The emotional stakes and significance for your protagonist.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="universal_truth" className="text-sm font-medium">
                    Universal Truth
                  </label>
                  <Textarea
                    id="universal_truth"
                    name="universal_truth"
                    value={formData.universal_truth}
                    onChange={handleChange}
                    placeholder="What universal truth does this reveal about human nature?"
                    className="min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    The deeper meaning or insight about human nature that your story explores.
                  </p>
                </div>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="timeline" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Story Timeline</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Visualize the key events and phases of your story.
                  </p>
                  <Chart
                    options={timelineState.options as ApexOptions}
                    series={timelineState.series}
                    type="rangeBar"
                    height={400}
                  />
                </div>
              </TabsContent>

              {/* Chapters Tab */}
              <TabsContent value="chapters" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Chapters</h3>
                  <p className="text-muted-foreground text-sm">
                    {formData.chapters && formData.chapters.length > 0 ? (
                      `Your story has ${formData.chapters.length} chapters.`
                    ) : (
                      "You haven't created any chapters for this story yet."
                    )}
                  </p>
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" type="button">
                      Manage Chapters
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

export default StoryDetails


