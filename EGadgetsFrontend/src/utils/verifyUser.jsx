// import React from "react";
// import { Link } from "react-router-dom";

// const Verify = () => {
//     return (
//         <div className="h-screen flex justify-center items-center bg-gray-100">
//             <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg px-8 py-6 text-center">
//                 <h2 className="text-2xl font-semibold mb-4 text-green-600">✅ Email Verified!</h2>
//                 <p className="text-gray-700 mb-4">
//                     Your account has been successfully verified. You can now log in.
//                 </p>
//                 <Link to="/login">
//                     <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
//                         Go to Login
//                     </button>
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default Verify;
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react"; // Optional icon library

const Verify = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-100">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center">
          <CheckCircle className="text-green-500 w-16 h-16 mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Email Verified!</h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Your email has been successfully verified. You can now log in and enjoy all features.
          </p>

          <Link to="/login">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verify;

