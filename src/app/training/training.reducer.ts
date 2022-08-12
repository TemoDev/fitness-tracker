import { Exercise } from "./exercise.model";
import * as fromRoot from './../app.reducer';
import * as trainingActions from './training.actions';
import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Action } from "rxjs/internal/scheduler/Action";

export interface trainingState{
    availableExercises: Exercise[],
    finishedExercises: Exercise[],
    activeTraining: Exercise | undefined
}

export interface State extends fromRoot.State {
    training: trainingState
}

const initialState: trainingState = {
    availableExercises: [],
    finishedExercises: [],
    activeTraining: undefined
}

export const trainingReducer = createReducer(
    initialState,
    on(trainingActions.setAvailableExercises, (state, action) => ({...state, availableExercises: action.payload})),
    on(trainingActions.setFinishedExercises, (state, action) => ({...state, finishedExercises: action.payload})),
    on(trainingActions.startTraining, (state, action) => ({...state, activeTraining : state.availableExercises.find(ex => ex.id === action.payload)})),
    on(trainingActions.stopTraining, (state) => ({...state, activeTraining: undefined})),
)

export const getTrainingState = createFeatureSelector<trainingState>('training');

export const getAvailableExercises = createSelector( getTrainingState ,(state: trainingState) => { return state.availableExercises });
export const getFinishedExercises = createSelector( getTrainingState ,(state: trainingState) => { return state.finishedExercises });
export const getActiveTraining = createSelector( getTrainingState ,(state: trainingState) => { return state.activeTraining });
export const getIsTraining = createSelector( getTrainingState, (state: trainingState) => {return state.activeTraining != null} )