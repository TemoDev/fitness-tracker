import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})


export class NewTrainingComponent implements OnInit, OnDestroy {

  trainingSubscription = new Subscription();

  trainings!: Exercise[];

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
 
    this.trainingService.fetchAvailableExercises();

    this.trainingSubscription = this.trainingService.exercisesChanged.subscribe((availableExercises) => {
      this.trainings = availableExercises;
    });
  }

  onTrainingStart(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
    console.log(form.value);
  }

  ngOnDestroy() {
    this.trainingSubscription.unsubscribe();
  }

}
