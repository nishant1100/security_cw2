// import axios from 'axios';
// import { useState } from 'react';
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Login = () => {
//   const [message, setMessage] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const navigate = useNavigate();

//   const onSubmit = async (data) => {
//     try {
//       const response = await axios.post("http://localhost:3000/api/auth/login", data);
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("user", JSON.stringify(response.data.user));

//       setMessage("Login successful");
//       navigate("/");
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
//       {/* Background Video with Opacity */}
//       <video
//         className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50"
//         autoPlay
//         muted
//         loop
//         playsInline
//       >
//         <source src="src/assets/1.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

// {/* Login Container */}
// <div
//   className="relative z-10 w-full max-w-md rounded-2xl shadow-xl p-8 backdrop-blur-md"
//   style={{ backgroundColor: 'rgba(54, 138, 194, 0.41)' }}
// >
//   <h2 className="text-3xl font-bold text-left text-gray-900 mb-6">Login</h2>
//   <h3 className="text-1xl font-bold text-left text-gray-900 mb-6">Welcome back.</h3>

//   <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//     {/* Username */}
//     <div>
//       <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
//       <input
//         {...register("username", { required: true })}
//         type="text"
//         id="username"
//         placeholder="Enter your username"
//         className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//       />
//       {errors.username && <p className="text-xs text-red-500 mt-1">Username is required</p>}
//     </div>

//     {/* Password */}
//     <div className="relative">
//       <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
//       <input
//         {...register("password", { required: true })}
//         type={showPassword ? "text" : "password"}
//         id="password"
//         name="password"
//         placeholder="Enter your password"
//         className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//       />
//         <button
//         type="button"
//         onClick={() => setShowPassword(!showPassword)}
//         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
//         >
//         {showPassword ? <FaEye /> : <FaEyeSlash />}
//         </button>

//       {errors.password && <p className="text-xs text-red-500 mt-1">Password is required</p>}
//     </div>

//     {/* Error Message */}
//     {message && <p className="text-sm text-red-500 italic text-center">{message}</p>}

//     {/* Submit Button */}
//     <button
//       type="submit"
//       className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-200"
//     >
//       Log In
//     </button>
//   </form>

//   {/* Register Link */}
//   <div className="mt-6 text-center text-sm text-gray-700">
//     Don’t have an account?{" "}
//     <Link to="/register" className="text-blue-600 font-medium hover:underline">
//       Register Here
//     </Link>
//   </div>
// </div>

//     </div>
//   );
// };

// export default Login;
import axios from 'axios';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessage("Login successful");
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Background Video with Opacity */}
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

{/* Login Container */}
<div
  className="relative z-10 w-full max-w-md rounded-2xl shadow-xl p-8 backdrop-blur-md"
  style={{ backgroundColor: 'rgba(54, 138, 194, 0.41)' }}
>
  <h2 className="text-3xl font-bold text-left text-gray-900 mb-6">Login</h2>
  <h3 className="text-1xl font-bold text-left text-gray-900 mb-6">Welcome back.</h3>

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

    {/* Password */}
    <div className="relative">
      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
      <input
        {...register("password", { required: true })}
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
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

    {/* Error Message */}
    {message && <p className="text-sm text-red-500 italic text-center">{message}</p>}

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-200"
    >
      Log In
    </button>
  </form>

  {/* Register Link */}
  <div className="mt-6 text-center text-sm text-gray-700">
    Don’t have an account?{" "}
    <Link to="/register" className="text-blue-600 font-medium hover:underline">
      Register Here
    </Link>
  </div>
</div>

    </div>
  );
};
export default Login;
