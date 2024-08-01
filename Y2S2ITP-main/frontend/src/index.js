import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App'; // Import your root component
import { BrowserRouter } from 'react-router-dom';

import { configureStore } from '@reduxjs/toolkit';

import cartReducer, { getTotals } from './pages/User/CartSlice';


const store = configureStore({
  reducer: {  
    cart: cartReducer,    
  },
  
});


store.dispatch(getTotals());

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);