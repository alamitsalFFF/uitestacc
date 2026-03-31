import TransactionReducers  from './TransactionReducers';
import { configureStore } from '@reduxjs/toolkit';


const store = configureStore({
    reducer: TransactionReducers,
  });

export default store;