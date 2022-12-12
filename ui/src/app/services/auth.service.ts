import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { user } from '../interfaces/interfaces';

@Injectable({providedIn: 'root'})
export class AuthService {

    currentUserSubject = new BehaviorSubject<undefined|null|user> (undefined);
    public currentUser = this.currentUserSubject.asObservable().pipe(filter(u=> u!==undefined));

    constructor() { }
    
    getUser(){
        return this.currentUserSubject.value;
    }
    setUser(us : user| null){
        this.currentUserSubject.next(us);
    }
}