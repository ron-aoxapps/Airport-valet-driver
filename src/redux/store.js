import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducer'
import rootSaga from './rootSaga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['your/action/type'],
                ignoredActionPaths: ['payload.callback', 'payload.data'],
                ignoredPaths: ['items.dates'],
            },
        }).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)