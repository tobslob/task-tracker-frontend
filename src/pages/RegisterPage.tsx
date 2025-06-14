import React from 'react';
import { RegisterForm } from '../components/RegisterForm';

const RegisterPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="bg-white shadow-md rounded-md w-full max-w-md">
      <div className="p-6 border-b text-center space-y-2">
        <h1 className="text-2xl font-bold text-green-700">Task Tracker</h1>
        <p className="text-gray-600">Create your account</p>
      </div>
      <div className="p-6">
        <RegisterForm />
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-[#24292f] hover:underline">Sign in</a>
        </div>
      </div>
    </div>
  </div>
);

export default RegisterPage;
