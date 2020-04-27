import { Action, createStore, applyMiddleware } from 'redux';
import { RootState, rootReducer } from './reducers/index';
import thunk, { ThunkAction } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import ApolloClient from 'apollo-client';
import { client } from './apollo';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

// Create this reusable type that can be imported into your redux action files
export type ThunkResult<R> = ThunkAction<
    R,
    RootState,
    { client: ApolloClient<NormalizedCacheObject> },
    Action
>;

export const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk.withExtraArgument({ client })))
);
