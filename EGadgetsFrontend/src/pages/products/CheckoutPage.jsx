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
