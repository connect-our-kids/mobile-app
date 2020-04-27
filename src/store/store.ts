import { Action } from 'redux';
import { RootState } from './reducers/index';
import { ThunkAction } from 'redux-thunk';

// Create this reusable type that can be imported into your redux action files
export type ThunkResult<R> = ThunkAction<R, RootState, void, Action>;
