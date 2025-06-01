import React, { useState } from 'react';
// import { useAuth } from '../../contexts/AuthContext'; // Placeholder
// import { AgeVerificationRequestDto } from '@shared/types/verification'; // Assuming shared DTO

const AgeVerificationForm: React.FC = () => {
  const [verificationType, setVerificationType] = useState<'id' | 'google' | 'parent_consent'>(
    'id',
  );
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // const { submitAgeVerification, triggerGoogleAgeVerification } = useAuth(); // Placeholder

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (verificationType === 'id' && !file) {
      setError('Please select a file for ID verification.');
      return;
    }

    setIsLoading(true);
    // Placeholder for submission logic
    console.log('Submitting age verification:', { verificationType, file });
    // try {
    //   if (verificationType === 'id' && file) {
    //     const formData = new FormData();
    //     formData.append('document', file);
    //     formData.append('verificationMethod', 'id_document');
    //     // await submitAgeVerification(formData); // This would be an API call
    //     setSuccessMessage('ID document submitted for verification.');
    //   } else if (verificationType === 'google') {
    //     // await triggerGoogleAgeVerification(); // This would redirect to Google OAuth
    //     setSuccessMessage('Redirecting to Google for age verification...');
    //   } else if (verificationType === 'parent_consent') {
    //     // This flow might be different, e.g., initiated by parent
    //     setSuccessMessage('Parental consent flow initiated (placeholder).');
    //   }
    // } catch (err: any) {
    //   setError(err.message || 'Age verification submission failed.');
    // } finally {
    //   setIsLoading(false);
    // }
    setTimeout(() => {
      // Simulate API call
      setIsLoading(false);
      setError('Age verification functionality not yet implemented.');
    }, 1000);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Verify Your Age</h2>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Verification Method
          </label>
          <select
            value={verificationType}
            onChange={e => setVerificationType(e.target.value as any)}
            className="input-field"
            disabled={isLoading}
          >
            <option value="id">Upload ID Document</option>
            <option value="google">Verify with Google</option>
            <option value="parent_consent">Request Parental Consent (if applicable)</option>
          </select>
        </div>

        {verificationType === 'id' && (
          <div className="mb-4">
            <label htmlFor="idDocument" className="block text-sm font-medium text-gray-700 mb-1">
              ID Document (e.g., Driver's License, Passport)
            </label>
            <input
              type="file"
              id="idDocument"
              name="idDocument"
              onChange={handleFileChange}
              accept="image/*,.pdf"
              required
              className="mt-1 block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-purple-50 file:text-purple-700
                         hover:file:bg-purple-100"
              disabled={isLoading}
            />
            {file && <p className="text-xs text-gray-500 mt-1">Selected: {file.name}</p>}
          </div>
        )}

        {verificationType === 'google' && (
          <p className="text-sm text-gray-600 mb-4">
            You will be redirected to Google to verify your age using your Google account
            information.
          </p>
        )}

        {verificationType === 'parent_consent' && (
          <p className="text-sm text-gray-600 mb-4">
            This option is typically used if you are under a certain age and require a parent or
            guardian to consent. Further instructions would be provided based on your account
            status.
          </p>
        )}

        <button type="submit" disabled={isLoading} className="w-full btn-primary">
          {isLoading
            ? 'Submitting...'
            : verificationType === 'google'
              ? 'Continue with Google'
              : 'Submit for Verification'}
        </button>
      </form>
      <p className="mt-4 text-xs text-gray-500 text-center">
        Your information will be handled securely and in accordance with our privacy policy.
      </p>
    </div>
  );
};

// Add .input-field and .btn-primary to globals.css or a shared stylesheet
// .input-field {
//   @apply mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm;
// }
// .btn-primary {
//  @apply w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50;
// }

export default AgeVerificationForm;
