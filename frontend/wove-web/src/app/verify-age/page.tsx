'use client';

import React from 'react';
import Layout from '../../components/layout/Layout';
import AgeVerificationForm from '../../components/auth/AgeVerificationForm';

const VerifyAgePage: React.FC = () => {
  return (
    <Layout title="Verify Your Age - Wove">
      <div className="container mx-auto py-8">
        <p className="text-center text-gray-600 mb-6">
          To ensure a safe and age-appropriate experience, please verify your age.
        </p>
        <AgeVerificationForm />
      </div>
    </Layout>
  );
};

export default VerifyAgePage;
