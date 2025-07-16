import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/features/cart/cartSlice';
import { useCreateOrderMutation } from '../../redux/orders/ordersApi';



function CheckoutPage() {
    const cartItems = useSelector(state => state.cart.cartItems);
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User from localStorage:", user);
    const dispatch = useDispatch();


    const [createOrder] = useCreateOrderMutation();
    const [isChecked, setIsChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);  // Track submission state
    const navigate = useNavigate();

    console.log(cartItems);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Calculate total price here from cartItems
    const totalPrice = cartItems.reduce((acc, item) => {
        // Check if new_price exists and get the value from $numberDecimal
        const price = item.new_price && item.new_price.$numberDecimal
            ? parseFloat(item.new_price.$numberDecimal)
            : 0;
        return acc + price;
    }, 0).toFixed(2);

    console.log("Total Price:", totalPrice); // Log the total price

    const onSubmit = async (data) => {
        setIsSubmitting(true);  // Set submitting state to true
        const newOrder = {
            userId: user?._id,
            name: data.name,
            email: data.email,  // Use the email entered by the user
            address: {
                city: data.city,
                country: data.country,
                state: data.state,
                zipcode: data.zipcode,
            },
            phone: data.phone,
            productIds: cartItems.map((item) => item._id),
            totalPrice: Number(totalPrice)

        };

        try {
            const response = await createOrder(newOrder).unwrap();
            alert("Order placed successfully!");
            // Clear the cart after successful order
            dispatch(clearCart());

            navigate("/");  // Redirect to the home page after placing the order
            // window.location.reload();
        } catch (error) {
            alert("Error placing order. Please try again.");
        } finally {
            setIsSubmitting(false);  // Reset submitting state
        }
    };

    return (
        <section>
            <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
                <div className="container max-w-screen-lg mx-auto">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-600 mb-2">Cash On Delivery</h2>
                        <p className="text-gray-500 mb-2">Total Price: Rs. {totalPrice}</p> {/* Display totalPrice */}
                        <p className="text-gray-500 mb-6">Items: {cartItems.length}</p>

                        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8">
                                <div className="text-gray-600">
                                    <p className="font-medium text-lg">Personal Details</p>
                                    <p>Please fill out all the fields.</p>
                                </div>

                                <div className="lg:col-span-2">
                                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                        <div className="md:col-span-5">
                                            <label htmlFor="name">Full Name</label>
                                            <input
                                                {...register("name", { required: true })}
                                                type="text"
                                                id="name"
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                            />
                                            {errors.name && <p className="text-red-500 text-xs">Full Name is required</p>}
                                        </div>

                                        <div className="md:col-span-5">
                                            <label htmlFor="email">Email Address</label>
                                            <input
                                                {...register("email", { required: true })}
                                                type="email"
                                                id="email"
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                            />
                                            {errors.email && <p className="text-red-500 text-xs">Email is required</p>}
                                        </div>

                                        <div className="md:col-span-3">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input
                                                {...register("phone", { required: true })}
                                                type="text"
                                                id="phone"
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                            />
                                            {errors.phone && <p className="text-red-500 text-xs">Phone Number is required</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="city">City</label>
                                            <input
                                                {...register("city", { required: true })}
                                                type="text"
                                                id="city"
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                            />
                                            {errors.city && <p className="text-red-500 text-xs">City is required</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="state">State</label>
                                            <input
                                                {...register("state", { required: true })}
                                                type="text"
                                                id="state"
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                            />
                                            {errors.state && <p className="text-red-500 text-xs">State is required</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="country">Country</label>
                                            <input
                                                {...register("country", { required: true })}
                                                type="text"
                                                id="country"
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                            />
                                            {errors.country && <p className="text-red-500 text-xs">Country is required</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="zipcode">Zip Code</label>
                                            <input
                                                {...register("zipcode", { required: true })}
                                                type="text"
                                                id="zipcode"
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                            />
                                            {errors.zipcode && <p className="text-red-500 text-xs">Zip Code is required</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-2 flex justify-end items-center">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}  // Disable button while submitting
                                        className={`bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                    >
                                        {isSubmitting ? 'Placing Order...' : 'Place Order'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CheckoutPage;
