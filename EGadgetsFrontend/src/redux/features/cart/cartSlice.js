// import { createSlice } from "@reduxjs/toolkit";
// import Swal from "sweetalert2";

// const loadCartFromLocalStorage = () => {
//   const data = localStorage.getItem("cartItems");
//   return data ? JSON.parse(data) : [];
// };

// const saveCartToLocalStorage = (cartItems) => {
//   localStorage.setItem("cartItems", JSON.stringify(cartItems));
// };

// const initialState = {
//   cartItems: loadCartFromLocalStorage(),
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const existingItem = state.cartItems.find(
//         (item) => item._id === action.payload._id
//       );
//       if (!existingItem) {
//         state.cartItems.push(action.payload);
//         saveCartToLocalStorage(state.cartItems);
//         Swal.fire({
//           position: "top-end",
//           icon: "success",
//           title: "Item added to cart",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       } else {
//         Swal.fire({
//           position: "top-end",
//           icon: "warning",
//           title: "Item already in cart",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       }
//     },
//     removeFromCart: (state, action) => {
//       state.cartItems = state.cartItems.filter(
//         (item) => item._id !== action.payload._id
//       );
//       saveCartToLocalStorage(state.cartItems);
//     },
//     clearCart: (state) => {
//       state.cartItems = [];
//       saveCartToLocalStorage(state.cartItems);
//     },
//   },
// });

// export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
// export default cartSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify"; // ✅ Import toast

const loadCartFromLocalStorage = () => {
  const data = localStorage.getItem("cartItems");
  return data ? JSON.parse(data) : [];
};

const saveCartToLocalStorage = (cartItems) => {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
};

const initialState = {
  cartItems: loadCartFromLocalStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );

      if (!existingItem) {
        state.cartItems.push(action.payload);
        saveCartToLocalStorage(state.cartItems);
        toast.success("Item added to cart!", {
          position: "top-right",
        });
      } else {
        toast.warning("Item already in cart", {
          position: "top-right",
        });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      saveCartToLocalStorage(state.cartItems);
      toast.info("Item removed from cart", {
        position: "top-right",
      });
    },
    clearCart: (state) => {
      state.cartItems = [];
      saveCartToLocalStorage(state.cartItems);
      toast.info("Cart cleared", {
        position: "top-right",
      });
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
