// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { clearCart } from '../../redux/features/cart/cartSlice';
// import { useCreateOrderMutation } from '../../redux/orders/ordersApi';



// function CheckoutPage() {
//     const cartItems = useSelector(state => state.cart.cartItems);
//     const user = JSON.parse(localStorage.getItem("user"));
//     console.log("User from localStorage:", user);
//     const dispatch = useDispatch();


//     const [createOrder] = useCreateOrderMutation();
//     const [isChecked, setIsChecked] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);  // Track submission state
//     const navigate = useNavigate();

//     console.log(cartItems);

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm();

//     // Calculate total price here from cartItems
//     const totalPrice = cartItems.reduce((acc, item) => {
//         // Check if new_price exists and get the value from $numberDecimal
//         const price = item.new_price && item.new_price.$numberDecimal
//             ? parseFloat(item.new_price.$numberDecimal)
//             : 0;
//         return acc + price;
//     }, 0).toFixed(2);

//     console.log("Total Price:", totalPrice); // Log the total price

//     const onSubmit = async (data) => {
//         setIsSubmitting(true);  // Set submitting state to true
//         const newOrder = {
//             userId: user?._id,
//             name: data.name,
//             email: data.email,  // Use the email entered by the user
//             address: {
//                 city: data.city,
//                 country: data.country,
//                 state: data.state,
//                 zipcode: data.zipcode,
//             },
//             phone: data.phone,
//             productIds: cartItems.map((item) => item._id),
//             totalPrice: Number(totalPrice)

//         };

//         try {
//             const response = await createOrder(newOrder).unwrap();
//             alert("Order placed successfully!");
//             // Clear the cart after successful order
//             dispatch(clearCart());

//             navigate("/");  // Redirect to the home page after placing the order
//             // window.location.reload();
//         } catch (error) {
//             alert("Error placing order. Please try again.");
//         } finally {
//             setIsSubmitting(false);  // Reset submitting state
//         }
//     };

//     return (
//         <section>
//             <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
//                 <div className="container max-w-screen-lg mx-auto">
//                     <div>
//                         <h2 className="font-semibold text-xl text-gray-600 mb-2">Cash On Delivery</h2>
//                         <p className="text-gray-500 mb-2">Total Price: Rs. {totalPrice}</p> {/* Display totalPrice */}
//                         <p className="text-gray-500 mb-6">Items: {cartItems.length}</p>

//                         <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
//                             <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8">
//                                 <div className="text-gray-600">
//                                     <p className="font-medium text-lg">Personal Details</p>
//                                     <p>Please fill out all the fields.</p>
//                                 </div>

//                                 <div className="lg:col-span-2">
//                                     <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
//                                         <div className="md:col-span-5">
//                                             <label htmlFor="name">Full Name</label>
//                                             <input
//                                                 {...register("name", { required: true })}
//                                                 type="text"
//                                                 id="name"
//                                                 className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
//                                             />
//                                             {errors.name && <p className="text-red-500 text-xs">Full Name is required</p>}
//                                         </div>

//                                         <div className="md:col-span-5">
//                                             <label htmlFor="email">Email Address</label>
//                                             <input
//                                                 {...register("email", { required: true })}
//                                                 type="email"
//                                                 id="email"
//                                                 className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
//                                             />
//                                             {errors.email && <p className="text-red-500 text-xs">Email is required</p>}
//                                         </div>

//                                         <div className="md:col-span-3">
//                                             <label htmlFor="phone">Phone Number</label>
//                                             <input
//                                                 {...register("phone", { required: true })}
//                                                 type="text"
//                                                 id="phone"
//                                                 className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
//                                             />
//                                             {errors.phone && <p className="text-red-500 text-xs">Phone Number is required</p>}
//                                         </div>

//                                         <div className="md:col-span-2">
//                                             <label htmlFor="city">City</label>
//                                             <input
//                                                 {...register("city", { required: true })}
//                                                 type="text"
//                                                 id="city"
//                                                 className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
//                                             />
//                                             {errors.city && <p className="text-red-500 text-xs">City is required</p>}
//                                         </div>

//                                         <div className="md:col-span-2">
//                                             <label htmlFor="state">State</label>
//                                             <input
//                                                 {...register("state", { required: true })}
//                                                 type="text"
//                                                 id="state"
//                                                 className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
//                                             />
//                                             {errors.state && <p className="text-red-500 text-xs">State is required</p>}
//                                         </div>

//                                         <div className="md:col-span-2">
//                                             <label htmlFor="country">Country</label>
//                                             <input
//                                                 {...register("country", { required: true })}
//                                                 type="text"
//                                                 id="country"
//                                                 className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
//                                             />
//                                             {errors.country && <p className="text-red-500 text-xs">Country is required</p>}
//                                         </div>

//                                         <div className="md:col-span-2">
//                                             <label htmlFor="zipcode">Zip Code</label>
//                                             <input
//                                                 {...register("zipcode", { required: true })}
//                                                 type="text"
//                                                 id="zipcode"
//                                                 className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
//                                             />
//                                             {errors.zipcode && <p className="text-red-500 text-xs">Zip Code is required</p>}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="lg:col-span-2 flex justify-end items-center">
//                                     <button
//                                         type="submit"
//                                         disabled={isSubmitting}  // Disable button while submitting
//                                         className={`bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
//                                     >
//                                         {isSubmitting ? 'Placing Order...' : 'Place Order'}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }

// export default CheckoutPage;



import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/features/cart/cartSlice';
import { useCreateOrderMutation } from '../../redux/orders/ordersApi';

function CheckoutPage() {
  const cartItems = useSelector(state => state.cart.cartItems);
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const [createOrder] = useCreateOrderMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = item.new_price?.$numberDecimal ? parseFloat(item.new_price.$numberDecimal) : 0;
    return acc + price;
  }, 0).toFixed(2);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
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
      totalPrice: Number(totalPrice),
    };

    try {
      await createOrder(newOrder).unwrap();
      alert("Order placed successfully!");
      dispatch(clearCart());
      navigate("/");
    } catch (error) {
      alert("Error placing order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🛒 Checkout</h2>
        <p className="text-center text-gray-600 mb-4">Total Items: <strong>{cartItems.length}</strong></p>
        <p className="text-center text-gray-600 mb-6">Total Price: <strong>Rs. {totalPrice}</strong></p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block font-medium text-sm text-gray-700">Full Name</label>
              <input
                {...register("name", { required: true })}
                type="text"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">Full Name is required</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium text-sm text-gray-700">Email</label>
              <input
                {...register("email", { required: true })}
                type="email"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">Email is required</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block font-medium text-sm text-gray-700">Phone Number</label>
              <input
                {...register("phone", { required: true })}
                type="text"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">Phone Number is required</p>}
            </div>

            {/* City */}
            <div>
              <label className="block font-medium text-sm text-gray-700">City</label>
              <input
                {...register("city", { required: true })}
                type="text"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.city && <p className="text-xs text-red-500 mt-1">City is required</p>}
            </div>

            {/* State */}
            <div>
              <label className="block font-medium text-sm text-gray-700">State</label>
              <input
                {...register("state", { required: true })}
                type="text"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.state && <p className="text-xs text-red-500 mt-1">State is required</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block font-medium text-sm text-gray-700">Country</label>
              <input
                {...register("country", { required: true })}
                type="text"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.country && <p className="text-xs text-red-500 mt-1">Country is required</p>}
            </div>

            {/* Zipcode */}
            <div>
              <label className="block font-medium text-sm text-gray-700">Zip Code</label>
              <input
                {...register("zipcode", { required: true })}
                type="text"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.zipcode && <p className="text-xs text-red-500 mt-1">Zip Code is required</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md font-semibold transition duration-200 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CheckoutPage;
