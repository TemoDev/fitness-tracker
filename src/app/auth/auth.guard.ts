import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { AuthService } from "./auth.service";
import * as fromApp from '../app.reducer';
import { take } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private authService: AuthService, private router : Router, private store: Store<fromApp.State>) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any{
        return this.store.select(fromApp.getIsAuth)
    }

    canLoad(route: Route): any{
        return this.store.select(fromApp.getIsAuth).pipe(take(1))
    }

}