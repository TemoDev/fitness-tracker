import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { User } from "./user.model";

import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService {

    authChange = new Subject<boolean>();

    private user!: User | null;

    constructor(private router: Router) {}

    registerUser(authData: AuthData) {
        this.user = {
            email: authData.email,
            // Generating random userId until we bind to real Authentication
            userId: Math.round(Math.random() * 10000).toString()
        }
        this.authSuccessfully();
    }


    login(authData: AuthData) {
        this.user = {
            email: authData.email,
            // Generating random userId until we bind to real Authentication
            userId: Math.round(Math.random() * 10000).toString()
        }
        this.authSuccessfully();
    }

    logout() {
        this.user = null;
        this.router.navigate(["/login"]);
        this.authChange.next(false);
    }

    getUser() {
        return { ...this.user };
    }

    isAuth() {
        return this.user != null;
    }

    private authSuccessfully() {
        this.router.navigate(["/training"]);
        this.authChange.next(true);
    }
}