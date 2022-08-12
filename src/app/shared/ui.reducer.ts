import { createReducer, on } from "@ngrx/store";
import * as uiActions from './ui.actions';

export interface State {
    isLoading: boolean;
}

const initState: State = {
    isLoading: false
}

export const uiReducer = createReducer(
    initState,
    on(uiActions.startLoading, state => ({ ...initState, isLoading: true })),
    on(uiActions.stopLoading, state => ({ ...initState, isLoading: false }))
)

export const getIsLoading = (state: State) => {
    return state.isLoading
} 