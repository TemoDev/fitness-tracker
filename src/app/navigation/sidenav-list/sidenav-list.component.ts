import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  isAuth: boolean = false;
  authSubscription!: Subscription;
  @Output() closeSidenav = new EventEmitter();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
   
    this.authSubscription = this.authService.authChange.subscribe((authState: boolean)=>{
      this.isAuth = authState;
    })
    
  }

  onCloseSidenav() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this. onCloseSidenav();
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
