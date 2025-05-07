import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { createPlace } from '@/store/slices/placeSlice';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Place } from '@/models';
import { fetchPlaces } from '@/store/slices/placeSlice';

const NewPlace: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { places } = useSelector((state: RootState) => state.places || { places: {} });

  const [formData, setFormData] = useState<Partial<Place>>({
    id: '',
    name: '',
    adjectives: '',
    parent: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parentId = e.target.value;
    if (parentId === '') {
      setFormData(prev => ({
        ...prev,
        parent: undefined
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        parent: places[parentId]
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(createPlace(formData)).unwrap();
      navigate('/workspace/places');
    } catch (error) {
      console.error('Failed to create place:', error);
      setErrors({ submit: 'Failed to create place. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='p-6 px-40'>
      <h1 className="text-2xl font-bold pb-3">Create New Place</h1>
      <Card>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Place Details</CardTitle>
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
                placeholder="Enter adjectives describing this place (e.g., spacious, dark, ancient)"
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
                {Object.values(places).map((place: Place) => (
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
          <CardFooter className="flex justify-center">
            <div className="flex justify-between space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/workspace/places')}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Place'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewPlace;
