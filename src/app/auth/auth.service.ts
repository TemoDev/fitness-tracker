import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";

import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TrainingService } from "../training/training.service";
import { UIService } from "../shared/ui.service";

import * as fromRoot from '../app.reducer';
import { Store } from "@ngrx/store";
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable({providedIn: 'root'})
export class AuthService {

    isAuthenticated: boolean =  false;

    constructor(
        private router: Router, 
        private afAuth: AngularFireAuth, 
        private trainingService: TrainingService,
        private uiService: UIService,
        private store: Store<fromRoot.State>     
    ) {}

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if(user) {
                this.store.dispatch(Auth.setAuthenticated());
                this.router.navigate(["/training"]);
            }else {
                this.store.dispatch(Auth.setUnauthenticated());
                this.trainingService.cancelSubscriptions();
                this.router.navigate(["/login"]);
            }
        })
    }

    registerUser(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch(UI.startLoading());
        this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            console.log(result);
            this.store.dispatch(UI.stopLoading());
        }).catch(err => {
            // this.uiService.loadingStateChanged.next(false);
            this.store.dispatch(UI.stopLoading());
            this.uiService.showSnackbar(err.message, '', 4000);
        })
    }


    login(authData: AuthData) {
        this.store.dispatch(UI.startLoading());
        this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
        .then( result => {
            console.log(result);
            this.store.dispatch(UI.stopLoading());
        })
        .catch(err => {
            this.store.dispatch(UI.stopLoading());
            console.log(err);
            this.uiService.showSnackbar(err.message, '', 4000);
        })
    }

    logout() {
        this.afAuth.signOut();
    }
}