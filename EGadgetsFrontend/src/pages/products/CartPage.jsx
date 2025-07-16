import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getImgUrl } from '../../utils/getImgUrl';
import { clearCart, removeFromCart } from '../../redux/features/cart/cartSlice';

const CartPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Function to safely extract a price value
    const parsePrice = (price) => {
        if (price && typeof price === 'object' && price.$numberDecimal) {
            return parseFloat(price.$numberDecimal); // If it's a Decimal128 type, extract the number
        }
        return parseFloat(price) || 0; // Return 0 if not a valid number
    };

    // Calculate total price
    const totalPrice = cartItems.reduce((acc, item) => {
        const newPrice = parsePrice(item.new_price); // Use parsePrice for new_price
        return acc + newPrice;
    }, 0).toFixed(2);

    // Calculate total savings
    const totalSavings = cartItems.reduce((acc, item) => {
        const oldPrice = parsePrice(item.old_price); // Use parsePrice for old_price
        const newPrice = parsePrice(item.new_price); // Use parsePrice for new_price
        return acc + (oldPrice - newPrice);
    }, 0).toFixed(2);

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    // Check if the user is logged in
    const token = localStorage.getItem('token');

    // Handle Checkout with validation
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty! Add items to the cart before proceeding to checkout.");
        } else if (!token) {
            alert("You need to log in first!");
            navigate("/login"); // Redirect to login page
        } else {
            navigate("/checkout"); // Proceed to checkout if cart has items and user is logged in
        }
    };
    
    return (
        <>
            <div className="flex mt-12 h-full flex-col overflow-hidden bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                        <div className="text-lg font-medium text-gray-900">Shopping cart</div>
                        <div className="ml-3 flex h-7 items-center">
                            <button
                                type="button"
                                onClick={handleClearCart}
                                className="relative -m-2 py-1 px-2 bg-red-500 text-white rounded-md hover:bg-secondary transition-all duration-200"
                            >
                                <span>Clear Cart</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flow-root">
                            {
                                cartItems.length > 0 ? (
                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                        {
                                            cartItems.map((product) => (
                                                <li key={product?._id} className="flex py-6">
                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                        <img
                                                            alt=""
                                                            src={`${getImgUrl(product?.productImage)}`}
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>

                                                    <div className="ml-4 flex flex-1 flex-col">
                                                        <div>
                                                            <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                                                                <h3>
                                                                    <Link to='/'>{product?.title}</Link>
                                                                </h3>
                                                                <p className="sm:ml-4">Rs. {parsePrice(product?.new_price).toFixed(2)}</p> {/* Safely parse and format price */}
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-500 capitalize"><strong>Category: </strong>{product?.category}</p>
                                                        </div>
                                                        <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                                                            <p className="text-gray-500"><strong>Qty:</strong> 1</p>

                                                            <div className="flex">
                                                                <button
                                                                    onClick={() => handleRemoveFromCart(product)}
                                                                    type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                ) : (<p>No product found!</p>)
                            }
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>Rs. {totalPrice}</p> {/* Display totalPrice */}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    
                    <div className="mt-6">
                        <button
                            onClick={handleCheckout} // Call the handleCheckout function
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            Checkout
                        </button>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <Link to="/">
                            or
                            <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                            >
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;
