import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/products/CartPage";
import CheckoutPage from "../pages/products/CheckoutPage";
import SingleProduct from "../pages/products/SingleProduct";
import OrderPage from "../pages/products/OrderPage";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";
import TestAdminLogin from "../components/TestAdminLogin";
import DasboardLayout from "../pages/dashboard/DasboardLayout";
import Dashboard from "../pages/dashboard/DashBoard";
import ManageProducts from "../pages/dashboard/manageProducts/ManageProducts";
import AddProduct from "../pages/dashboard/addProduct/AddProduct";
import UpdateProduct from "../pages/dashboard/updateProduct/UpdateProduct";
import LogsPage from "../pages/dashboard/LogsPage";
import BrowsePage from "../pages/products/BrowsePage";
import Verify from "../utils/verifyUser";
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import PaymentFailed from "../pages/payment/PaymentFailed";
import UserProfile from "../pages/profile/UserProfile";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/orders', element: <OrderPage /> },
            { path: '/about', element: <div>About</div> },
            { path: '/login', element: <Login /> },
            { path: '/browse', element: <BrowsePage /> },
            { path: '/register', element: <Register /> },
            { path: '/cart', element: <CartPage /> },
            { path: '/checkout', element: <CheckoutPage /> },
            { path: '/products/:id', element: <SingleProduct /> },
            { path: '/verify-success', element: <Verify /> },
            { path: "/profile/:id", element: <UserProfile /> },
            { path: '/admin', element: <AdminLogin /> },
            // Payment result pages
            { path: '/payment-success', element: <PaymentSuccess /> },
            { path: '/payment-failed', element: <PaymentFailed /> },
        ]
    },
    {
        path: '/admin-test',
        element: <TestAdminLogin />
    },
    {
        path: '/dashboard',
        element: <AdminRoute><DasboardLayout /></AdminRoute>,
        children: [
            { path: '', element: <AdminRoute><Dashboard /></AdminRoute> },
            { path: "logs", element: <AdminRoute><LogsPage /></AdminRoute> },
            { path: "manage-product", element: <AdminRoute><ManageProducts /></AdminRoute> },
            { path: "add-new-product", element: <AdminRoute><AddProduct /></AdminRoute> },
            { path: "update-product/:id", element: <AdminRoute><UpdateProduct /></AdminRoute> },
        ]
    }
]);

export default router;