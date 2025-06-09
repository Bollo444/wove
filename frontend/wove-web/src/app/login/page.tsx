'use client'; // Required for components with client-side interactivity like useState

import React from 'react';
import Layout from '../../components/layout/Layout';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Layout title="Login - Wove" data-oid=":o9fkqh">
      <LoginForm data-oid="ubrb_j." />
    </Layout>
  );
};

export default LoginPage;
