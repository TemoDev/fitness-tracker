import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth: boolean = false;
  authSubscription!: Subscription;
  @Output() sidenavToggle = new EventEmitter();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe((authStatus: boolean)=> {
      this.isAuth = authStatus;
    })
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  // Remove Subscription from Auth
  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
