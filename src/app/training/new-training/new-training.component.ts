import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})


export class NewTrainingComponent implements OnInit, OnDestroy {

  private trainingSubscription!: Subscription;
  isLoading : boolean = true;
  trainings!: Exercise[];
  private loadingSubscription!: Subscription;

  constructor(private trainingService: TrainingService, private uiService: UIService) { }

  ngOnInit(): void {
    this.trainingService.fetchAvailableExercises();
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe( state => {
      this.isLoading = state;
    } )
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
    if(this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

}
