import React from 'react';

type ConclusionType = 'happy' | 'sad' | 'cliffhanger' | 'open' | 'custom';

interface StoryEndingOptionsProps {
  onSelectEndingType: (type: ConclusionType | string, customPrompt?: string) => void;
  isLoading?: boolean;
}

const predefinedEndingTypes: { value: ConclusionType; label: string; description: string }[] = [
  {
    value: 'happy',
    label: 'Happy Ending',
    description: 'A generally positive and uplifting conclusion.',
  },
  {
    value: 'sad',
    label: 'Sad or Bittersweet Ending',
    description: 'An emotional, perhaps melancholic, resolution.',
  },
  {
    value: 'cliffhanger',
    label: 'Cliffhanger',
    description: 'Ends on a moment of suspense, leaving questions.',
  },
  {
    value: 'open',
    label: 'Open Ending',
    description: 'Leaves the ultimate outcome ambiguous or to interpretation.',
  },
];

const StoryEndingOptions: React.FC<StoryEndingOptionsProps> = ({
  onSelectEndingType,
  isLoading,
}) => {
  const [customPrompt, setCustomPrompt] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<ConclusionType | string>('');

  const handleSelect = (type: ConclusionType | string) => {
    setSelectedType(type);
    if (type !== 'custom') {
      onSelectEndingType(type);
      setCustomPrompt(''); // Clear custom prompt if a predefined type is selected
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onSelectEndingType('custom', customPrompt.trim());
    }
  };

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Choose a Story Ending Style</h3>
      <div className="space-y-3">
        {predefinedEndingTypes.map(option => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            disabled={isLoading}
            className={`w-full text-left p-3 rounded-md border transition-colors
                        ${
                          selectedType === option.value
                            ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-500'
                            : 'bg-white border-gray-300 hover:bg-purple-50 hover:border-purple-300'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <p className="font-medium text-gray-800">{option.label}</p>
            <p className="text-xs text-gray-500">{option.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-sm font-medium text-gray-700 mb-1">
          Or, describe your own ending style:
        </p>
        <form onSubmit={handleCustomSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={customPrompt}
            onChange={e => {
              setCustomPrompt(e.target.value);
              setSelectedType('custom'); // Select custom when user types
            }}
            placeholder="e.g., 'a mysterious discovery', 'a peaceful resolution'"
            className="input-field flex-grow"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !customPrompt.trim()}
            className={`btn-secondary px-3 py-2 text-sm ${selectedType === 'custom' && customPrompt.trim() ? 'ring-2 ring-purple-500' : ''}`}
          >
            Use Custom
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoryEndingOptions;
