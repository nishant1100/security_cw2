import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';
import { 
  secureApi, 
  InputValidator, 
  rateLimiter 
} from '../utils/security';
import { useSessionContext } from '../context/SessionContext';

const Login = () => {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const { setSession, isAuthenticated } = useSessionContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  // Initialize CSRF token on component mount
  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        await secureApi.fetchCsrfToken();
      } catch (error) {
        console.error('Failed to initialize security:', error);
      }
    };
    initializeSecurity();
  }, []);

  // Check session validity
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    // Rate limiting check
    const userKey = `login_${data.username}`;
    if (!rateLimiter.isAllowed(userKey, 5, 15 * 60 * 1000)) {
      toast.error('Too many login attempts. Please try again later.');
      return;
    }

    // Validate reCAPTCHA
    if (!recaptchaToken) {
      toast.error('Please complete the reCAPTCHA verification.');
      return;
    }

    // Sanitize inputs
    const sanitizedData = {
      username: InputValidator.sanitizeInput(data.username),
      password: data.password, // Don't sanitize password
      recaptchaToken,
_csrf: localStorage.getItem('csrfToken') // if your backend expects _csrf instead of csrfToken

    };
    // Store username and password in state for OTP verification
    setLoginUsername(sanitizedData.username);
    setLoginPassword(sanitizedData.password);

    setIsLoading(true);
    setMessage('');

    try {
      const response = await secureApi.post("/api/auth/login", sanitizedData);
      
      if (response.data.requiresMFA) {
        setRequiresMFA(true);
        toast.info('MFA code sent to your email. Please check your inbox.');
      } else {
        // Handle successful login
        setSession(response.data.token, response.data.user);
        setLoginAttempts(0);
        toast.success('Login successful!');
        navigate("/");
      }
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
      
      if (error.response?.status === 423) {
        // Account lockout
        setMessage(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setMessage(error.response?.data?.message || "Login failed");
        toast.error(error.response?.data?.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFASubmit = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      toast.error('Please enter a valid 6-digit MFA code.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await secureApi.post("/api/auth/login", {
        username: loginUsername,
        password: loginPassword,
        mfaCode,
        recaptchaToken
      });

      // Handle successful login
      setSession(response.data.token, response.data.user);
      setLoginAttempts(0);
      toast.success('Login successful!');
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "MFA verification failed");
      toast.error(error.response?.data?.message || "MFA verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null);
    toast.warning('reCAPTCHA expired. Please verify again.');
  };

  if (requiresMFA) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-white shadow-xl rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Two-Factor Authentication</h2>
          <p className="text-gray-700 mb-6 text-center">
            We've sent a 6-digit verification code to your email address.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="mfaCode" className="block text-sm font-semibold text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                id="mfaCode"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={6}
              />
            </div>

            {message && <p className="text-sm text-red-500 italic text-center">{message}</p>}

            <button
              onClick={handleMFASubmit}
              disabled={isLoading || mfaCode.length !== 6}
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              onClick={() => setRequiresMFA(false)}
              className="w-full py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition duration-300"
            >
              Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white shadow-xl rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Welcome Back</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username or Email</label>
            <input
              type="text"
              {...register("username", { 
                required: "Username or email is required",
                validate: (value) => InputValidator.sanitizeInput(value).length > 0 || "Username cannot be empty"
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username or email"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="Enter your password"
            />
            <div
              className="absolute inset-y-0 right-3 top-[40px] flex items-center cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* reCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={handleRecaptchaChange}
              onExpired={handleRecaptchaExpired}
              className="mb-4"
            />
          </div>

          {message && (
            <p className="text-red-500 text-sm text-center">{message}</p>
          )}

          {/* Security Notice */}
          {loginAttempts > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Failed login attempts: {loginAttempts}/5. Account will be locked after 5 failed attempts.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !recaptchaToken}
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Security Features Notice */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>🔒 Protected with:</p>
          <p>• Two-Factor Authentication • Rate Limiting • CSRF Protection • reCAPTCHA</p>
        </div>

        <p className="mt-6 text-center text-gray-400 text-xs">
          © 2025 e~Gadgets. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
