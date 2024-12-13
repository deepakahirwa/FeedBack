import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'regenerator-runtime/runtime';

import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom';
// Import your routes and components
import router from './Routes.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
