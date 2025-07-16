import React from "react";
import { Link } from "react-router-dom";

const Verify = () => {
    return (
        <div className="h-screen flex justify-center items-center bg-gray-100">
            <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg px-8 py-6 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-green-600">✅ Email Verified!</h2>
                <p className="text-gray-700 mb-4">
                    Your account has been successfully verified. You can now log in.
                </p>
                <Link to="/login">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        Go to Login
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Verify;
