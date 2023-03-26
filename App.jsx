import {Provider} from 'react-redux';
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PURGE,
//   REGISTER,
//   PERSIST,
// } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import {PersistGate} from 'redux-persist/integration/react';
import Entry from './src/Entry';
// import {configureStore} from '@reduxjs/toolkit';
import {store} from './src/store';

// const persistConfig = {key: 'root', storage, version: 1};
// const persistedReducer = persistReducer(persistConfig, authReducer);
// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

export default function App() {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistStore(store)}> */}
      <Entry />
      {/* </PersistGate> */}
    </Provider>
  );
}
