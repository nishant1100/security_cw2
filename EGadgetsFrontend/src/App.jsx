
// import { Outlet } from 'react-router-dom'
// import './App.css'
// import Navbar from './components/Navbar'
// import Footer from './components/Footer'

// function App() {
//   return (
//     <>
//     <Navbar/>
//       <main className='min-h-screen max-w-scree-2xl mx-auto px-4 py-8'>
//         <Outlet/>
//       </main>
//     <Footer/>
//     </>
//   )
// }

// export default App

import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Navbar />
      
      {/* Toast container for global toast messages */}
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="colored"
      />

      <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-8'>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default App;

