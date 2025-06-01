import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStory } from '../../contexts/StoryContext';
import { AgeTier } from '@shared/types/age-tier'; // Assuming shared types

// Placeholder for available genres - in a real app, this might come from an API or config
const availableGenres = [
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'sci-fi', name: 'Sci-Fi' },
  { id: 'mystery', name: 'Mystery' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'humor', name: 'Humor' },
  { id: 'historical', name: 'Historical Fiction' },
];

interface StoryCreateFormData {
  title: string;
  description: string;
  ageTier: AgeTier | '';
  genreIds: string[];
  isPrivate: boolean;
  coverImageUrl?: string; // Optional, could be added later or via a separate upload step
}

const StoryCreateForm: React.FC = () => {
  const [formData, setFormData] = useState<StoryCreateFormData>({
    title: '',
    description: '',
    ageTier: '',
    genreIds: [],
    isPrivate: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { createStory, isLoading } = useStory();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGenreChange = (genreId: string) => {
    setFormData(prev => {
      const newGenreIds = prev.genreIds.includes(genreId)
        ? prev.genreIds.filter(id => id !== genreId)
        : [...prev.genreIds, genreId];
      return { ...prev, genreIds: newGenreIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!formData.title || !formData.ageTier) {
      setError('Title and Age Tier are required.');
      return;
    }
    
    try {
      const createdStory = await createStory({
        title: formData.title,
        description: formData.description,
        ageTier: formData.ageTier as string,
        isPrivate: formData.isPrivate,
        genreIds: formData.genreIds,
      });
      
      setSuccessMessage(`Story "${createdStory.title}" created successfully! Redirecting...`);
      
      // Redirect to the story page after a short delay
      setTimeout(() => {
        router.push(`/story/${createdStory.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create story.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Create a New Story</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input-field"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Brief Description (Optional)
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="input-field"
            disabled={isLoading}
          ></textarea>
        </div>

        <div>
          <label htmlFor="ageTier" className="block text-sm font-medium text-gray-700 mb-1">
            Target Age Tier
          </label>
          <select
            name="ageTier"
            id="ageTier"
            value={formData.ageTier}
            onChange={handleChange}
            required
            className="input-field"
            disabled={isLoading}
          >
            <option value="" disabled>
              Select an age tier
            </option>
            <option value={AgeTier.KIDS}>Kids (Under 13)</option>
            <option value={AgeTier.TEENS}>Teens (13-17)</option>
            <option value={AgeTier.ADULTS}>Adults (18+)</option>
            <option value={AgeTier.UNVERIFIED}>Unverified/All Ages</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genres (Select up to 3)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            {availableGenres.map(genre => (
              <label
                key={genre.id}
                className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="genreIds"
                  value={genre.id}
                  checked={formData.genreIds.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                  disabled={
                    isLoading ||
                    (formData.genreIds.length >= 3 && !formData.genreIds.includes(genre.id))
                  }
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{genre.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="isPrivate"
            name="isPrivate"
            type="checkbox"
            checked={formData.isPrivate}
            onChange={handleChange}
            disabled={isLoading}
            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
            Make this story private (only visible to you and collaborators)
          </label>
        </div>

        <div>
          <button type="submit" disabled={isLoading} className="w-full btn-primary">
            {isLoading ? 'Creating Story...' : 'Create Story & Start Writing'}
          </button>
        </div>
      </form>
    </div>
  );
};
// .input-field and .btn-primary should be in globals.css or a shared stylesheet
export default StoryCreateForm;
