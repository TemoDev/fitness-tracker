import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class UIService {
    constructor(private _snackbar: MatSnackBar) {}

    loadingStateChanged = new Subject<boolean>();

    showSnackbar(message: string, action: string, duration: number) {
        this._snackbar.open(message, action, { duration: duration });
    }
}