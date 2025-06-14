'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStory } from '../../contexts/StoryContext';
import { AgeTier } from 'shared';

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

interface ValidationErrors {
  title?: string;
  description?: string;
  ageTier?: string;
  genreIds?: string;
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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createStory, isLoading } = useStory();
  const router = useRouter();

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters long';
    } else if (formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    if (!formData.ageTier) {
      errors.ageTier = 'Age tier is required';
    }

    if (formData.genreIds.length === 0) {
      errors.genreIds = 'Please select at least one genre';
    } else if (formData.genreIds.length > 3) {
      errors.genreIds = 'Please select no more than 3 genres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleGenreChange = (genreId: string) => {
    setFormData(prev => {
      const isSelected = prev.genreIds.includes(genreId);
      const newGenreIds = isSelected
        ? prev.genreIds.filter(id => id !== genreId)
        : [...prev.genreIds, genreId];

      return { ...prev, genreIds: newGenreIds };
    });

    // Clear genre validation error
    if (validationErrors.genreIds) {
      setValidationErrors(prev => ({ ...prev, genreIds: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const storyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        ageTier: formData.ageTier as AgeTier,
        genreIds: formData.genreIds,
        isPrivate: formData.isPrivate,
        coverImageUrl: formData.coverImageUrl,
      };

      const newStory = await createStory(storyData);
      setSuccessMessage('Story created successfully! Redirecting...');

      // Redirect to the new story after a brief delay
      setTimeout(() => {
        router.push(`/story/${newStory.id}`);
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Failed to create story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Your Story</h2>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            {successMessage}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠</span>
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Story Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={isFormDisabled}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              validationErrors.title
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
            } ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Enter an engaging title for your story"
            maxLength={100}
          />

          {validationErrors.title && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">{formData.title.length}/100 characters</p>
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isFormDisabled}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-vertical ${
              validationErrors.description
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
            } ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Describe your story to attract readers..."
            maxLength={500}
          />

          {validationErrors.description && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">{formData.description.length}/500 characters</p>
        </div>

        {/* Age Tier Field */}
        <div>
          <label htmlFor="ageTier" className="block text-sm font-medium text-gray-700 mb-2">
            Target Age Group *
          </label>
          <select
            id="ageTier"
            name="ageTier"
            value={formData.ageTier}
            onChange={handleChange}
            disabled={isFormDisabled}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              validationErrors.ageTier
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
            } ${isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value="">Select target age group</option>
            <option value={AgeTier.KIDS}>Kids (6-12)</option>
            <option value={AgeTier.TEENS_U16}>Young Teens (13-15)</option>
            <option value={AgeTier.TEENS_16_PLUS}>Older Teens (16-17)</option>
            <option value={AgeTier.ADULTS}>Adults (18+)</option>
          </select>
          {validationErrors.ageTier && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.ageTier}</p>
          )}
        </div>

        {/* Genres Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Genres * (Select 1-3)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableGenres.map(genre => (
              <label
                key={genre.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.genreIds.includes(genre.id)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-gray-400'
                } ${isFormDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={formData.genreIds.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                  disabled={isFormDisabled}
                  className="sr-only"
                />

                <span className="text-sm font-medium">{genre.name}</span>
              </label>
            ))}
          </div>
          {validationErrors.genreIds && (
            <p className="mt-2 text-sm text-red-600">{validationErrors.genreIds}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">{formData.genreIds.length}/3 genres selected</p>
        </div>

        {/* Privacy Setting */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrivate"
            name="isPrivate"
            checked={formData.isPrivate}
            onChange={handleChange}
            disabled={isFormDisabled}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />

          <label htmlFor="isPrivate" className="ml-3 text-sm text-gray-700">
            Make this story private (only you can see it)
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isFormDisabled}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              isFormDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-200'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Story...
              </div>
            ) : (
              'Create Story'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoryCreateForm;
