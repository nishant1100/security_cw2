import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import getBaseUrl from '../utils/baseURL';
import { useSessionContext } from '../context/SessionContext';

const TestAdminLogin = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { setSession } = useSessionContext();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage('');

    try {
      console.log('🔍 Attempting admin login with:', { username: data.username, password: '***' });
      const response = await axios.post(`${getBaseUrl()}/api/admin/admin-simple`, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('✅ Admin login response:', response.data);
      const auth = response.data;
      if (auth.token) {
        setSession(auth.token, auth.user); // Use context to set session
      }
      setMessage("Admin Login successful!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error('❌ Admin login error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Admin login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Test Admin Login</h2>
        <p className="text-sm text-gray-600 text-center mb-6">Simple login without security features for debugging</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          {message && (
            <p className={`text-sm text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
          >
            {isLoading ? 'Logging in...' : 'Test Login'}
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>🔧 Test Credentials:</p>
          <p>Username: admin</p>
          <p>Password: admin123</p>
        </div>
        <p className="mt-6 text-center text-gray-400 text-xs">
          © 2025 e~Gadgets. Debug version.
        </p>
      </div>
    </div>
  );
};

export default TestAdminLogin; 