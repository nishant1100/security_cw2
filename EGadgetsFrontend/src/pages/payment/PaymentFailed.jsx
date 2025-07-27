import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function PaymentFailure() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [failureReason, setFailureReason] = useState('Payment was not completed');

  useEffect(() => {
    // Clean up pending order data since payment failed
    localStorage.removeItem('pendingOrder');
    
    // You can extract failure reason from URL parameters if eSewa provides them
    const reason = searchParams.get('reason') || 'Payment was not completed';
    setFailureReason(reason);
  }, [searchParams]);

  const handleRetryPayment = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleContactSupport = () => {
    // You can implement this based on your support system
    window.location.href = 'mailto:support@yourdomain.com';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Failure Header */}
          <div className="bg-red-600 text-white p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
            <p className="text-red-100">Your payment could not be processed</p>
          </div>

          {/* Failure Details */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">What happened?</h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="text-red-700">{failureReason}</p>
              </div>
            </div>

            {/* Common Reasons */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Common reasons for payment failure:</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Insufficient balance in your eSewa account</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Payment was cancelled during the process</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Session timeout during payment</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Network connectivity issues</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Incorrect login credentials or MPIN</span>
                </li>
              </ul>
            </div>

            {/* What to do next */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">What can you do?</h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Check your eSewa account balance
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Try the payment again
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Contact our support team if the issue persists
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRetryPayment}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Try Payment Again
              </button>
              <button
                onClick={handleContinueShopping}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>

            {/* Support Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 mb-3">Still having trouble?</p>
              <button
                onClick={handleContactSupport}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailure;