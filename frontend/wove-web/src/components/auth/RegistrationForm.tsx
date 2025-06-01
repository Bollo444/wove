import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { AgeTier } from '@shared/types/age-tier'; // Assuming shared types

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    claimedAgeTier: AgeTier.UNVERIFIED, // Default or derive from DOB
    parentEmail: '', // Conditional
  });
  const [error, setError] = useState<string | null>(null);
  const { register, isLoading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    try {
      // Create username from first and last name for now
      const username = `${formData.firstName}${formData.lastName}`.toLowerCase().replace(/\s+/g, '');
      
      await register({
        email: formData.email,
        password: formData.password,
        username: username,
        ageTier: formData.claimedAgeTier,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
    }
  };

  // Logic to determine if parentEmail is required based on age/ageTier
  const requiresParentEmail =
    formData.claimedAgeTier === AgeTier.KIDS || formData.claimedAgeTier === AgeTier.TEENS_U16;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Create your Wove Account
      </h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="input-field"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="input-field"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="input-field"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="input-field"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="claimedAgeTier" className="block text-sm font-medium text-gray-700 mb-1">
            Age Group (Self-Declared)
          </label>
          <select
            name="claimedAgeTier"
            id="claimedAgeTier"
            value={formData.claimedAgeTier}
            onChange={handleChange}
            required
            className="input-field"
            disabled={isLoading}
          >
            <option value={AgeTier.UNVERIFIED} disabled>
              Select your age group
            </option>
            <option value={AgeTier.KIDS}>Kids (Under 13)</option>
            <option value={AgeTier.TEENS_U16}>Teens (13-15)</option>
            <option value={AgeTier.TEENS_16_PLUS}>Teens (16-17)</option>
            <option value={AgeTier.ADULTS}>Adults (18+)</option>
          </select>
        </div>

        {requiresParentEmail && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-sm text-purple-700 mb-2">
              Parental consent is required for this age group.
            </p>
            <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Parent/Guardian Email
            </label>
            <input
              type="email"
              name="parentEmail"
              id="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              required={requiresParentEmail}
              className="input-field"
              disabled={isLoading}
            />
          </div>
        )}

        <button type="submit" disabled={isLoading} className="w-full btn-primary">
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" legacyBehavior>
          <a className="font-medium text-purple-600 hover:text-purple-500">Log in</a>
        </Link>
      </p>
    </div>
  );
};

// Helper CSS class for input fields (can be moved to globals.css)
// .input-field {
//   @apply mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm;
// }
// .btn-primary {
//  @apply w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50;
// }

export default RegistrationForm;
