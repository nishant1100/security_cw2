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

  if (isLoading) return <div className="text-center py-10 text-lg">Loading...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Something went wrong.</div>;
  if (!product) return <div className="text-center py-10 text-gray-500">No product found.</div>;

  return (
    <div className="flex justify-center items-center px-4 py-10 bg-gray-100 min-h-screen">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-5 text-center">
          {product.title}
        </h1>

        <div className="flex flex-col md:flex-row gap-5">
          {/* Product Image */}
          <div className="flex-1">
            <img
              src={getImgUrl(product.productImage)}
              alt={product.title}
              className="w-full h-64 object-cover rounded-xl border hover:scale-105 transition-transform duration-300 ease-in-out"
              onError={(e) => (e.target.src = '/placeholder.png')}
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <span className="font-medium text-gray-900">Product:</span> {product.productName || 'Unknown'}
              </p>
              <p>
                <span className="font-medium text-gray-900">Published:</span>{' '}
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
              <p className="capitalize">
                <span className="font-medium text-gray-900">Category:</span> {product.category}
              </p>
              <p>
                <span className="font-medium text-gray-900">Description:</span>{' '}
                {product.description || 'No description available.'}
              </p>
            </div>

            <button
              onClick={() => handleAddToCart(product)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
            >
              <FiShoppingCart className="text-lg" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
