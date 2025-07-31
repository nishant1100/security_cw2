
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { RouterProvider } from 'react-router-dom';
import router from './routers/router.jsx';
import { SessionProvider } from './context/SessionContext';




createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  </Provider>
)
