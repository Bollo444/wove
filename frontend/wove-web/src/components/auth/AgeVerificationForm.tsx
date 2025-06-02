import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Placeholder, will be properly defined later
// import { AgeVerificationRequestDto } from '@shared/types/verification'; // Removed as it does not exist

const AgeVerificationForm: React.FC = () => {
  const [verificationType, setVerificationType] = useState<'id_upload' | 'google_sso' | 'parental_consent_email'>(
    'id',
  );
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { submitAgeVerification } = useAuth(); // Assuming a generic function in AuthContext

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      let payload: { method: string; verificationData: any } = {
        method: verificationType,
        verificationData: {},
      };

      if (verificationType === 'id_upload') {
        if (!file) {
          setError('Please select a file for ID verification.');
          setIsLoading(false);
          return;
        }
        try {
          const base64String = await fileToBase64(file);
          payload.verificationData = {
            document: base64String, // Base64 encoded file
            fileName: file.name,
            fileType: file.type,
          };
          await submitAgeVerification(payload.method, payload.verificationData);
          setSuccessMessage('ID document submitted for verification. You will be notified once reviewed.');
        } catch (conversionError) {
          console.error('Error converting file to Base64:', conversionError);
          setError('Failed to process ID document. Please try again.');
          setIsLoading(false);
          return;
        }

      } else if (verificationType === 'google_sso') {
        // Client might just inform the backend to initiate, or redirect.
        // AuthContext's submitAgeVerification would handle the specifics.
        // Example: payload.verificationData could include a redirect_uri if needed by backend.
        await submitAgeVerification(payload.method, payload.verificationData);
        setSuccessMessage('Redirecting to Google for age verification... Follow the prompts.');
        // Actual redirection would likely happen within the AuthContext function

      } else if (verificationType === 'parental_consent_email') {
        // This might require collecting a parent's email if not already on file,
        // or simply be a trigger if the user is a child awaiting consent.
        // For this example, let's assume it's a trigger. AuthContext might need user's details.
        // payload.verificationData could contain childUserId or similar if an admin/parent is triggering this.
        // If the user themselves are re-requesting, it might be simpler.
        await submitAgeVerification(payload.method, payload.verificationData);
        setSuccessMessage('Parental consent request processed. Please check the parent/guardian email for further steps.');
      }
    } catch (err: any) {
      setError(err.message || 'Age verification submission failed.');
    } finally {
      setIsLoading(false);
    }
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
            onChange={e => setVerificationType(e.target.value as 'id_upload' | 'google_sso' | 'parental_consent_email')}
            className="input-field"
            disabled={isLoading}
          >
            <option value="id_upload">Upload ID Document</option>
            <option value="google_sso">Verify with Google</option>
            <option value="parental_consent_email">Request Parental Consent (if applicable)</option>
          </select>
        </div>

        {verificationType === 'id_upload' && (
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

        {verificationType === 'google_sso' && (
          <p className="text-sm text-gray-600 mb-4">
            You will be redirected to Google to verify your age using your Google account
            information.
          </p>
        )}

        {verificationType === 'parental_consent_email' && (
          <p className="text-sm text-gray-600 mb-4">
            This option is typically used if you are under a certain age and require a parent or
            guardian to consent. Further instructions would be provided based on your account
            status.
          </p>
        )}

        <button type="submit" disabled={isLoading} className="w-full btn-primary">
          {isLoading
            ? 'Processing...'
            : verificationType === 'google_sso'
              ? 'Continue with Google'
              : 'Submit Verification Request'}
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
