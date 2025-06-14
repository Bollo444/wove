'use client';

import React from 'react';
import Layout from '../../components/layout/Layout';
import AgeVerificationForm from '../../components/auth/AgeVerificationForm';

const VerifyAgePage: React.FC = () => {
  return (
    <Layout title="Verify Your Age - Wove" data-oid="6fb6l4z">
      <div className="container mx-auto py-8" data-oid="xx8_fb_">
        <p className="text-center text-gray-600 mb-6" data-oid="35l4jve">
          To ensure a safe and age-appropriate experience, please verify your age.
        </p>
        <AgeVerificationForm data-oid="e_b4bp6" />
      </div>
    </Layout>
  );
};

export default VerifyAgePage;
