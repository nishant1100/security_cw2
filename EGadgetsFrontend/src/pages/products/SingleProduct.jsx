import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { useFetchProductByIdQuery } from '../../redux/features/products/productApi';
import { getImgUrl } from '../../utils/getImgUrl';

const SingleProduct = () => {
    const { id } = useParams();
    const { data: product, isLoading, isError } = useFetchProductByIdQuery(id);
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    // Loading and Error handling
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Something went wrong</div>;

    // Debugging the fetched data
    console.log(product);

    // Ensure that product data is available before rendering
    if (!product) {
        return <div>No product found</div>;
    }

    return (
        <div className="max-w-lg shadow-md p-5">
            <h1 className="text-2xl font-bold mb-6">{product.title}</h1>

            <div>
                <div>
                    <img
                        src={getImgUrl(product.productImage)} // Correct image field
                        alt={product.title}
                        className="mb-8"
                    />
                </div>

                <div className="mb-5">
                    <p className="text-gray-700 mb-2">
                        <strong>Artist:</strong> {product.artistName || 'admin'}
                    </p>
                    <p className="text-gray-700 mb-4">
                        <strong>Published:</strong>{' '}
                        {new Date(product?.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mb-4 capitalize">
                        <strong>Category:</strong> {product?.category}
                    </p>
                    <p className="text-gray-700">
                        <strong>Description:</strong> {product.description}
                    </p>
                </div>

                <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-primary px-6 space-x-1 flex items-center gap-1 "
                >
                    <FiShoppingCart className="" />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
};

export default SingleProduct;
