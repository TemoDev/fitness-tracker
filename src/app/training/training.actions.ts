import { createAction, props } from '@ngrx/store';
import { Exercise } from './exercise.model';

export const setAvailableExercises = createAction("[Training] Set Available Trainings", props<{ payload: Exercise[] }>());
export const setFinishedExercises = createAction("[Training] Set Finished Trainings", props<{ payload: Exercise[] }>());
export const startTraining = createAction("[Training] Start Training", props<{ payload: string }>());
export const stopTraining = createAction("[Training] Stop Training");