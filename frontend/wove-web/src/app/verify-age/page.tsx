'use client';

import React from 'react';
import Layout from '../../components/layout/Layout';
import AgeVerificationForm from '../../components/auth/AgeVerificationForm';

const VerifyAgePage: React.FC = () => {
  return (
    <Layout title="Verify Your Age - Wove" data-oid="er6ohci">
      <div className="container mx-auto py-8" data-oid="kwydi7l">
        <p className="text-center text-gray-600 mb-6" data-oid="dtbegbh">
          To ensure a safe and age-appropriate experience, please verify your age.
        </p>
        <AgeVerificationForm data-oid="z_8pt-2" />
      </div>
    </Layout>
  );
};

export default VerifyAgePage;
