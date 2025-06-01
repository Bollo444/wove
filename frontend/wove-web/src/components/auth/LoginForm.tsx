import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(email, password);
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login to Wove</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            aria-describedby="email-error"
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            aria-describedby="password-error"
            disabled={isLoading}
          />
          <div className="text-right mt-1">
            <Link href="/forgot-password" legacyBehavior>
              <a className="text-xs text-purple-600 hover:text-purple-500">Forgot password?</a>
            </Link>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/register" legacyBehavior>
          <a className="font-medium text-purple-600 hover:text-purple-500">Sign up</a>
        </Link>
      </p>
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3">
          {/* Placeholder for Google Sign-In Button */}
          <button
            type="button"
            onClick={() => alert('Google Sign-In not implemented yet.')}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <span className="sr-only">Sign in with Google</span>
            {/* Replace with Google SVG icon */}
            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zM8.28 14.734c-.35.205-.78.205-1.13 0L3.293 12.75a1.093 1.093 0 010-1.544l3.857-2.228c.35-.205.78-.205 1.13 0l3.857 2.228a1.093 1.093 0 010 1.544l-3.857 2.228zM11.707 9.25L7.85 6.972c-.35-.205-.78-.205-1.13 0L2.863 9.2c-.35.205-.35.56 0 .765l3.857 2.228c.35.205.78.205 1.13 0l3.857-2.228c.35-.205.35-.56 0-.765zm4.857-2.228L12.707 4.75a1.093 1.093 0 00-1.13 0L7.85 6.972c-.35.205-.78.205-1.13 0L2.863 9.2c-.35.205-.35.56 0 .765l.001.001.001.001 3.857 2.228c.35.205.78.205 1.13 0l3.857-2.228a1.093 1.093 0 000-1.544l-3.857-2.228z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-2">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
