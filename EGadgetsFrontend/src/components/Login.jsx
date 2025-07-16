import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
    const [message, setMessage] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", data);
            localStorage.setItem("token", response.data.token); // Store token
            localStorage.setItem("email", data.email);  // Save the email after login
            
            setMessage("Login successful");
            navigate("/"); // Redirect to the home page after login
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        }
    };
    

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <h2 className='text-xl font-semibold mb-4'>Please Log in</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="username">Username</label>
                        <input {...register("username", { required: true })} type="text" name='username' id='username' placeholder='Enter Username' className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
                        <input {...register("password", { required: true })} type="password" name='password' id='password' placeholder='Enter password' className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow' />
                    </div>

                    {message && <p className='text-red-500 text-xs italic'>{message}</p>}

                    <div>
                        <button className='bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='submit'>Log in</button>
                    </div>
                </form>
                <p className='align-baseline font-medium mt-4 text-sm'>Don't have an account? <Link to='/register' className="text-blue-500 hover:text-blue-700">Register Here</Link></p>
            </div>
        </div>
    );
};

export default Login;
