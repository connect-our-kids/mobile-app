import { createStore, applyMiddleware, Action } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer, { RootState } from './reducers/index';
import thunk, { ThunkAction } from 'redux-thunk';

// Create this reusable type that can be imported into your redux action files
export type ThunkResult<R> = ThunkAction<R, RootState, void, Action>;

export const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk))
);
