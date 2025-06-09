'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface ValidationErrors {
  email?: string;
  password?: string;
}

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (validationErrors.email) {
      setValidationErrors(prev => ({ ...prev, email: undefined }));
    }
    if (error) setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: undefined }));
    }
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await login(email.trim(), password);
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl" data-oid="6h5txjd">
      <div className="text-center mb-6" data-oid="_pil5dp">
        <h2 className="text-3xl font-bold text-gray-800 mb-2" data-oid="fx5ws.b">
          Welcome Back
        </h2>
        <p className="text-gray-600" data-oid="jnvayy3">
          Sign in to continue your storytelling journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" data-oid=":_q12a.">
        {error && (
          <div
            className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            data-oid=":1ycha2"
          >
            <div className="flex items-center" data-oid="qbojrnc">
              <span className="text-red-500 mr-2" data-oid="xnua7od">
                ⚠
              </span>
              {error}
            </div>
          </div>
        )}

        {/* Email Field */}
        <div data-oid="9lclkrz">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
            data-oid="w5sj74f"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            disabled={isLoading}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              validationErrors.email
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
            } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Enter your email address"
            autoComplete="email"
            data-oid="r1z:i8k"
          />

          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600" data-oid="3ilwc:-">
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div data-oid="e0slboa">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
            data-oid=":2c2tn2"
          >
            Password
          </label>
          <div className="relative" data-oid="7_jjuxb">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                validationErrors.password
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
              } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Enter your password"
              autoComplete="current-password"
              data-oid="0gohy1j"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              data-oid="o.0ij:c"
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  data-oid="1a1q1d0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    data-oid="j6zd_-r"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  data-oid="mjuq-fp"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    data-oid="yacu045"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    data-oid="8uavk2w"
                  />
                </svg>
              )}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600" data-oid="5nd8y74">
              {validationErrors.password}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between" data-oid="3_tqxcy">
          <div className="flex items-center" data-oid="rdhho__">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              disabled={isLoading}
              data-oid="rclfjv5"
            />

            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
              data-oid="bdx2vnt"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm" data-oid="zz:lc9:">
            <Link
              href="/forgot-password"
              className="font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:underline transition ease-in-out duration-150"
              data-oid="10nw_83"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <div data-oid="admbyow">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-200'
            }`}
            data-oid="cqgshiv"
          >
            {isLoading ? (
              <div className="flex items-center justify-center" data-oid="bwj5o_e">
                <div
                  className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                  data-oid="on94587"
                ></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center" data-oid="m_zh7he">
          <p className="text-sm text-gray-600" data-oid="5knuyc-">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-purple-600 hover:text-purple-500 focus:outline-none focus:underline transition ease-in-out duration-150"
              data-oid="5v8f478"
            >
              Create one here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
