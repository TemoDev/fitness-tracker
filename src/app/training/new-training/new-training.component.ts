import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrainingService } from '../training.service';
import { Observable, Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { UIService } from 'src/app/shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})


export class NewTrainingComponent implements OnInit, OnDestroy {

  private trainingSubscription!: Subscription;
  isLoading$!: Observable<boolean>;
  trainings!: Exercise[];

  constructor(private trainingService: TrainingService, private uiService: UIService, private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.trainingService.fetchAvailableExercises();
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    
    this.trainingSubscription = this.trainingService.exercisesChanged.subscribe((availableExercises) => {
      this.trainings = availableExercises;
    });
  }

  onTrainingStart(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
    console.log(form.value);
  }

  ngOnDestroy() {
    if(this.trainingSubscription) {
      this.trainingSubscription.unsubscribe();
    }
  }

}
