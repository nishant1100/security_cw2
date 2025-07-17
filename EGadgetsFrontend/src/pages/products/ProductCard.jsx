// import React from 'react';
// import { FiShoppingCart } from 'react-icons/fi';
// import { getImgUrl } from '../../utils/getImgUrl';
// import { Link } from 'react-router-dom';

// import { useDispatch } from 'react-redux';
// import { addToCart } from '../../redux/features/cart/cartSlice';

// const ProductCard = ({ product }) => {
//   const dispatch = useDispatch();

//   const handleAddToCart = (product) => {
//     dispatch(addToCart(product));
//   };

//   // Convert Decimal128 values to normal numbers (or strings)
//   const newPrice = Number(product.new_price.$numberDecimal);
//   const oldPrice = Number(product.old_price.$numberDecimal);

//   console.log("Image URL:", getImgUrl(product.productImage)); // Debugging
  
//   return (
//     <div className="rounded-lg transition-shadow duration-300">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:h-72 sm:justify-center gap-4">
//         <div className="sm:h-72 sm:flex-shrink-0 border rounded-md">
//           <Link to={`/products/${product._id}`}>
//             <img
//               src={getImgUrl(product.productImage)} // Assuming product.image is already correct
//               alt=""
//               className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
//             />
//           </Link>
//         </div>

//         <div>
//           <Link to={`/products/${product._id}`}>
//             <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
//               {product.title}
//             </h3>
//           </Link>
//           <p className="text-gray-600 mb-5">
//           {product?.productName
//             ? product.productName.length > 80
//               ? `${product.productName.slice(0, 80)}...`
//               : product.productName
//             : "Unknown Artist"}
//         </p>

//         <p className="text-gray-600 mb-5">
//           {product?.description
//             ? product.description.length > 80
//               ? `${product.description.slice(0, 80)}...`
//               : product.description
//             : "No description available"}
//         </p>
//           <p className="font-medium mb-5">
//             Rs. {newPrice}{' '} {/* Use the converted value */}
//             <span className="line-through font-normal ml-2">
//               Rs. {oldPrice} {/* Use the converted value */}
//             </span>
//           </p>
//           <button
//             onClick={() => handleAddToCart(product)}
//             className="btn-primary px-6 space-x-1 flex items-center gap-1"
//           >
//             <FiShoppingCart className="" />
//             <span>Add to Cart</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default ProductCard;
import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { getImgUrl } from '../../utils/getImgUrl';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const newPrice = Number(product.new_price.$numberDecimal);
  const oldPrice = Number(product.old_price.$numberDecimal);

  return (
    <div className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden p-4 flex flex-col md:flex-row gap-6 border border-gray-100 h-[500px]">
      {/* Product Image */}
      <Link to={`/products/${product._id}`} className="flex-shrink-0 md:w-1/3 w-full h-full">
        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={getImgUrl(product.productImage)}
            alt={product.title || 'Phone Image'}
            className="object-contain w-[200px] h-[220px] transition-transform duration-200 hover:scale-105"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col justify-between flex-grow">
        <div>
          <Link to={`/products/${product._id}`}>
            <h3 className="text-xl font-bold text-gray-800 hover:text-purple-600 mb-2">
              {product.title}
            </h3>
          </Link>

          <p className="text-sm text-gray-600 mb-2">
            {product.productName
              ? product.productName.length > 80
                ? `${product.productName.slice(0, 80)}...`
                : product.productName
              : 'Unknown Phone'}
          </p>

          <p className="text-sm text-gray-500 mb-4">
            {product.description
              ? product.description.length > 100
                ? `${product.description.slice(0, 100)}...`
                : product.description
              : 'No description available'}
          </p>

          <div className="mb-4">
            <span className="text-lg font-semibold text-purple-700">Rs. {newPrice}</span>
            <span className="ml-3 text-sm line-through text-gray-400">Rs. {oldPrice}</span>
          </div>
        </div>

        <button
          onClick={() => handleAddToCart(product)}
          className="flex items-center justify-center gap-2 px-5 py-2 mt-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
        >
          <FiShoppingCart className="text-lg" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
