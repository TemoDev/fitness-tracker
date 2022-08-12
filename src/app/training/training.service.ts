import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Store } from "@ngrx/store";
import { map, Subject, Subscription } from "rxjs";
import { UIService } from "../shared/ui.service";
import { Exercise } from "./exercise.model";
import * as UI from '../shared/ui.actions';
import * as  fromRoot from '../app.reducer'; 

@Injectable({providedIn: 'root'})
export class TrainingService {

    exerciseChanged = new Subject<Exercise | null>();
    exercisesChanged = new Subject<Exercise[]>();
    availableExercises: Exercise[] = [];
    exercises = new Subject<Exercise[]>();
    // Array Firebase Subscriptions
    private fbSubs: Subscription[] = [];
    private runningExercise: any | Exercise; 

    constructor(private db: AngularFirestore, private uiService: UIService, private store: Store<fromRoot.State>) {}

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
                console.log(exercises);
                this.availableExercises = exercises;
                this.exercisesChanged.next([...this.availableExercises]);
            }, err => {
                this.store.dispatch(UI.stopLoading());
                this.uiService.showSnackbar("Fetching exercises have failed, please try again later.", '', 4000);
            })
        );
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find( ex => ex.id === selectedId );
        this.exerciseChanged.next({...this.runningExercise});
    }

    completeExercise() {
        this.addDataToDatabase({...this.runningExercise, date: new Date(), state: 'completed'});
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelledExercise(progress: number) {
        this.addDataToDatabase({...this.runningExercise, duration: this.runningExercise.duration * (progress / 100), calories: this.runningExercise.calories * (progress / 100), date: new Date(), state: 'cancelled'});
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRuningExercise() {
        return {...this.runningExercise};
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(
            this.db.collection('finishedExercises').valueChanges().subscribe( (exercises: any) => {
                this.exercises.next(exercises);
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