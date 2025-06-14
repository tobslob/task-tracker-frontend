import React from 'react';
import { LoginForm } from '../components/LoginForm';

const LoginPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="bg-white shadow-md rounded-md w-full max-w-md">
      <div className="p-6 border-b text-center space-y-2">
        <h1 className="text-2xl font-bold text-green-700">Task Tracker</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>
      <div className="p-6 space-y-4">
        <div className="bg-gray-100 border border-gray-200 rounded-md p-4 text-sm">
          <strong>Demo Account:</strong><br />
          Email: demo@email.com<br />
          Password: password123<br />
          superuser: true
        </div>
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-[#24292f] hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  </div>
);

export default LoginPage;
