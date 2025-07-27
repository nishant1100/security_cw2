import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/features/cart/cartSlice';
import { useCreateOrderMutation } from '../../redux/orders/ordersApi';
import axios from 'axios';

function PaymentSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [createOrder] = useCreateOrderMutation();
  const [paymentData, setPaymentData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);

  useEffect(() => {
    // Get encoded data from URL parameters
    const encodedData = searchParams.get('data');
    
    if (encodedData) {
      verifyPaymentAndCreateOrder(encodedData);
    } else {
      setIsVerifying(false);
      setVerificationError('No payment data received');
    }
  }, [searchParams]);

  const verifyPaymentAndCreateOrder = async (encodedData) => {
    try {
      // Step 1: Verify payment with your backend
      const response = await axios.post('http://localhost:3000/api/esewa/callback', {
        encodedData: encodedData
      });

      if (response.data.verified && response.data.status.status === 'COMPLETE') {
        setPaymentData(response.data.status);
        
        // Step 2: Get pending order data from localStorage
        const pendingOrderData = localStorage.getItem('pendingOrder');
        
        if (pendingOrderData) {
          const orderData = JSON.parse(pendingOrderData);
          
          // Step 3: Create the order in your database
          const orderToCreate = {
            ...orderData,
            paymentStatus: 'completed',
            paymentMethod: 'esewa',
            transactionId: response.data.status.transaction_uuid,
            esewaRefId: response.data.status.refId || null
          };
          
          // Remove txnUUID from order data as it's not needed in the order
          delete orderToCreate.txnUUID;
          
          console.log('Creating order after payment verification:', orderToCreate);
          
          await createOrder(orderToCreate).unwrap();
          setOrderCreated(true);
          
          // Step 4: Clear cart and cleanup
          dispatch(clearCart());
          localStorage.removeItem('pendingOrder');
          
          console.log('Order created successfully and cart cleared');
        } else {
          setVerificationError('Order data not found. Please contact support.');
        }
      } else {
        setVerificationError('Payment verification failed or payment not completed');
      }
    } catch (error) {
      console.error('Payment verification or order creation error:', error);
      
      if (error.message && error.message.includes('duplicate')) {
        // Handle duplicate order case (user refreshed page)
        setVerificationError('Order already processed');
        dispatch(clearCart());
        localStorage.removeItem('pendingOrder');
      } else {
        setVerificationError('Error processing your order. Please contact support.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders'); // Adjust path as needed
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">{verificationError}</p>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-600 text-white p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {orderCreated ? 'Order Placed Successfully!' : 'Payment Successful!'}
            </h1>
            <p className="text-green-100">
              {orderCreated ? 'Your order has been confirmed and is being processed' : 'Processing your order...'}
            </p>
          </div>

          {/* Payment Details */}
          <div className="p-6">
            {paymentData && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">{paymentData.transaction_uuid || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">Rs. {paymentData.totalAmount || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">{paymentData.status || 'COMPLETE'}</span>
                  </div>
                  {paymentData.refId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference ID:</span>
                      <span className="font-medium">{paymentData.refId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* What's Next */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Your order has been confirmed and is being processed
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  You will receive an email confirmation shortly
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Track your order in the orders section
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleViewOrders}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                View My Orders
              </button>
              <button
                onClick={handleContinueShopping}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;