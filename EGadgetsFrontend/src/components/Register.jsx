import { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';
import { 
  secureApi, 
  InputValidator, 
  rateLimiter 
} from '../utils/security';

const Register = () => {
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const password = watch('password');
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

  // Check session validity, but do not redirect if on /admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && window.location.pathname !== '/admin') {
      navigate('/');
    }
  }, [navigate]);

  // Password strength checker
  useEffect(() => {
    if (password) {
      const feedback = [];
      let score = 0;

      if (password.length >= 8) score++;
      else feedback.push('At least 8 characters');

      if (/[A-Z]/.test(password)) score++;
      else feedback.push('One uppercase letter');

      if (/[a-z]/.test(password)) score++;
      else feedback.push('One lowercase letter');

      if (/\d/.test(password)) score++;
      else feedback.push('One number');

      if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
      else feedback.push('One special character');

      if (!/\s/.test(password)) score++;
      else feedback.push('No spaces allowed');

      setPasswordStrength({ score, feedback });
    }
  }, [password]);

  const getPasswordStrengthColor = (score) => {
    if (score <= 2) return 'text-red-500';
    if (score <= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getPasswordStrengthText = (score) => {
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
  };

  const onSubmit = async (data) => {
    // Rate limiting check
    const userKey = `register_${data.email}`;
    if (!rateLimiter.isAllowed(userKey, 3, 60 * 60 * 1000)) {
      toast.error('Too many registration attempts. Please try again later.');
      return;
    }

    // Validate reCAPTCHA
    if (!recaptchaToken) {
      toast.error('Please complete the reCAPTCHA verification.');
      return;
    }

    // Validate password strength
    if (passwordStrength.score < 5) {
      toast.error('Password does not meet security requirements.');
      return;
    }

    // Validate email
    if (!InputValidator.isValidEmail(data.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Sanitize inputs
    const sanitizedData = {
      username: InputValidator.sanitizeInput(data.username),
      email: InputValidator.sanitizeInput(data.email),
      password: data.password,
      bio: InputValidator.sanitizeInput(data.bio || ''),
      recaptchaToken
    };

    setIsLoading(true);
    setMessage('');

    try {
      const response = await secureApi.post("/api/auth/register", sanitizedData);
      
      toast.success('Registration successful! You can now login.');
      setMessage('Registration successful! You can now login.');
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
      toast.error(error.response?.data?.message || "Registration failed");
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

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="src/assets/1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Register Container */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl shadow-xl p-8 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(54, 138, 194, 0.41)' }}
      >
        <h2 className="text-3xl font-bold text-left text-gray-900 mb-6">Register</h2>
        <h3 className="text-1xl font-bold text-left text-gray-900 mb-6">Create your account.</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
              Username
            </label>
            <input
              {...register("username", { 
                required: "Username is required",
                minLength: { value: 3, message: "Username must be at least 3 characters" },
                validate: (value) => InputValidator.sanitizeInput(value).length > 0 || "Username cannot be empty"
              })}
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email", { 
                required: "Email is required",
                validate: (value) => InputValidator.isValidEmail(value) || "Please enter a valid email"
              })}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password", { 
                required: "Password is required",
                validate: (value) => InputValidator.isStrongPassword(value) || "Password does not meet security requirements"
              })}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            
            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score <= 2 ? 'bg-red-500' : 
                        passwordStrength.score <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordStrength.score)}`}>
                    {getPasswordStrengthText(passwordStrength.score)}
                  </span>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <ul className="text-xs text-gray-600 mt-1">
                    {passwordStrength.feedback.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword", { 
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match"
              })}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Bio (Optional) */}
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-1">
              Bio (Optional)
            </label>
            <textarea
              {...register("bio")}
              id="bio"
              placeholder="Tell us about yourself"
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
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

          {/* Error Message */}
          {message && <p className="text-sm text-red-500 italic text-center">{message}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !recaptchaToken || passwordStrength.score < 5}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-semibold transition duration-200"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login Here
          </Link>
        </div>

        {/* Security Features Notice */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>🔒 Your account will be protected with:</p>
          <p>• Strong Password Requirements • Two-Factor Authentication • Rate Limiting</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
