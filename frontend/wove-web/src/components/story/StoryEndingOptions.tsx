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
    <div className="my-6 p-4 bg-gray-50 rounded-lg shadow" data-oid="9e:-7zw">
      <h3 className="text-lg font-semibold text-gray-700 mb-3" data-oid="ntd3u-t">
        Choose a Story Ending Style
      </h3>
      <div className="space-y-3" data-oid="xnk.x_1">
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
            data-oid="gi7d2gr"
          >
            <p className="font-medium text-gray-800" data-oid="30-9l4k">
              {option.label}
            </p>
            <p className="text-xs text-gray-500" data-oid="k6j7vy_">
              {option.description}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t" data-oid="n_nh_og">
        <p className="text-sm font-medium text-gray-700 mb-1" data-oid="8lqiu9u">
          Or, describe your own ending style:
        </p>
        <form
          onSubmit={handleCustomSubmit}
          className="flex items-center space-x-2"
          data-oid="zr8cm4a"
        >
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
            data-oid="xhh5e02"
          />

          <button
            type="submit"
            disabled={isLoading || !customPrompt.trim()}
            className={`btn-secondary px-3 py-2 text-sm ${selectedType === 'custom' && customPrompt.trim() ? 'ring-2 ring-purple-500' : ''}`}
            data-oid="axrjdi5"
          >
            Use Custom
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoryEndingOptions;
