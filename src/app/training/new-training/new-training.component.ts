import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})


export class NewTrainingComponent implements OnInit {

  trainings!: Observable<any>;

  constructor(private trainingService: TrainingService, private db: AngularFirestore) { }

  ngOnInit(): void {
    // this.trainings = this.trainingService.getAvailableExercises();
    this.trainings = this.db.collection('availableExercises').valueChanges();
  }

  onTrainingStart(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
    console.log(form.value);
  }

}
