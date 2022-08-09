import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  exChangedSubscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort; 
  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    // this.dataSource.data = this.trainingService.getCompletedOrCancelledExercises();
    
    this.trainingService.fetchCompletedOrCancelledExercises();
    this.exChangedSubscription = this.trainingService.exercises.subscribe( (exercises: Exercise[]) => {
      this.dataSource.data = exercises
    } )
    
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }

  ngOnDestroy() {
    if(this.exChangedSubscription) {
      this.exChangedSubscription.unsubscribe();
    }
  }

}
