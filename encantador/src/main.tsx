import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import { ProductsProvider } from './context/ProductsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductsProvider>
        <UserProvider>
          <CartProvider>
            <OrdersProvider>
              <App />
            </OrdersProvider>
          </CartProvider>
        </UserProvider>
      </ProductsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
