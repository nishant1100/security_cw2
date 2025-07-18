// import React, { useState } from 'react';
// import { useForm } from "react-hook-form";
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const Register = () => {
//     const [message, setMessage] = useState('');
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const { register, handleSubmit, formState: { errors } } = useForm();

//     const onSubmit = async (data) => {
//         try {
//             const response = await axios.post("http://localhost:3000/api/auth/register", data);
//             localStorage.setItem("email", data.email);
//             setMessage("Registration successful. Please check your email for verification before logging in.");
//             setIsSubmitted(true); // Prevents further submissions
//         } catch (error) {
//             setMessage(error.response?.data?.message || "Registration failed");
//         }
//     };

//     return (
//         <div className='h-screen flex justify-center items-center'>
//             <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
//                 <h2 className='text-xl font-semibold mb-4'>Register</h2>

//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <div className='mb-4'>
//                         <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="username">Username</label>
//                         <input {...register("username", { required: true })} type="text" name='username' id='username' placeholder='Enter Username' className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' />
//                     </div>

//                     <div className='mb-4'>
//                         <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">Email</label>
//                         <input {...register("email", { required: true })} type="email" name='email' id='email' placeholder='Enter Email' className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' />
//                     </div>

//                     <div className='mb-4'>
//                         <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
//                         <input {...register("password", { required: true })} type="password" name='password' id='password' placeholder='Enter Password' className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' />
//                     </div>

//                     <div className='mb-4'>
//                         <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="bio">Bio</label>
//                         <textarea {...register("bio")} name='bio' id='bio' placeholder='Tell us about yourself' className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' />
//                     </div>

//                     {message && <p className='text-green-500 text-sm italic mb-4'>{message}</p>}

//                     <div>
//                         <button 
//                             className={`bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`} 
//                             type='submit' 
//                             disabled={isSubmitted}
//                         >
//                             {isSubmitted ? 'Check Email' : 'Register'}
//                         </button>
//                     </div>
//                 </form>

//                 {isSubmitted && (
//                     <p className='mt-4 text-sm text-gray-700'>
//                         After confirming your email, you can <Link to='/login' className="text-blue-500 hover:text-blue-700">Log in Here</Link>.
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Register;
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", data);
      localStorage.setItem("email", data.email);
      setMessage("Registration successful. Please check your email for verification before logging in.");
      setIsSubmitted(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/src/assets/1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Black overlay for contrast */}
      <div className="absolute inset-0 bg-white bg-opacity-60 z-0"></div>

      {/* Register Container - Styled Same as Login */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl shadow-xl p-8 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(54, 138, 194, 0.41)' }}
      >
        <h2 className="text-3xl font-bold text-left text-gray-900 mb-2">Register</h2>
        <h3 className="text-1xl font-bold text-left text-gray-900 mb-6">Create a new account.</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input
              {...register("username", { required: true })}
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">Username is required</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">Email is required</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              {...register("password", { required: true })}
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
            {errors.password && <p className="text-xs text-red-500 mt-1">Password is required</p>}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
            <textarea
              {...register("bio")}
              id="bio"
              placeholder="Tell us about yourself"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Error or Success Message */}
          {message && (
            <p className={`text-sm italic text-center ${isSubmitted ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={isSubmitted}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-200 ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitted ? 'Check Email' : 'Register'}
          </button>
        </form>

        {/* Login Redirect */}
        <div className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
