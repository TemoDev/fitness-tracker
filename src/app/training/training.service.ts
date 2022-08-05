import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { map, Subject } from "rxjs";
import { Exercise } from "./exercise.model";

@Injectable({providedIn: 'root'})
export class TrainingService {

    exerciseChanged = new Subject<Exercise | null>();
    exercisesChanged = new Subject<Exercise[]>();

    availableExercises: Exercise[] = [];

    private runningExercise: any | Exercise; 
    private exersices: Exercise[] = [];

    constructor(private db: AngularFirestore) {}

    // Fetch exercises from Firebase Collection and assign values to subject
    fetchAvailableExercises() {
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
            console.log(exercises);
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
        });
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

    getCompletedOrCancelledExercises() {
        return this.exersices.slice();
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }


}