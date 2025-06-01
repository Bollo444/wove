'use client';

import React from 'react';
import Layout from '../../components/layout/Layout';
import RegistrationForm from '../../components/auth/RegistrationForm';

const RegisterPage: React.FC = () => {
  return (
    <Layout title="Register - Wove">
      <RegistrationForm />
    </Layout>
  );
};

export default RegisterPage;
