import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";

import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TrainingService } from "../training/training.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UIService } from "../shared/ui.service";

@Injectable({providedIn: 'root'})
export class AuthService {

    authChange = new Subject<boolean>();
    isAuthenticated: boolean =  false;

    constructor(
        private router: Router, 
        private afAuth: AngularFireAuth, 
        private trainingService: TrainingService,
        private uiService: UIService     
    ) {}

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if(user) {
                this.isAuthenticated = true;
                this.router.navigate(["/training"]);
                this.authChange.next(true);
            }else {
                this.trainingService.cancelSubscriptions();
                this.isAuthenticated = false;
                this.router.navigate(["/login"]);
                this.authChange.next(false);
            }
        })
    }

    registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            console.log(result);
            this.uiService.loadingStateChanged.next(false);
        }).catch(err => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(err.message, '', 4000);
        })
    }


    login(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
        .then( result => {
            console.log(result);
            this.uiService.loadingStateChanged.next(false);
        })
        .catch(err => {
            this.uiService.loadingStateChanged.next(false);
            console.log(err);
            this.uiService.showSnackbar(err.message, '', 4000);
        })
    }

    logout() {
        this.afAuth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }
}