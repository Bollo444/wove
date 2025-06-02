import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStory } from '../../contexts/StoryContext';
import { useAuth } from '../../contexts/AuthContext'; // For user's age tier
import { AgeTier } from '@shared/types/age-tier';
import { Premise } from '../../types/story.d';

// Hardcoded options (as per plan)
const availableGenres = ['Fantasy', 'Sci-Fi', 'Mystery', 'Adventure', 'Slice of Life', 'Humor', 'Historical'];
const collaborationModes = [
  { id: 'solo_ai', name: 'Solo (AI-assisted)' },
  { id: 'solo_user_only', name: 'Solo (User only)' },
  { id: 'multi_user_ai', name: 'Multi-user (AI-assisted)' },
  { id: 'multi_user_only', name: 'Multi-user (User only)' },
];
const endingPreferences = [
  { id: 'user_controlled', name: 'User Controlled' },
  { id: 'ai_controlled', name: 'AI Controlled' },
  { id: 'random', name: 'Random' },
];
const initialStyles = ['Narrative', 'Descriptive', 'Witty', 'Whimsical', 'Gritty'];


interface StoryCreateFormProps {
  premiseId?: string | null;
}

// Matches CreateStoryData in StoryContext (will need to update that too)
interface StoryCreateFormData {
  customTitle: string;
  customPremise: string;
  ageTierSetting: AgeTier | '';
  genres: string[]; // Changed from genreIds
  collaborationMode: string;
  endingPreference: string;
  initialStyle: string;
  // isPrivate is not in API doc for POST /stories, seems to be a display/filter concern post-creation
}

const StoryCreateForm: React.FC<StoryCreateFormProps> = ({ premiseId }) => {
  const { user } = useAuth();
  const { createStory, isLoading, premises, loadPremiseById } = useStory(); // Assuming loadPremiseById exists or can be added
  const router = useRouter();
  
  const [selectedPremise, setSelectedPremise] = useState<Premise | null>(null);
  const [isFetchingPremise, setIsFetchingPremise] = useState(false);

  const [formData, setFormData] = useState<StoryCreateFormData>({
    customTitle: '',
    customPremise: '',
    ageTierSetting: '',
    genres: [],
    collaborationMode: collaborationModes[0].id, // Default
    endingPreference: endingPreferences[0].id, // Default
    initialStyle: initialStyles[0], // Default
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (premiseId) {
      setIsFetchingPremise(true);
      // Try to find premise in already loaded list, or fetch it
      // For now, assuming a function like loadPremiseById or similar might exist in context
      // or that `premises` in context is the list of all available premises.
      const foundPremise = premises.find(p => p.premiseId === premiseId);
      if (foundPremise) {
        setSelectedPremise(foundPremise);
        setFormData(prev => ({
          ...prev,
          customTitle: foundPremise.title, // Pre-fill title from premise
          customPremise: foundPremise.description, // Pre-fill description
          ageTierSetting: foundPremise.ageTier as AgeTier, // Pre-fill age tier
          genres: [...foundPremise.genre], // Pre-fill genres
          // Potentially pre-fill other fields or derive them
        }));
        setIsFetchingPremise(false);
      } else {
        // Placeholder: if loadPremiseById existed in StoryContext:
        // loadPremiseById(premiseId).then(setSelectedPremise).catch(err => setError("Failed to load premise details."));
        console.warn(`Premise with ID ${premiseId} not found in pre-loaded premises. Implement fetching by ID.`);
        setError(`Details for premise ID ${premiseId} could not be loaded. Try creating a custom story.`);
        setIsFetchingPremise(false);
      }
    }
    // Set default ageTier based on user's verified age if creating custom story
    if (!premiseId && user?.isAgeVerified) {
      setFormData(prev => ({ ...prev, ageTierSetting: user.ageTier as AgeTier || '' }));
    }
  }, [premiseId, premises, user]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (genreName: string) => {
    setFormData(prev => {
      const newGenres = prev.genres.includes(genreName)
        ? prev.genres.filter(g => g !== genreName)
        : [...prev.genres, genreName];
      return { ...prev, genres: newGenres };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!selectedPremise && !formData.customTitle) {
      setError('Title is required for a custom story.');
      return;
    }
    if (!formData.ageTierSetting) {
      setError('Age Tier is required.');
      return;
    }
    if (formData.genres.length === 0) {
        setError('Please select at least one genre.');
        return;
    }

    const storyToCreate = {
      premiseId: selectedPremise?.premiseId,
      customTitle: selectedPremise ? undefined : formData.customTitle,
      customPremise: selectedPremise ? undefined : formData.customPremise,
      ageTierSetting: formData.ageTierSetting as string, // Ensure it's string for API
      genres: formData.genres,
      collaborationMode: formData.collaborationMode,
      endingPreference: formData.endingPreference,
      initialStyle: formData.initialStyle,
    };
    
    try {
      // Type assertion for createStory payload can be done here or ensure CreateStoryData in context is up-to-date
      const createdStory = await createStory(storyToCreate as any); 
      
      setSuccessMessage(`Story "${createdStory.title}" initiated successfully! Redirecting...`);
      // API POST /stories response has storyId and initialScene. We need storyId for redirection.
      router.push(`/story/${createdStory.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create story.');
    }
  };
  
  if (isFetchingPremise) {
    return <div className="text-center p-8">Loading premise details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        {selectedPremise ? 'Start Story from Premise' : 'Create a New Custom Story'}
      </h1>
      {selectedPremise && (
        <div className="mb-6 p-4 border border-purple-200 bg-purple-50 rounded-md">
          <h2 className="text-xl font-semibold text-purple-700">{selectedPremise.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{selectedPremise.description}</p>
          <p className="text-xs text-gray-500 mt-1">Genres: {selectedPremise.genre.join(', ')}</p>
          <p className="text-xs text-gray-500">Age Tier: {selectedPremise.ageTier.toUpperCase()}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

        {!selectedPremise && (
          <>
            <div>
              <label htmlFor="customTitle" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" name="customTitle" id="customTitle" value={formData.customTitle} onChange={handleChange} required className="input-field" disabled={isLoading} />
            </div>
            <div>
              <label htmlFor="customPremise" className="block text-sm font-medium text-gray-700 mb-1">Brief Description / Premise</label>
              <textarea name="customPremise" id="customPremise" rows={3} value={formData.customPremise} onChange={handleChange} className="input-field" disabled={isLoading}></textarea>
            </div>
          </>
        )}
        
        <div>
          <label htmlFor="genres" className="block text-sm font-medium text-gray-700 mb-1">Genres (Select up to 3)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            {availableGenres.map(genreName => (
              <label key={genreName} className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" value={genreName} checked={formData.genres.includes(genreName)} onChange={() => handleGenreChange(genreName)}
                  disabled={isLoading || (formData.genres.length >= 3 && !formData.genres.includes(genreName))}
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                <span className="text-sm text-gray-700">{genreName}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="ageTierSetting" className="block text-sm font-medium text-gray-700 mb-1">Target Age Tier</label>
          <select name="ageTierSetting" id="ageTierSetting" value={formData.ageTierSetting} onChange={handleChange} required className="input-field" disabled={isLoading || !!selectedPremise}>
            <option value="" disabled>Select an age tier</option>
            {/* TODO: Filter based on user's verified ageTier */}
            <option value={AgeTier.KIDS}>Kids</option>
            <option value={AgeTier.TEENS}>Teens</option>
            <option value={AgeTier.ADULTS}>Adults</option>
          </select>
        </div>

        <div>
          <label htmlFor="collaborationMode" className="block text-sm font-medium text-gray-700 mb-1">Collaboration Mode</label>
          <select name="collaborationMode" id="collaborationMode" value={formData.collaborationMode} onChange={handleChange} className="input-field" disabled={isLoading}>
            {collaborationModes.map(mode => <option key={mode.id} value={mode.id}>{mode.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="endingPreference" className="block text-sm font-medium text-gray-700 mb-1">Ending Preference</label>
          <select name="endingPreference" id="endingPreference" value={formData.endingPreference} onChange={handleChange} className="input-field" disabled={isLoading}>
            {endingPreferences.map(ep => <option key={ep.id} value={ep.id}>{ep.name}</option>)}
          </select>
        </div>
        
        <div>
          <label htmlFor="initialStyle" className="block text-sm font-medium text-gray-700 mb-1">Initial Writing Style</label>
          <select name="initialStyle" id="initialStyle" value={formData.initialStyle} onChange={handleChange} className="input-field" disabled={isLoading}>
            {initialStyles.map(style => <option key={style} value={style.toLowerCase()}>{style}</option>)}
          </select>
        </div>

        {/* isPrivate is not in API spec for POST /stories - handled by server or different mechanism */}

        <div>
          <button type="submit" disabled={isLoading} className="w-full btn-primary">
            {isLoading ? 'Initiating Story...' : 'Initiate Story & Start Writing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoryCreateForm;
