// import axios from 'axios';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { clearCart } from '../../redux/features/cart/cartSlice';
// import { useCreateOrderMutation } from '../../redux/orders/ordersApi';

// function CheckoutPage() {
//   const cartItems = useSelector((state) => state.cart.cartItems);
//   const user = JSON.parse(localStorage.getItem('user'));
//   const dispatch = useDispatch();
//   const [createOrder] = useCreateOrderMutation();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const [selectedPayment, setSelectedPayment] = useState('esewa');
//   const [coupon, setCoupon] = useState('');
//   const [discount, setDiscount] = useState(0);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const baseTotal = cartItems.reduce((acc, item) => {
//     const price = item.new_price?.$numberDecimal ? parseFloat(item.new_price.$numberDecimal) : 0;
//     return acc + price;
//   }, 0);

//   const discountedTotal = (baseTotal - (baseTotal * discount)).toFixed(2);

//   const handleCouponApply = () => {
//     if (coupon.trim().toLowerCase() === 'sishir10') {
//       setDiscount(0.1);
//     } else {
//       setDiscount(0);
//     }
//   };

//   // Add this improved error handling to your handlePaymentSubmit function

//   // Add this improved error handling to your handlePaymentSubmit function

//   const handlePaymentSubmit = async (data) => {
//     setIsSubmitting(true);

//     if (!user || !user._id) {
//       alert("Your session has expired. Please log in again.");
//       navigate('/login');
//       setIsSubmitting(false);
//       return;
//     }

//     const newOrder = {
//       userId: user?._id,
//       name: data.name,
//       email: data.email,
//       address: {
//         city: data.city,
//         country: data.country,
//         state: data.state,
//         zipcode: data.zipcode,
//       },
//       phone: data.phone,
//       productIds: cartItems.map(item => item._id),
//       totalPrice: Number(discountedTotal),
//     };

//     try {
//       if (selectedPayment === 'cod') {
//         await createOrder(newOrder).unwrap();
//         alert('Order placed with Cash on Delivery!');
//         dispatch(clearCart());
//         navigate('/');
//       } else {
//         // Handle eSewa Payment
//         const txnUUID = `${user._id}-${Date.now()}`;
//         const endpoint = 'http://localhost:3000/api/esewa/initiate';

//         console.log(`Requesting eSewa payment at: ${endpoint}`);

//         const response = await axios.post(endpoint, {
//           total_amount: Number(discountedTotal).toFixed(2),
//           txnUUID,
//         });

//         console.log('eSewa response:', response.data);

//         // Check if response has required data
//         if (!response.data.gateway || !response.data.params) {
//           throw new Error('Invalid response from payment gateway');
//         }

//         const { gateway, params } = response.data;

//         // Validate required parameters - eSewa expects 'total_amount' in the form
//         const requiredParams = ['total_amount', 'transaction_uuid', 'product_code', 'success_url', 'failure_url', 'signed_field_names', 'signature'];
//         const missingParams = requiredParams.filter(param => !params[param]);

//         if (missingParams.length > 0) {
//           throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
//         }

//         // Create and auto-submit form to eSewa gateway
//         const form = document.createElement('form');
//         form.method = 'POST';
//         form.action = gateway;

//         Object.entries(params).forEach(([key, value]) => {
//           const input = document.createElement('input');
//           input.type = 'hidden';
//           input.name = key;
//           input.value = value;
//           form.appendChild(input);
//         });

//         document.body.appendChild(form);
//         console.log("Submitting eSewa form with data:");
//         console.log(params);
//         form.submit();
//       }
//     } catch (error) {
//       console.error('Payment error:', error);

//       // More specific error messages
//       if (error.response) {
//         console.error('Server response:', error.response.data);
//         alert(`Payment error: ${error.response.data.message || error.response.data.error || 'Server error'}`);
//       } else if (error.request) {
//         alert('Network error. Please check your connection.');
//       } else {
//         alert(`Error: ${error.message}`);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   return (
//     <section className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* LEFT SIDE */}
//         <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-2xl">
//           <h2 className="text-3xl font-bold text-gray-800 mb-6">🛒 Checkout</h2>

//           <form onSubmit={handleSubmit(handlePaymentSubmit)} className="space-y-6">
//             {/* FORM FIELDS */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {['name', 'email', 'phone', 'city', 'state', 'country', 'zipcode'].map((field) => (
//                 <div key={field}>
//                   <label className="block font-medium text-sm text-gray-700 capitalize">{field.replace('_', ' ')}</label>
//                   <input
//                     {...register(field, { required: true })}
//                     type="text"
//                     className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                   {errors[field] && <p className="text-xs text-red-500 mt-1">{field} is required</p>}
//                 </div>
//               ))}
//             </div>

//             {/* Delivery Option */}
//             <div className="mt-6">
//               <h3 className="font-semibold text-lg mb-2">Delivery Option</h3>
//               <div className="bg-gray-50 px-4 py-3 border rounded-lg">
//                 <label className="flex items-center space-x-2">
//                   <input type="radio" checked readOnly />
//                   <span>🚚 Free Express Shipping</span>
//                 </label>
//               </div>
//             </div>

//             {/* Payment Method */}
//             <div className="mt-6">
//               <h3 className="font-semibold text-lg mb-2">Payment Method</h3>
//               <div className="space-y-2">
//                 <label className="flex items-center space-x-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="esewa"
//                     checked={selectedPayment === 'esewa'}
//                     onChange={() => setSelectedPayment('esewa')}
//                   />
//                   <span className="text-green-700 font-medium">eSewa</span>
//                 </label>

//                 <label className="flex items-center space-x-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="cod"
//                     checked={selectedPayment === 'cod'}
//                     onChange={() => setSelectedPayment('cod')}
//                   />
//                   <span>Cash on Delivery</span>
//                 </label>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`px-6 py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md font-semibold transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
//                   }`}
//               >
//                 {isSubmitting
//                   ? 'Processing...'
//                   : selectedPayment === 'cod'
//                     ? 'Place Order'
//                     : 'Pay with eSewa'}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* RIGHT SIDE: ORDER SUMMARY */}
//         <div className="bg-white p-6 rounded-xl shadow-2xl">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

//           <div className="space-y-4 max-h-[300px] overflow-y-auto">
//             {cartItems.map((item) => (
//               <div key={item._id} className="flex items-center gap-4 border-b pb-3">
//                 <img
//                   src={item.image || 'https://via.placeholder.com/60'}
//                   alt={item.name}
//                   className="w-16 h-16 object-cover rounded"
//                 />
//                 <div>
//                   <p className="font-medium">{item.name}</p>
//                   <p className="text-sm text-gray-500">Qty: 1</p>
//                 </div>
//                 <p className="ml-auto font-semibold">Rs. {parseFloat(item.new_price?.$numberDecimal || 0).toFixed(2)}</p>
//               </div>
//             ))}
//           </div>

//           {/* Discount */}
//           <div className="mt-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={coupon}
//                 onChange={(e) => setCoupon(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 placeholder="Enter code (e.g., Sishir10)"
//               />
//               <button
//                 type="button"
//                 onClick={handleCouponApply}
//                 className="px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//               >
//                 Apply
//               </button>
//             </div>
//             {discount > 0 && <p className="text-green-600 text-sm mt-1">🎉 10% discount applied!</p>}
//           </div>

//           {/* Totals */}
//           <div className="mt-6 space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span>Item Total</span>
//               <span>Rs. {baseTotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Delivery</span>
//               <span className="text-green-600 font-medium">FREE</span>
//             </div>
//             {discount > 0 && (
//               <div className="flex justify-between text-green-600">
//                 <span>Discount</span>
//                 <span>- Rs. {(baseTotal * discount).toFixed(2)}</span>
//               </div>
//             )}
//             <div className="flex justify-between text-lg font-bold border-t pt-2">
//               <span>Total</span>
//               <span>Rs. {discountedTotal}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default CheckoutPage;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/features/cart/cartSlice';
import { useCreateOrderMutation } from '../../redux/orders/ordersApi';
import axios from 'axios';

function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = JSON.parse(localStorage.getItem('user'));
  const dispatch = useDispatch();
  const [createOrder] = useCreateOrderMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('esewa');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const baseTotal = cartItems.reduce((acc, item) => {
    const price = item.new_price?.$numberDecimal ? parseFloat(item.new_price.$numberDecimal) : 0;
    return acc + price;
  }, 0);

  const discountedTotal = (baseTotal - (baseTotal * discount)).toFixed(2);

  const handleCouponApply = () => {
    if (coupon.trim().toLowerCase() === 'sishir10') {
      setDiscount(0.1);
    } else {
      setDiscount(0);
    }
  };

// Updated handlePaymentSubmit function in CheckoutPage.jsx

const handlePaymentSubmit = async (data) => {
  setIsSubmitting(true);

  if (!user || !user._id) {
    alert("Your session has expired. Please log in again.");
    navigate('/login');
    setIsSubmitting(false);
    return;
  }

  // Prepare order data
  const newOrder = {
    userId: user?._id,
    name: data.name,
    email: data.email,
    address: {
      city: data.city,
      country: data.country,
      state: data.state,
      zipcode: data.zipcode,
    },
    phone: data.phone,
    productIds: cartItems.map(item => item._id),
    totalPrice: Number(discountedTotal),
  };

  try {
    if (selectedPayment === 'cod') {
      // Handle Cash on Delivery - Create order immediately
      await createOrder(newOrder).unwrap();
      alert('Order placed with Cash on Delivery!');
      dispatch(clearCart());
      navigate('/');
    } else {
      // Handle eSewa Payment - Store order data for later processing
      const txnUUID = `${user._id}-${Date.now()}`;
      
      // Store order data in localStorage temporarily for payment success page
      localStorage.setItem('pendingOrder', JSON.stringify({
        ...newOrder,
        txnUUID: txnUUID,
        paymentMethod: 'esewa'
      }));

      const endpoint = 'http://localhost:3000/api/esewa/initiate';

      console.log(`Requesting eSewa payment at: ${endpoint}`);
      
      const response = await axios.post(endpoint, {
        total_amount: Number(discountedTotal).toFixed(2),
        txnUUID,
      });

      console.log('eSewa response:', response.data);

      // Check if response has required data
      if (!response.data.gateway || !response.data.params) {
        throw new Error('Invalid response from payment gateway');
      }

      const { gateway, params } = response.data;

      // Validate required parameters
      const requiredParams = ['amount', 'transaction_uuid', 'product_code', 'success_url', 'failure_url', 'signed_field_names', 'signature'];
      const missingParams = requiredParams.filter(param => !params[param]);
      
      if (missingParams.length > 0) {
        throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
      }

      // Create and auto-submit form to eSewa gateway
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = gateway;

      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      console.log("Submitting eSewa form with data:");
      console.log(params);
      form.submit();
    }
  } catch (error) {
    console.error('Payment error:', error);
    
    // Clean up stored order data on error
    localStorage.removeItem('pendingOrder');
    
    // More specific error messages
    if (error.response) {
      console.error('Server response:', error.response.data);
      alert(`Payment error: ${error.response.data.message || error.response.data.error || 'Server error'}`);
    } else if (error.request) {
      alert('Network error. Please check your connection.');
    } else {
      alert(`Error: ${error.message}`);
    }
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🛒 Checkout</h2>

          <form onSubmit={handleSubmit(handlePaymentSubmit)} className="space-y-6">
            {/* FORM FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['name', 'email', 'phone', 'city', 'state', 'country', 'zipcode'].map((field) => (
                <div key={field}>
                  <label className="block font-medium text-sm text-gray-700 capitalize">{field.replace('_', ' ')}</label>
                  <input
                    {...register(field, { required: true })}
                    type="text"
                    className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors[field] && <p className="text-xs text-red-500 mt-1">{field} is required</p>}
                </div>
              ))}
            </div>

            {/* Delivery Option */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Delivery Option</h3>
              <div className="bg-gray-50 px-4 py-3 border rounded-lg">
                <label className="flex items-center space-x-2">
                  <input type="radio" checked readOnly />
                  <span>🚚 Free Express Shipping</span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="esewa"
                    checked={selectedPayment === 'esewa'}
                    onChange={() => setSelectedPayment('esewa')}
                  />
                  <span className="text-green-700 font-medium">eSewa</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={selectedPayment === 'cod'}
                    onChange={() => setSelectedPayment('cod')}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md font-semibold transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isSubmitting
                  ? 'Processing...'
                  : selectedPayment === 'cod'
                    ? 'Place Order'
                    : 'Pay with eSewa'}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE: ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 border-b pb-3">
                <img
                  src={item.image || 'https://via.placeholder.com/60'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: 1</p>
                </div>
                <p className="ml-auto font-semibold">Rs. {parseFloat(item.new_price?.$numberDecimal || 0).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Discount */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter code (e.g., Sishir10)"
              />
              <button
                type="button"
                onClick={handleCouponApply}
                className="px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Apply
              </button>
            </div>
            {discount > 0 && <p className="text-green-600 text-sm mt-1">🎉 10% discount applied!</p>}
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span>Rs. {baseTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- Rs. {(baseTotal * discount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span>Rs. {discountedTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;