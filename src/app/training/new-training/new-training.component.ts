import { Component, EventEmitter, OnInit, Output } from '@angular/core';

interface Training {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})


export class NewTrainingComponent implements OnInit {
  trainings: Training[] = [
    {value: 'crunches', viewValue: 'Crunches'},
    {value: 'touch-toes', viewValue: 'Touch Toes'},
    {value: 'burpees', viewValue: 'Burpees'},
  ];

  @Output() traningStart = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onTrainingStart() {
    this.traningStart.emit();
  }

}
