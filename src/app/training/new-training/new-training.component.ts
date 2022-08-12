import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrainingService } from '../training.service';
import { Observable } from 'rxjs';
import { Exercise } from '../exercise.model';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as fromTraining from '../training.reducer';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})


export class NewTrainingComponent implements OnInit {

  isLoading$!: Observable<boolean>;
  trainings$!: Observable<Exercise[]>;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.trainings$ = this.store.select(fromTraining.getAvailableExercises); 
    this.trainingService.fetchAvailableExercises();
  }

  onTrainingStart(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
    console.log(form.value);
  }

}
