import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatPaginator } from '@angular/material/paginator';
import { Store } from '@ngrx/store'
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();  

  @ViewChild(MatSort) sort!: MatSort; 
  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit(): void {    
    this.trainingService.fetchCompletedOrCancelledExercises();
    this.store.select(fromTraining.getFinishedExercises).subscribe( (exercises: Exercise[]) => {
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

}
