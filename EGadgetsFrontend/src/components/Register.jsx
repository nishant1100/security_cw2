import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("http://localhost:3000/api/auth/register", data);
            localStorage.setItem("email", data.email);
            setMessage("Registration successful. Please check your email for verification before logging in.");
            setIsSubmitted(true); // Prevents further submissions
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <h2 className='text-xl font-semibold mb-4'>Register</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="username">Username</label>
                        <input {...register("username", { required: true })} type="text" name='username' id='username' placeholder='Enter Username' className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">Email</label>
                        <input {...register("email", { required: true })} type="email" name='email' id='email' placeholder='Enter Email' className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
                        <input {...register("password", { required: true })} type="password" name='password' id='password' placeholder='Enter Password' className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="bio">Bio</label>
                        <textarea {...register("bio")} name='bio' id='bio' placeholder='Tell us about yourself' className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' />
                    </div>

                    {message && <p className='text-green-500 text-sm italic mb-4'>{message}</p>}

                    <div>
                        <button 
                            className={`bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            type='submit' 
                            disabled={isSubmitted}
                        >
                            {isSubmitted ? 'Check Email' : 'Register'}
                        </button>
                    </div>
                </form>

                {isSubmitted && (
                    <p className='mt-4 text-sm text-gray-700'>
                        After confirming your email, you can <Link to='/login' className="text-blue-500 hover:text-blue-700">Log in Here</Link>.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Register;
