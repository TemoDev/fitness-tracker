import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Store } from "@ngrx/store";
import { map, Subscription, take } from "rxjs";
import { UIService } from "../shared/ui.service";
import { Exercise } from "./exercise.model";
import * as UI from '../shared/ui.actions';
import * as  fromTraining from './training.reducer'; 
import * as trainingActions from './training.actions';

@Injectable({providedIn: 'root'})
export class TrainingService {
    // Array Firebase Subscriptions
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService, private store: Store<fromTraining.State>) {}

    // Fetch exercises from Firebase Collection and assign values to subject
    fetchAvailableExercises() {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(UI.startLoading());
        this.fbSubs.push(
            this.db.collection('availableExercises').snapshotChanges().pipe(
              map((result: { payload: { doc: { id: string; data: () => any; }; }; }[]) => {
                return result.map((doc: { payload: { doc: { id: string; data: () => any; }; }; }) => {
                  return {
                    id: doc.payload.doc.id,
                    ...doc.payload.doc.data()
                  };
                });
              })
            ).subscribe((exercises: Exercise[]) => {
                this.store.dispatch(UI.stopLoading());
                this.store.dispatch(trainingActions.setAvailableExercises({payload: exercises}));
            }, err => {
                this.store.dispatch(UI.stopLoading());
                this.uiService.showSnackbar("Fetching exercises have failed, please try again later.", '', 4000);
            })
        );
    }

    startExercise(selectedId: string) {
        this.store.dispatch(trainingActions.startTraining({payload: selectedId}))
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe( (ex: any) => {
            this.addDataToDatabase({...ex, date: new Date(), state: 'completed'});
            this.store.dispatch(trainingActions.stopTraining());
        } )
    }

    cancelledExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe( (ex: any) => {
            this.addDataToDatabase({...ex, duration: ex.duration * (progress / 100), calories: ex.calories * (progress / 100), date: new Date(), state: 'cancelled'});
            this.store.dispatch(trainingActions.stopTraining());
        })
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(
            this.db.collection('finishedExercises').valueChanges().subscribe( (exercises: any) => {
                this.store.dispatch(trainingActions.setFinishedExercises({payload: exercises}));
            } )
        )
    }

    cancelSubscriptions() {
        this.fbSubs.forEach( el => el.unsubscribe() );
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }


}