import { createReducer, on } from "@ngrx/store";
import * as authActions from './auth.actions';

export interface State {
    isAuthenticated: boolean;
}

const initState: State = {
    isAuthenticated : false
}

export const authReducer = createReducer(
    initState,
    on( authActions.setAuthenticated, (state: State) => ({ ...initState ,isAuthenticated: true}) ),
    on( authActions.setUnauthenticated, (state: State) => ({ ...initState ,isAuthenticated: false}) ),
)

export const getIsAuth = (state: State) => { return state.isAuthenticated }