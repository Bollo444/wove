'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AgeTier } from 'shared';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  ageTier: AgeTier | '';
  parentEmail?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  ageTier?: string;
  parentEmail?: string;
  general?: string;
}

const RegistrationForm: React.FC = () => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    ageTier: '',
    parentEmail: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value))
          return 'First name can only contain letters, spaces, hyphens, and apostrophes';
        break;
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value))
          return 'Last name can only contain letters, spaces, hyphens, and apostrophes';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value))
          return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value))
          return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value))
          return 'Password must contain at least one special character';
        break;
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        break;
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 6) return 'You must be at least 6 years old to register';
        if (age > 120) return 'Please enter a valid date of birth';
        break;
      case 'ageTier':
        if (!value) return 'Please select an age group';
        break;
      case 'parentEmail':
        if (
          formData.ageTier &&
          [AgeTier.KIDS, AgeTier.TEENS_U16].includes(formData.ageTier as AgeTier)
        ) {
          if (!value.trim()) return 'Parent/guardian email is required for users under 16';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return 'Please enter a valid parent/guardian email address';
          if (value === formData.email)
            return 'Parent/guardian email must be different from your email';
        }
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData] as string);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    if (!agreedToTerms) {
      newErrors.general = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Real-time validation
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    // Auto-determine age tier based on date of birth
    if (name === 'dateOfBirth' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      let ageTier: AgeTier | '' = '';
      if (age >= 6 && age <= 12) ageTier = AgeTier.KIDS;
      else if (age >= 13 && age <= 15) ageTier = AgeTier.TEENS_U16;
      else if (age >= 16 && age <= 17) ageTier = AgeTier.TEENS_16_PLUS;
      else if (age >= 18) ageTier = AgeTier.ADULTS;

      setFormData(prev => ({ ...prev, ageTier }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        ageTier: formData.ageTier as AgeTier,
        parentEmail: formData.parentEmail?.trim() || undefined,
      });

      setSuccessMessage('Registration successful! Welcome to Wove!');
      // Form will be cleared by the auth context redirect
    } catch (error: any) {
      setErrors({ general: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiresParentEmail =
    formData.ageTier && [AgeTier.KIDS, AgeTier.TEENS_U16].includes(formData.ageTier as AgeTier);

  const getPasswordStrength = (
    password: string,
  ): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg" data-oid="sx:5i_t">
      <div className="text-center mb-8" data-oid="th3cvph">
        <h2 className="text-3xl font-bold text-gray-800 mb-2" data-oid="sa9yyji">
          Join Wove
        </h2>
        <p className="text-gray-600" data-oid="65emo6_">
          Create your account and start your storytelling journey
        </p>
      </div>

      {successMessage && (
        <div
          className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
          data-oid="850wysi"
        >
          <div className="flex items-center" data-oid="9fnf_.t">
            <span className="text-green-500 mr-2" data-oid="7pj_ovk">
              ✓
            </span>
            {successMessage}
          </div>
        </div>
      )}

      {errors.general && (
        <div
          className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
          data-oid="j-_0q-k"
        >
          <div className="flex items-center" data-oid="-lztos0">
            <span className="text-red-500 mr-2" data-oid="sop4w1a">
              ⚠
            </span>
            {errors.general}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" data-oid="3dul23:">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4" data-oid=":angk9u">
          <div data-oid="vnsim8:">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-2"
              data-oid="250_0ot"
            >
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John"
              disabled={isSubmitting}
              data-oid="scq1235"
            />

            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600" data-oid="7pma.m2">
                {errors.firstName}
              </p>
            )}
          </div>

          <div data-oid="7uhs.i0">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-2"
              data-oid="rc4c84l"
            >
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Doe"
              disabled={isSubmitting}
              data-oid="x6axyku"
            />

            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600" data-oid="nwuoi6_">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div data-oid="lkfuqfo">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
            data-oid="v3n3kwd"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john.doe@example.com"
            disabled={isSubmitting}
            data-oid="qwy4ges"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600" data-oid="b03yro8">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div data-oid="5ioicpt">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
            data-oid="re8h0qm"
          >
            Password *
          </label>
          <div className="relative" data-oid="719zv6b">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Create a strong password"
              disabled={isSubmitting}
              data-oid="n5qm88i"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              data-oid="9i_8dbp"
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  data-oid="5q9w:oo"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    data-oid="fj0:mh_"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  data-oid="z2f05w."
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    data-oid="19xfjp2"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    data-oid="9g.9rc4"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2" data-oid="f9treyp">
              <div className="flex items-center justify-between text-sm" data-oid="p_9ys69">
                <span className="text-gray-600" data-oid="cma_-9f">
                  Password strength:
                </span>
                <span
                  className={`font-medium ${
                    passwordStrength.score <= 2
                      ? 'text-red-600'
                      : passwordStrength.score <= 3
                        ? 'text-yellow-600'
                        : passwordStrength.score <= 4
                          ? 'text-blue-600'
                          : 'text-green-600'
                  }`}
                  data-oid="l87-w66"
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2" data-oid="k_g3unz">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  data-oid="v841-9u"
                ></div>
              </div>
            </div>
          )}

          {errors.password && (
            <p className="mt-1 text-sm text-red-600" data-oid="1cj_d4n">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div data-oid="2d3r8ma">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
            data-oid="ovjn7hd"
          >
            Confirm Password *
          </label>
          <div className="relative" data-oid="ac36kst">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
              disabled={isSubmitting}
              data-oid="6t:h6t_"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              data-oid="oijwot2"
            >
              {showConfirmPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  data-oid="qmdk_nh"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    data-oid="nuvk71m"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  data-oid="d38updr"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    data-oid="88wi65q"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    data-oid="6eijoor"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600" data-oid="z4p.wf4">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div data-oid="n2fc4jk">
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700 mb-2"
            data-oid="j5btnco"
          >
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
            data-oid="9gpqdc3"
          />

          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600" data-oid="yjf6s2t">
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        {/* Age Tier */}
        <div data-oid="0.9p4j:">
          <label
            htmlFor="ageTier"
            className="block text-sm font-medium text-gray-700 mb-2"
            data-oid="rdk94_e"
          >
            Age Group *
          </label>
          <select
            id="ageTier"
            name="ageTier"
            value={formData.ageTier}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.ageTier ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
            data-oid="ztfu9km"
          >
            <option value="" data-oid="21q:-20">
              Select your age group
            </option>
            <option value={AgeTier.KIDS} data-oid="lv6b1hj">
              Kids (6-12 years)
            </option>
            <option value={AgeTier.TEENS_U16} data-oid="dp_xtb1">
              Young Teens (13-15 years)
            </option>
            <option value={AgeTier.TEENS_16_PLUS} data-oid="-c0jnso">
              Older Teens (16-17 years)
            </option>
            <option value={AgeTier.ADULTS} data-oid="9uszint">
              Adults (18+ years)
            </option>
          </select>
          {errors.ageTier && (
            <p className="mt-1 text-sm text-red-600" data-oid="8wvhn.9">
              {errors.ageTier}
            </p>
          )}
        </div>

        {/* Parent Email (conditional) */}
        {requiresParentEmail && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg" data-oid="s1ik79c">
            <div className="flex items-start" data-oid="a64vbxk">
              <svg
                className="h-5 w-5 text-blue-500 mt-0.5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="o2_ponm"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  data-oid="w9.h0yq"
                />
              </svg>
              <div className="flex-1" data-oid="66e.dvm">
                <h4 className="text-sm font-medium text-blue-800 mb-1" data-oid="g7e83f6">
                  Parent/Guardian Consent Required
                </h4>
                <p className="text-sm text-blue-700 mb-3" data-oid="4phddp9">
                  Since you're under 16, we need a parent or guardian's email address for account
                  verification and safety.
                </p>
                <label
                  htmlFor="parentEmail"
                  className="block text-sm font-medium text-blue-800 mb-2"
                  data-oid="gkn9c7y"
                >
                  Parent/Guardian Email *
                </label>
                <input
                  type="email"
                  id="parentEmail"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.parentEmail ? 'border-red-500' : 'border-blue-300'
                  }`}
                  placeholder="parent@example.com"
                  disabled={isSubmitting}
                  data-oid="xy9w5yo"
                />

                {errors.parentEmail && (
                  <p className="mt-1 text-sm text-red-600" data-oid="kmyrf65">
                    {errors.parentEmail}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="flex items-start" data-oid="ajor31d">
          <input
            type="checkbox"
            id="agreedToTerms"
            checked={agreedToTerms}
            onChange={e => setAgreedToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            disabled={isSubmitting}
            data-oid="2gd5wyo"
          />

          <label htmlFor="agreedToTerms" className="ml-3 text-sm text-gray-700" data-oid="381hepz">
            I agree to the{' '}
            <a
              href="/terms"
              className="text-purple-600 hover:text-purple-700 underline"
              target="_blank"
              data-oid="41pq8wq"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              className="text-purple-600 hover:text-purple-700 underline"
              target="_blank"
              data-oid="m3-fa_m"
            >
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          data-oid="6cspu2d"
        >
          {isSubmitting || isLoading ? (
            <div className="flex items-center justify-center" data-oid=".-2ts5l">
              <div
                className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                data-oid="8sria34"
              ></div>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center" data-oid="ylqj0:z">
        <p className="text-gray-600" data-oid="58v0d0b">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-purple-600 hover:text-purple-700 font-medium"
            data-oid="t5jyk1o"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
