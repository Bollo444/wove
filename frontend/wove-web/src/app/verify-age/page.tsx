'use client';

import React from 'react';
import Layout from '../../components/layout/Layout';
import AgeVerificationForm from '../../components/auth/AgeVerificationForm';

const VerifyAgePage: React.FC = () => {
  return (
    <Layout title="Verify Your Age - Wove" data-oid="...dg-1">
      <div className="container mx-auto py-8" data-oid="lo_-qbp">
        <p className="text-center text-gray-600 mb-6" data-oid="x0u26bv">
          To ensure a safe and age-appropriate experience, please verify your age.
        </p>
        <AgeVerificationForm data-oid="4bwkgj8" />
      </div>
    </Layout>
  );
};

export default VerifyAgePage;
