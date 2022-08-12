import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  isAuth$!: Observable<boolean>;
  @Output() closeSidenav = new EventEmitter();

  constructor(private authService: AuthService, private store: Store<fromApp.State>) { }

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromApp.getIsAuth);
  }

  onCloseSidenav() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this. onCloseSidenav();
    this.authService.logout();
  }
}
