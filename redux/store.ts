import { Store } from 'redux'
import { createWrapper } from 'next-redux-wrapper'
import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { Task } from 'redux-saga'
import createSagaMiddleware from '@redux-saga/core'
import rootSaga from './saga/index'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, Persistor } from 'redux-persist'
import reducer from './reducers/index'

export interface SagaStore extends Store {
  sagaTask?: Task
  __persistor?: Persistor
}

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof reducer>

const persistConfig = {
  key: 'root',
  storage: storage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

// `makeStore` encapsulates the store configuration to allow
// creating unique store instances, which is particularly important for
// server-side rendering (SSR) scenarios. In SSR, separate store instances
// are needed for each request to prevent cross-request state pollution.
export const makeStore = () => {

  const sagaMiddleware = createSagaMiddleware()

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(sagaMiddleware),
  }) as SagaStore

  store.sagaTask = sagaMiddleware.run(rootSaga)

  store.__persistor = persistStore(store)

  return store
}

// Infer the return type of `makeStore`
export type AppStore = ReturnType<typeof makeStore>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>

// export an assembled wrapper
export const wrapper = createWrapper<any>(makeStore, { debug: process.env.NODE_ENV !== 'production' })
